import { Client } from "@gradio/client";

const SPACE_ID = "Jayesh455/bah-2026-cloud-removal";
let clientPromise = null;

/**
 * Initializes and caches the Gradio Client connection.
 * @returns {Promise<Client>}
 */
function getClient() {
    if (!clientPromise) {
        clientPromise = Client.connect(SPACE_ID).catch(err => {
            clientPromise = null; // Reset on failure so we can try again
            console.error("Failed to connect to Gradio Space:", err);
            throw new Error("Unable to establish connection to the remote AI service. Please check your network connection.");
        });
    }
    return clientPromise;
}

/**
 * Calls the Hugging Face Space U-Net GAN model to remove clouds from the image.
 * @param {File|Blob} imageFile - The cloudy satellite image.
 * @returns {Promise<string>} - Resolves to an image source URL (object URL or base64).
 */
export async function removeClouds(imageFile) {
    try {
        const client = await getClient();
        
        // Execute prediction
        const result = await client.predict("/predict", {
            image: imageFile
        });

        if (!result || !result.data || result.data.length === 0) {
            throw new Error("No reconstruction data was returned by the model.");
        }

        const data = result.data[0];

        // Handle results defensively: URL string, base64 data URL, object with .url, or raw Blob
        if (data instanceof Blob) {
            return URL.createObjectURL(data);
        } else if (typeof data === "string") {
            return data;
        } else if (data && typeof data === "object" && typeof data.url === "string") {
            return data.url;
        } else if (data && typeof data === "object" && data.data instanceof Blob) {
            return URL.createObjectURL(data.data);
        } else {
            throw new Error("Invalid output format returned by the reconstruction service.");
        }
    } catch (err) {
        console.error("Cloud removal inference failed:", err);
        
        // Wrap error in user-safe message
        const message = err.message || "";
        if (message.includes("Error") || message.includes("predict")) {
            throw new Error(message);
        }
        throw new Error("The reconstruction service failed to process this image. Please ensure it is a valid PNG, JPG, or TIFF image crop.");
    }
}
