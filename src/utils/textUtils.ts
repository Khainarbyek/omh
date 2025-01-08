import { fabric } from "fabric";

export const useTextUtils = () => {

    const addText = (canvas: fabric.Canvas | undefined, callback: () => void) => {
        if (!canvas) return;

        const text = new fabric.IText('Hello World', {
            left: 80,
            top: 250,
            fontSize: 24,
            fill: '#000',
        });

        canvas.add(text);
        canvas.setActiveObject(text);
        callback();
    };

    return { addText };
};