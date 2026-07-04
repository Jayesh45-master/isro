import logging
import os
import time

import numpy as np
import torch
from PIL import Image
from torchvision import transforms

from model import UNetGenerator

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("inference")

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMG_SIZE = 256
MAX_INPUT_DIMENSION = 4096  # guard against absurdly large uploads

_preprocess = transforms.Compose([
    transforms.Resize((IMG_SIZE, IMG_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize([0.5] * 3, [0.5] * 3),
])


class ModelLoadError(RuntimeError):
    """Raised when the checkpoint can't be found or doesn't match the architecture."""


class InferenceError(RuntimeError):
    """Raised when a valid model fails to process a given input image."""


def load_model(checkpoint_path: str = None) -> UNetGenerator:
    checkpoint_path = checkpoint_path or os.environ.get("MODEL_CHECKPOINT_PATH", "rice1_best.pth")

    if not os.path.exists(checkpoint_path):
        raise ModelLoadError(
            f"Checkpoint not found at '{checkpoint_path}'. Confirm the .pth "
            f"file was uploaded to the Space root and the filename matches "
            f"exactly (case-sensitive)."
        )

    logger.info(f"Loading checkpoint from {checkpoint_path} onto {DEVICE}...")
    t0 = time.time()

    try:
        ckpt = torch.load(checkpoint_path, map_location=DEVICE, weights_only=True)
    except Exception as e:
        raise ModelLoadError(f"torch.load failed on '{checkpoint_path}': {e}") from e

    state_dict = ckpt.get("generator", ckpt) if isinstance(ckpt, dict) else ckpt

    model = UNetGenerator()
    try:
        model.load_state_dict(state_dict, strict=True)
    except RuntimeError as e:
        raise ModelLoadError(
            f"state_dict does not match UNetGenerator architecture in "
            f"model.py. If this checkpoint was retrained with different "
            f"layer sizes, model.py must be updated. Original error: {e}"
        ) from e

    model.to(DEVICE)
    model.eval()

    if isinstance(ckpt, dict) and "metrics" in ckpt:
        logger.info(f"Checkpoint metrics: {ckpt.get('metrics')}")
    logger.info(f"Model loaded successfully in {time.time() - t0:.1f}s")
    return model


@torch.inference_mode()
def remove_clouds(model: UNetGenerator, pil_image: Image.Image) -> Image.Image:
    """Takes a PIL image (cloudy LISS-IV crop), returns cloud-free reconstruction.
    Raises InferenceError with a user-safe message on failure."""
    if pil_image is None:
        raise InferenceError("No image was provided.")

    w, h = pil_image.size
    if w > MAX_INPUT_DIMENSION or h > MAX_INPUT_DIMENSION:
        raise InferenceError(
            f"Image too large ({w}x{h}). Maximum supported dimension is "
            f"{MAX_INPUT_DIMENSION}px per side."
        )

    t0 = time.time()
    try:
        orig_size = pil_image.size
        x = _preprocess(pil_image.convert("RGB")).unsqueeze(0).to(DEVICE)
        y = model(x)

        y = y.squeeze(0).cpu().clamp(-1, 1)
        y = (y + 1) / 2
        y = (y.permute(1, 2, 0).numpy() * 255).astype(np.uint8)
        out_img = Image.fromarray(y).resize(orig_size, Image.LANCZOS)
    except Exception as e:
        logger.exception("Inference failed")
        raise InferenceError(
            "The model failed to process this image. This is usually caused "
            "by a corrupted upload or an unsupported image mode."
        ) from e

    logger.info(f"Inference completed in {time.time() - t0:.2f}s for {orig_size} image")
    return out_img
