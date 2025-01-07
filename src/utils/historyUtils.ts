import { useState } from "react";
import { fabric } from "fabric";

export const useHistory = () => {
    const [history, setHistory] = useState<string[]>([]); // Canvas history
    const [redoStack, setRedoStack] = useState<string[]>([]); // Redo history

    // Save the current state of the canvas in history
    const saveCanvasState = (canvas: fabric.Canvas | undefined) => {
        if (!canvas) return;
        const json = canvas.toJSON();
        setHistory((prev) => [...prev, JSON.stringify(json)]);
        setRedoStack([]); // Clear the redo stack whenever a new action is taken
    };

    const undo = (canvas: fabric.Canvas | undefined) => {
        if (!canvas) return;

        if (!history.length) {
            canvas.clear();
        } else {
            const newHistory = [...history];
            const lastState = newHistory.pop(); // Remove the latest state
            setHistory(newHistory);

            const redoState = JSON.stringify(canvas.toJSON()); // Save the current state for redo
            setRedoStack((prev) => [...prev, redoState]);

            if (lastState) {
                canvas.loadFromJSON(lastState, () => {
                    canvas.renderAll();
                });
            }
        }
    };

    const redo = (canvas: fabric.Canvas | undefined) => {
        if (!redoStack.length || !canvas) return;

        const newRedoStack = [...redoStack];
        const nextState = newRedoStack.pop(); // Remove the next redo state
        setRedoStack(newRedoStack);

        const currentState = JSON.stringify(canvas.toJSON()); // Save the current state for undo
        setHistory((prev) => [...prev, currentState]);

        if (nextState) {
            canvas.loadFromJSON(nextState, () => {
                canvas.renderAll();
            });
        }
    };

    return { saveCanvasState, undo, redo };
};