import { fabric } from "fabric";

export const useImageUtils = () => {

    const setBackgroundFromImage = (canvas: fabric.Canvas | undefined, url: string, callback: () => void) => {
        if (!canvas) return;

        fabric.Image.fromURL(url, (img) => {

            const canvasHeight = canvas.getHeight();
            const canvasWidth = canvas.getWidth();

            const imgHeight = img.getScaledHeight();
            const imgWidth = img.getScaledWidth();

            const canvasAspect = canvasWidth / canvasHeight;
            const imgAspect = imgWidth / imgHeight;

            let scaleX = 1;
            let scaleY = 1;

            // Scale image proportionally to cover the canvas
            if (canvasAspect >= imgAspect) {
                // Canvas is wider, scale by height
                scaleX = scaleY = canvasWidth / imgWidth;
            } else {
                // Canvas is taller, scale by width
                scaleX = scaleY = canvasHeight / imgHeight;
            }

            canvas.setBackgroundImage(
                img,
                canvas.renderAll.bind(canvas),
                {
                    originX: "center",
                    originY: "center",
                    top: canvasHeight / 2,
                    left: canvasWidth / 2,
                    scaleX: scaleX,
                    scaleY: scaleY,
                }
            );
        });

        callback();
    };

    const setBackgroundFromUpload = (canvas: fabric.Canvas | undefined, event: React.ChangeEvent<HTMLInputElement>, callback: () => void) => {
        if (!canvas || !event.target.files || event.target.files.length === 0) return;

        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;
            fabric.Image.fromURL(result, (img) => {
                canvas.setBackgroundImage(
                    img,
                    canvas.renderAll.bind(canvas),
                    {
                        scaleX: canvas.width! / img.width!,
                        scaleY: canvas.height! / img.height!
                    }
                );
            });
        };

        reader.readAsDataURL(file);
        callback();
    };

    const addImage = (canvas: fabric.Canvas | undefined, url: string, callback: () => void) => {
        if (!canvas) return;

        fabric.Image.fromURL(url, (img) => {
            img.scaleToWidth(100);
            img.set({ left: 100, top: 100 });
            canvas.add(img);
        });
        callback()
    };

    const uploadImage = (canvas: fabric.Canvas | undefined, event: React.ChangeEvent<HTMLInputElement>, callback: () => void) => {
        if (!canvas || !event.target.files || event.target.files.length === 0) return;

        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;
            fabric.Image.fromURL(result, (img) => {
                img.scaleToWidth(100);
                img.set({ left: 100, top: 100 });
                canvas.add(img);
            });
        };

        reader.readAsDataURL(file);
        callback();
    };

    const exportImage = (canvas: fabric.Canvas | undefined) => {
        if (!canvas) return;
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1,
        });

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'custom-image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return { setBackgroundFromImage, setBackgroundFromUpload, uploadImage, exportImage, addImage };
};