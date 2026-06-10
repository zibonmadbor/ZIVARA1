/**
 * Converts an image URL or path to a base64 data URL
 * Works with local imported images, URLs, and already base64 images
 */
export async function imageToBase64(imageSrc: string): Promise<string> {
  // If already base64, return as-is
  if (imageSrc.startsWith("data:image")) {
    return imageSrc;
  }

  // If it's a full URL, fetch and convert
  if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Failed to fetch image from URL:", error);
      throw new Error("Failed to load image from URL");
    }
  }

  // For local/imported images, use an Image element and canvas
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      
      try {
        // Convert to base64 (use JPEG for smaller size)
        const base64 = canvas.toDataURL("image/jpeg", 0.85);
        resolve(base64);
      } catch (error) {
        reject(new Error("Failed to convert image to base64"));
      }
    };
    
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    
    // Handle both absolute paths and relative paths
    img.src = imageSrc;
  });
}
