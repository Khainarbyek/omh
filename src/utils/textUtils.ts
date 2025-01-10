import { fabric } from "fabric";

export const useTextUtils = () => {

    const addText = (canvas: fabric.Canvas | undefined, callback: () => void) => {
        if (!canvas) return;

        const text = new fabric.IText('Hello World', {
            fontSize: 24,
            fill: '#000000',
            fontFamily: 'Helvetica'
        });

        canvas.add(text);
        callback();
    };

    // Update text properties
    const updateTextProperty = (canvas: fabric.Canvas | undefined, iText: fabric.IText, property: keyof fabric.IText, value: string|number|null) => {
        if (iText && canvas) {
            iText.set(property, value);
            canvas.requestRenderAll();
        }
    };

    return { addText, updateTextProperty };
};