import { fabric } from "fabric";

export const useTextUtils = () => {

    const addText = (canvas: fabric.Canvas | undefined, callback: () => void) => {
        if (!canvas) return;

        const text = new fabric.IText('Hello World', {
            fontSize: 24,
            fill: '#000',
        });

        canvas.add(text);
        callback();
    };

    return { addText };
};