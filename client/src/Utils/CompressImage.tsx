


export function compressImage(file: File, maxDimension = 600, quality = 0.7): Promise<Blob>{
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        // Once the file is read as a data URL, load it into an image element
        // so its pixel dimensions become available for scaling

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        img.onload = () => {
            let {width, height} = img;

            // Scale down proportionally so the longer side never exceeds maxDimension,
            // keeping the original aspect ratio intact
            if (width > height && width > maxDimension){
                height = (height * maxDimension) / width;
                width = maxDimension;
            }else if (height > maxDimension){
                width = (width * maxDimension) / height;
                height = maxDimension;
            }

            // Draw the resized image onto an off-screen canvas,
            // which is that actually performs the downscaling
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);

            // Export the canvas as a compressed JPEG blob, ready to be uploaded
            canvas.toBlob(
                (blob) => blob ? resolve(blob) : reject(new Error("Compression failed")),
                "image/jpeg",
                quality
            );
        };
        // Reject the promise if either the image or the file reader fails
        img.onerror = reject;
        reader.onerror = reject;

        // Kick off the whole process by reading the file as a data URL
        reader.readAsDataURL(file);

    });
}