"""
U-Net Generator architecture reconstructed from rice1_best.pth state_dict.

Verified against checkpoint layer names/shapes:
  down1..down8  -> encoder (8 downsampling conv blocks, 256x256 -> 1x1)
  up1..up7      -> decoder (7 upsampling conv-transpose blocks, with skip connections)
  final         -> output conv-transpose to 3-channel RGB

Norm layers are InstanceNorm2d(affine=False) - this is why no norm weights
appear in the checkpoint (affine=False layers have no learnable parameters).
down1 and down8 have bias=True (no norm applied directly after them);
all other conv/conv-transpose layers have bias=False.

If your validation output looks slightly off (wrong colors, artifacts), the
most likely culprit is a mismatch in dropout placement or the final
activation (Tanh assumed here) - both are cosmetic-only changes to this file.
"""
import torch
import torch.nn as nn


class DownBlock(nn.Module):
    def __init__(self, in_c, out_c, norm=True, bias=None):
        super().__init__()
        bias = (not norm) if bias is None else bias
        layers = [nn.Conv2d(in_c, out_c, kernel_size=4, stride=2, padding=1, bias=bias)]
        self.model = nn.Sequential(*layers)
        self.norm = nn.InstanceNorm2d(out_c, affine=False) if norm else None
        self.act = nn.LeakyReLU(0.2, inplace=True)

    def forward(self, x):
        x = self.model(x)
        if self.norm is not None:
            x = self.norm(x)
        return self.act(x)


class UpBlock(nn.Module):
    def __init__(self, in_c, out_c, norm=True, dropout=False, bias=None):
        super().__init__()
        bias = (not norm) if bias is None else bias
        layers = [nn.ConvTranspose2d(in_c, out_c, kernel_size=4, stride=2, padding=1, bias=bias)]
        self.model = nn.Sequential(*layers)
        self.norm = nn.InstanceNorm2d(out_c, affine=False) if norm else None
        self.drop = nn.Dropout(0.5) if dropout else None
        self.act = nn.ReLU(inplace=True)

    def forward(self, x):
        x = self.model(x)
        if self.norm is not None:
            x = self.norm(x)
        if self.drop is not None:
            x = self.drop(x)
        return self.act(x)


class UNetGenerator(nn.Module):
    """Pix2pix-style U-Net generator, 256x256 RGB -> RGB (cloud-free reconstruction)."""

    def __init__(self, in_channels=3, out_channels=3, ngf=64):
        super().__init__()
        # Encoder
        self.down1 = DownBlock(in_channels, ngf, norm=False, bias=True)       # 256 -> 128
        self.down2 = DownBlock(ngf, ngf * 2)                                   # 128 -> 64
        self.down3 = DownBlock(ngf * 2, ngf * 4)                               # 64 -> 32
        self.down4 = DownBlock(ngf * 4, ngf * 8)                               # 32 -> 16
        self.down5 = DownBlock(ngf * 8, ngf * 8)                               # 16 -> 8
        self.down6 = DownBlock(ngf * 8, ngf * 8)                               # 8 -> 4
        self.down7 = DownBlock(ngf * 8, ngf * 8)                               # 4 -> 2
        self.down8 = DownBlock(ngf * 8, ngf * 8, norm=False, bias=True)        # 2 -> 1 (bottleneck)

        # Decoder (in_channels doubled where skip connections are concatenated)
        self.up1 = UpBlock(ngf * 8, ngf * 8, dropout=True)                     # 1 -> 2
        self.up2 = UpBlock(ngf * 16, ngf * 8, dropout=True)                    # 2 -> 4
        self.up3 = UpBlock(ngf * 16, ngf * 8, dropout=True)                    # 4 -> 8
        self.up4 = UpBlock(ngf * 16, ngf * 8)                                  # 8 -> 16
        self.up5 = UpBlock(ngf * 16, ngf * 4)                                  # 16 -> 32
        self.up6 = UpBlock(ngf * 8, ngf * 2)                                   # 32 -> 64
        self.up7 = UpBlock(ngf * 4, ngf)                                       # 64 -> 128

        self.final = nn.Sequential(
            nn.ConvTranspose2d(ngf * 2, out_channels, kernel_size=4, stride=2, padding=1, bias=True),
            nn.Tanh(),
        )

    def forward(self, x):
        d1 = self.down1(x)
        d2 = self.down2(d1)
        d3 = self.down3(d2)
        d4 = self.down4(d3)
        d5 = self.down5(d4)
        d6 = self.down6(d5)
        d7 = self.down7(d6)
        d8 = self.down8(d7)

        u1 = self.up1(d8)
        u2 = self.up2(torch.cat([u1, d7], dim=1))
        u3 = self.up3(torch.cat([u2, d6], dim=1))
        u4 = self.up4(torch.cat([u3, d5], dim=1))
        u5 = self.up5(torch.cat([u4, d4], dim=1))
        u6 = self.up6(torch.cat([u5, d3], dim=1))
        u7 = self.up7(torch.cat([u6, d2], dim=1))
        out = self.final(torch.cat([u7, d1], dim=1))
        return out
