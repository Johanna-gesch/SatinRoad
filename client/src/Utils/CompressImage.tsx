


export function compressImage(file: File, maxDimension = 600, quality = 0.7): Promise<Blob>{
    return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.src = e.target?.result as string;
        };
        img.onload = () => {
            let {width, height} = img;
            if (width > height && width > maxDimension){
                height = (height * maxDimension) / width;
                width = maxDimension;
            }else if (height > maxDimension){
                width = (width * maxDimension) / height;
                height = maxDimension;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => blob ? resolve(blob) : reject(new Error("Compression failed")),
                "image/jpeg",
                quality
            );
        };
        img.onerror = reject;
        reader.onerror = reject;
        reader.readAsDataURL(file);

    });
}