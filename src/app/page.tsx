"use client";

import React, { useState, useEffect } from "react";
import { fabric } from "fabric";
import { PixabayImage } from "@/types/pixabay_image";
import { HiXCircle, HiArrowUturnLeft, HiArrowUturnRight } from 'react-icons/hi2';
import Image from 'next/image';
import Phones from '@/data/phones';
import { Phone } from "@/types/phone";

export default function Home() {
    const [canvas, setCanvas] = useState<fabric.Canvas>();
    const [isResetCanvas, setIsResetCanvas] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBackgroundModalOpen, setIsBackgroundModalOpen] = useState(false);
    const [images, setImages] = useState<PixabayImage[]>([]);
    const [selectedPhone, setSelectedPhone] = useState<Phone>(Phones[0]);
    const [history, setHistory] = useState<string[]>([]); // Canvas history
    const [redoStack, setRedoStack] = useState<string[]>([]); // Redo history

    useEffect(() => {

        const c = new fabric.Canvas("canvas", {
            height: selectedPhone.height,
            width: selectedPhone.width,
        });

        // Custom Trash Button Control
        const deleteControl = new fabric.Control({
            x: 0.5,
            y: -0.5,
            offsetX: 10,
            offsetY: -10,
            cursorStyle: "pointer",
            mouseUpHandler: (_, transform) => {
                const target = transform.target;
                c.remove(target); // Remove the object
                c.requestRenderAll(); // Refresh the canvas
                return true; // Return a boolean value
            },
            render: (ctx, left, top) => {
                const img = new window.Image();
                img.src = "/icons/trash-icon.png";
                img.onload = () => {
                    ctx.drawImage(img, left - 12, top - 12, 24, 24);
                };
            },
        });

        // Add the Trash Button to all objects
        fabric.Object.prototype.controls.deleteControl = deleteControl;

        setCanvas(c);

        return () => {
            c.dispose();
        };
    }, [isResetCanvas]);

    // Save the current state of the canvas in history
    const saveCanvasState = () => {
        if (!canvas) return;
        const json = canvas.toJSON();
        setHistory((prev) => [...prev, JSON.stringify(json)]);
        setRedoStack([]); // Clear the redo stack whenever a new action is taken
    };

    const undo = () => {
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

    const redo = () => {
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

    const setBackgroundFromImage = (url: string) => {
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

        setIsBackgroundModalOpen(false);
        saveCanvasState();
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
        saveCanvasState();
    };

    const addImage = (url: string) => {
        if (!canvas) return;

        fabric.Image.fromURL(url, (img) => {
            img.scaleToWidth(100);
            img.set({ left: 100, top: 100 });
            canvas.add(img);
        });

        setIsModalOpen(false);
        saveCanvasState();
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
        saveCanvasState();
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
        saveCanvasState();
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
        saveCanvasState();
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
            <div className="relative h-screen">
                <div className="absolute right-0 z-10 text-white">
                    <div className="flex flex-col place-items-center">
                        <button className="bg-blue-500 inline-block m-4 p-2 rounded-md" onClick={undo} title="Undo"><HiArrowUturnLeft /></button>
                        <button className="bg-blue-500 m-4 p-2 rounded-md" onClick={redo}><HiArrowUturnRight /></button>
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
                        <button className="bg-red-500 m-4 p-2 rounded-md" onClick={() => setIsResetCanvas(isResetCanvas + 1)}>Reset</button>
                    </div>
                </div>

                <div className="ml-4 md:ml-8 my-4 inline-block">
                    <div className="mobileFrame">
                        <Image
                            style={{ position: "absolute", zIndex: 20, pointerEvents: 'none' }}
                            width={selectedPhone.width}
                            height={selectedPhone.height}
                            src={selectedPhone.svg}
                            alt=""
                            priority={false} />
                    </div>
                    <canvas id="canvas" className="rounded-[50px]" />
                </div>
                <div className="absolute bottom-4 left-4">
                    <div className="my-2 text-black inline-block">
                        <select value={selectedPhone?.id} onChange={(e) => {
                            const selectedPhoneId = e.target.value;
                            const phone = Phones.find((p: Phone) => p.id === selectedPhoneId);
                            if (phone != undefined) {
                                setSelectedPhone(phone);
                                setIsResetCanvas(isResetCanvas + 1);
                            }
                        }}>
                            <option value="" disabled>Select a phone</option>
                            {Phones.map((phone: Phone) => (
                                <option key={phone.id} value={phone.id}>
                                    {phone.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Add Image Modal */}
            {isModalOpen && (
                <div className="absolute top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
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
                <div className="absolute top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
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
