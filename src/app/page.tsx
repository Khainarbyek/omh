"use client"; // next.js app router

import React, { useState, useEffect } from "react";
import { fabric } from "fabric";

export default function Home() {


    const [canvas, setCanvas] = useState<fabric.Canvas>();

    useEffect(() => {
        const c = new fabric.Canvas("canvas", {
            height: 610,
            width: 296,
            backgroundColor: "#f5f5f5",
        });

        // settings for all canvas in the app
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = "#2BEBC8";
        fabric.Object.prototype.cornerStyle = "rect";
        fabric.Object.prototype.cornerStrokeColor = "#2BEBC8";
        fabric.Object.prototype.cornerSize = 6;

        fabric.loadSVGFromURL('/iphone-296x608.svg', (objects, options) => {
            const caseGroup = fabric.util.groupSVGElements(objects, options);
            caseGroup.scaleToWidth(296);
            caseGroup.set({ left: 0, top: 0, selectable: false });
            c.add(caseGroup);
        });

        setCanvas(c);

        return () => {
            c.dispose();
        };
    }, []);

    const addRect = (canvas?: fabric.Canvas) => {
        const rect = new fabric.Rect({
            height: 100,
            width: 100,
            stroke: "blue",
            left: 100,
            top: 100,
            fill: "green",
        });
        canvas?.add(rect);
        canvas?.requestRenderAll();
    };

    const addText = (canvas?: fabric.Canvas) => {
        const text = new fabric.Text('Custom Text', {
            left: 100,
            top: 250,
            fontSize: 20,
            fill: '#000',
        });
        canvas?.add(text);
    };

    const addImage = (url: string, canvas?: fabric.Canvas) => {
        fabric.Image.fromURL(url, (img) => {
            img.scaleToWidth(100);
            img.set({ left: 150, top: 150 });
            canvas?.add(img);
        });
    };

    const exportImage = (canvas?: fabric.Canvas) => {
        if (!canvas) return;

        // Specify higher resolution
        const scaleFactor = 2; // Increase scale factor for higher resolution
        const originalWidth = canvas.width || 0;
        const originalHeight = canvas.height || 0;

        // Temporarily scale canvas
        canvas.setDimensions({
            width: originalWidth * scaleFactor,
            height: originalHeight * scaleFactor,
        });
        canvas.setZoom(scaleFactor);

        // const cropArea = {
        //     left: 100, // X-coordinate of the top-left corner
        //     top: 150,  // Y-coordinate of the top-left corner
        //     width: 296, // Width of the cropped area
        //     height: 608, // Height of the cropped area
        // };

        // Generate high-resolution dataURL
        const dataURL = canvas.toDataURL({
            format: 'webp',
            quality: 1,
            // left: cropArea.left,
            // top: cropArea.top,
            // width: cropArea.width,
            // height: cropArea.height,
        });

        // Restore canvas to original size
        canvas.setZoom(1);
        canvas.setDimensions({
            width: originalWidth,
            height: originalHeight,
        });

        // Create a temporary <a> element
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'custom-iphone-case.png';
        document.body.appendChild(link);

        // Trigger download and remove the link
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full relative bg-white h-screen">
            <div className="relative">
                <div className="absolute z-10 text-white">
                    <button className="bg-blue-500 m-4 p-2 rounded-md" onClick={() => exportImage(canvas)}>Export image</button>
                    <button className="bg-blue-500 m-4 p-2 rounded-md" onClick={() => addText(canvas)}>Add Text</button>
                    <button className="bg-blue-500 m-4 p-2 rounded-md" onClick={() => addImage('/friends-350x350.png', canvas)}>Add Image</button>
                    <button className="bg-blue-500 m-4 p-2 rounded-md" onClick={() => addRect(canvas)}>Rectangle</button>
                </div>
                <canvas id="canvas" className="ml-20 mt-16 rounded-[50px]" />
            </div>
        </div>
    );
}
