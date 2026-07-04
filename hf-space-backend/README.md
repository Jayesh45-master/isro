---
title: BAH 2026 Cloud Removal
emoji: 🛰️
colorFrom: blue
colorTo: indigo
sdk: gradio
sdk_version: 4.44.0
app_file: app.py
pinned: false
python_version: "3.10"
---

# BAH 2026 Cloud Removal

This Hugging Face Space hosts the production Generative AI Cloud Removal service for LISS-IV imagery, built for the ISRO Bharatiya Antariksh Hackathon 2026 (BAH 2026).

## Model Information
The service utilizes a Pix2pix-style U-Net Generator (U-Net GAN generator, ~217MB) trained to reconstruct cloud-covered LISS-IV optical satellite imagery using multi-modal information.

### Validation Metrics
- **Validation PSNR**: 22.28 dB
- **Validation SSIM**: 0.9129
- **Validation MAE**: 0.0418
