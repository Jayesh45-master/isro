import logging
import sys

import gradio as gr

from inference import InferenceError, ModelLoadError, load_model, remove_clouds

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("app")

try:
    logger.info("Starting up: loading model...")
    model = load_model()  # reads MODEL_CHECKPOINT_PATH env var, defaults to rice1_best.pth
    logger.info("Model ready. Space is live.")
except ModelLoadError as e:
    # Fail loudly at startup rather than silently serving a broken endpoint -
    # this shows up clearly in the Space's build/runtime Logs tab.
    logger.error(f"FATAL: model failed to load - {e}")
    sys.exit(1)


def predict(image):
    """Gradio callback. Never raises - returns (None, error_message) shape
    via gr.Error so the frontend gets a clean, displayable message instead
    of a stack trace."""
    try:
        return remove_clouds(model, image)
    except InferenceError as e:
        raise gr.Error(str(e))
    except Exception as e:
        logger.exception("Unexpected error in predict()")
        raise gr.Error("An unexpected error occurred while processing the image.")


demo = gr.Interface(
    fn=predict,
    inputs=gr.Image(type="pil", label="Cloudy LISS-IV crop"),
    outputs=gr.Image(type="pil", label="Cloud-free reconstruction"),
    title="BAH 2026 - Generative Cloud Removal for LISS-IV Imagery",
    description=(
        "Upload a cloud-covered LISS-IV satellite image crop. "
        "The U-Net GAN generator reconstructs the cloud-free surface."
    ),
    examples=None,
    allow_flagging="never",
)

# api_name="predict" (the default for a single-fn gr.Interface) is what makes
# this callable via @gradio/client from the frontend, in addition to the web UI.
demo.queue(max_size=20, default_concurrency_limit=2)

if __name__ == "__main__":
    demo.launch()
