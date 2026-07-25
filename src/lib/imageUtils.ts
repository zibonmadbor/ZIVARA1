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

/**
 * Composites a clothing garment image onto a user photo using Canvas.
 * Creates a visually realistic virtual try-on overlay.
 */
export async function compositeTryOn(
  userImgSrc: string,
  garmentImgSrc: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const userImg = new Image();
    userImg.crossOrigin = "anonymous";

    userImg.onload = () => {
      const garmentImg = new Image();
      garmentImg.crossOrigin = "anonymous";

      garmentImg.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas context failed"));
          return;
        }

        canvas.width = userImg.naturalWidth || 800;
        canvas.height = userImg.naturalHeight || 1066;

        // Step 1: Draw original user photo
        ctx.drawImage(userImg, 0, 0, canvas.width, canvas.height);

        // Step 2: Calculate garment position on upper body / torso
        // Garment width: ~55% of user photo width
        const garmentWidth = canvas.width * 0.58;
        const aspectRatio = garmentImg.naturalWidth / garmentImg.naturalHeight;
        const garmentHeight = garmentWidth / aspectRatio;

        // Garment position: Centered horizontally, ~22% down from top
        const posX = (canvas.width - garmentWidth) / 2;
        const posY = canvas.height * 0.22;

        // Step 3: Draw soft shadow for depth
        ctx.save();
        ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 8;

        // Step 4: Draw garment overlay onto user torso
        ctx.globalAlpha = 0.96;
        ctx.drawImage(garmentImg, posX, posY, garmentWidth, garmentHeight);
        ctx.restore();

        // Step 5: Subtle color adjustment & edge blend
        ctx.save();
        ctx.globalCompositeOperation = "overlay";
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        try {
          const resultBase64 = canvas.toDataURL("image/png");
          resolve(resultBase64);
        } catch (err) {
          reject(err);
        }
      };

      garmentImg.onerror = () => reject(new Error("Failed to load garment image"));
      garmentImg.src = garmentImgSrc;
    };

    userImg.onerror = () => reject(new Error("Failed to load user photo"));
    userImg.src = userImgSrc;
  });
}

