"use client";

import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import { PixabayImage } from "@/types/pixabay_image";
import { HiXCircle } from 'react-icons/hi2';


export default function Home() {
    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
    const [images, setImages] = useState<PixabayImage[]>([]);

    useEffect(() => {
        const c = new fabric.Canvas("canvas", {
            height: 610,
            width: 296,
            backgroundColor: "#f5f5f5",
        });

        // Custom Trash Button Control
        const deleteControl = new fabric.Control({
            x: 0.5,
            y: -0.5,
            offsetX: 10,
            offsetY: -10,
            cursorStyle: "pointer",
            mouseUpHandler: (eventData, transform) => {
                const target = transform.target;
                c.remove(target); // Remove the object
                c.requestRenderAll(); // Refresh the canvas
                return true; // Return a boolean value
            },
            render: (ctx, left, top) => {
                const img = new Image();
                img.src = "/icons/trash-icon.png"; // Replace with your trash icon path
                img.onload = () => {
                    ctx.drawImage(img, left - 12, top - 12, 24, 24);
                };
            },
        });

        // Add the Trash Button to all objects
        fabric.Object.prototype.controls.deleteControl = deleteControl;

        // Load SVG Background
        fabric.loadSVGFromURL('/iphone-296x608.svg', (objects, options) => {
            let caseGroup;
            if (Array.isArray(objects)) {
                // Handle older Fabric.js versions
                caseGroup = fabric.util.groupSVGElements(objects, options);
            } else {
                // Handle newer Fabric.js versions
                caseGroup = objects;
            }
            caseGroup.scaleToWidth(296);
            caseGroup.set({ left: 0, top: 0, selectable: false });
            c.add(caseGroup);
        });

        setCanvas(c);

        return () => {
            c.dispose();
        };
    }, []);

    const resetCanvas = () => {
        if (!canvas) return;

        canvas.clear();
        canvas.setBackgroundColor("#f5f5f5", canvas.renderAll.bind(canvas));

        fabric.loadSVGFromURL('/iphone-296x608.svg', (objects, options) => {
            let caseGroup;
            if (Array.isArray(objects)) {
                caseGroup = fabric.util.groupSVGElements(objects, options);
            } else {
                caseGroup = objects;
            }
            caseGroup.scaleToWidth(296);
            caseGroup.set({ left: 0, top: 0, selectable: false });
            canvas.add(caseGroup);
        });
    };

    const setBackgroundFromImage = (url: string) => {
        if (!canvas) return;

        fabric.Image.fromURL(url, (img) => {
            canvas.setBackgroundImage(
                img,
                canvas.renderAll.bind(canvas),
                {
                    scaleX: canvas.width! / img.width!,
                    scaleY: canvas.height! / img.height!
                }
            );
        });

        setIsBackgroundModalOpen(false);
    };

    const setBackgroundFromUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        setIsBackgroundModalOpen(false);
    };

    const addImage = (url: string) => {
        if (!canvas) return;

        fabric.Image.fromURL(url, (img) => {
            img.scaleToWidth(100);
            img.set({ left: 100, top: 100 });
            canvas.add(img);
        });

        setIsModalOpen(false);
    };

    const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    };

    //TODO: Use the cloneProduct function cloneProduct("9692855959837");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cloneProduct = async (productId: string) => {
        const response = await fetch('/api/shopify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ originalProductId: productId }),
        });

        const data = await response.json();
        console.log('Cloned Product:', data);
    };

    const exportImage = (canvas?: fabric.Canvas) => {
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

    const addText = (canvas?: fabric.Canvas) => {
        if (!canvas) return;

        const text = new fabric.IText('Custom Text', {
            left: 100,
            top: 100,
            fontSize: 20,
            fill: '#000',
        });

        canvas.add(text);
        canvas.setActiveObject(text);
    };

    const addRect = (canvas?: fabric.Canvas) => {
        if (!canvas) return;

        const rect = new fabric.Rect({
            width: 100,
            height: 100,
            fill: 'green',
            stroke: 'blue',
            left: 50,
            top: 50,
        });

        canvas.add(rect);
        canvas.setActiveObject(rect);
    };

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('/api/images', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        searchQuery: 'iphone',
                        category: 'fashion',
                        per_page: 30,
                        image_type: 'photo',
                    }),
                });
                const data = await response.json();
                if (data.hits) setImages(data.hits);
            } catch (error) {
                console.error('Error fetching images:', error);
            }
        };

        fetchImages();
    }, []);


    return (
        <div className="w-full relative bg-white h-screen">
            <div className="relative">
                <div className="absolute z-10 text-white">
                    <button className="bg-blue-500 m-4 p-2 rounded-md" onClick={() => exportImage(canvas)}>Export image</button>
                    <button className="bg-blue-500 m-4 p-2 rounded-md" onClick={() => addText(canvas)}>Add Text</button>
                    <button className="bg-blue-500 m-4 p-2 rounded-md" onClick={() => addRect(canvas)}>Rectangle</button>
                    <button className="bg-blue-500 m-4 p-2 rounded-md" onClick={() => setIsModalOpen(true)}>Add Image</button>
                    <label className="bg-blue-500 m-4 p-2 rounded-md cursor-pointer inline-block">
                        Upload Image
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={uploadImage}
                        />
                    </label>
                    <button className="bg-blue-500 m-4 p-2 rounded-md" onClick={() => setIsBackgroundModalOpen(true)}>Background</button>
                    <button className="bg-red-500 m-4 p-2 rounded-md" onClick={resetCanvas}>Reset</button>
                </div>
                <canvas id="canvas" className="ml-20 mt-16 rounded-[50px]" />
            </div>

            {/* Add Image Modal */}
            {isModalOpen && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 relative rounded-md w-1/2 z-10 max-h-[90vh] overflow-y-auto text-black">
                        <HiXCircle size={36} onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 cursor-pointer" />
                        <h2 className="text-center mb-4">Select an Image</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className="cursor-pointer border p-2 hover:shadow-lg"
                                    onClick={() => addImage(image.largeImageURL)}
                                >
                                    <img src={image.webformatURL} alt={image.tags} className="w-full h-auto" />
                                    <p className="text-center mt-2">{image.tags}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Background Modal */}
            {isBackgroundModalOpen && (
                <div className="absolute top-0 left-0 z-10 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 relative rounded-md w-1/2 z-10 max-h-[90vh] overflow-y-auto text-black">
                        <HiXCircle size={36} onClick={() => setIsBackgroundModalOpen(false)} className="absolute top-4 right-4 cursor-pointer" />
                        <h2 className="text-center mb-4">Select a Background</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className="cursor-pointer border p-2 hover:shadow-lg"
                                    onClick={() => setBackgroundFromImage(image.largeImageURL)}
                                >
                                    <img src={image.webformatURL} alt={image.tags} className="w-full h-auto" />
                                    <p className="text-center mt-2">{image.tags}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <label className="bg-blue-500 text-white p-2 rounded-md cursor-pointer inline-block">
                                Upload
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={setBackgroundFromUpload}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
