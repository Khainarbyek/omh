"use client";

import React, { useState, useEffect, useRef } from "react";
import { fabric } from "fabric";
import { PixabayImage } from "@/types/pixabay_image";
import { HiXCircle, HiArrowUturnLeft, HiArrowUturnRight, HiArrowDownOnSquare, HiMiniTrash, HiArrowUpCircle, HiSquare3Stack3D } from 'react-icons/hi2';
import Image from 'next/image';
import Phones from '@/data/phones';
import { Phone } from "@/types/phone";
import { useHistory } from '@/utils/historyUtils';
import { Modal } from '@/components/modal';
import { useImageUtils } from '@/utils/imageUtils';
import { Action } from "@/types/action";
import { AiFillMobile, AiOutlineFontSize } from "react-icons/ai";
import { IoImageSharp } from "react-icons/io5";
import { useTextUtils } from "@/utils/textUtils";
import "../../public/fonts.css"
import { TextEditor } from "@/components/TextEditor";
import { BottomSheet } from "@/components/bottomsheet";
import "../../public/fonts.css"
import { Layers } from "@/components/Layers";
export default function Home() {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | undefined>();
    const [isResetCanvas, setIsResetCanvas] = useState<number>(0);

    const { addText } = useTextUtils();
    const { setBackgroundFromImage, setBackgroundFromUpload, uploadImage, exportImage, addImage } = useImageUtils();

    const [images, setImages] = useState<PixabayImage[]>([]);
    const [selectedPhone, setSelectedPhone] = useState<Phone>(Phones[0]);
    const [openPopup, setOpenPopup] = useState<Action>('');
    const { saveCanvasState, undo, redo } = useHistory();
    const [selectedImageTab, setSelectedImageTab] = useState<number>(0);
    const [objects, setObjects] = useState<fabric.Object[]>([]);
    const [selectedObject, setSelectedObject] = useState<fabric.Object | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const s = window.innerHeight * 0.8;
            let height = 800;

            if (height > s) {
                height = s;
            }

            const width = height / selectedPhone.height * selectedPhone.width;

            const c = new fabric.Canvas(canvasRef.current, {
                height: height,
                width: width
            });

            fabricCanvasRef.current = c;

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
                    img.src = '/icons/trash.svg';
                    img.onload = () => {
                        ctx.drawImage(img, left - 12, top - 12, 24, 24);
                    };
                },
            });

            // Add the Trash Button to all objects
            fabric.Object.prototype.controls.deleteControl = deleteControl;

            c.on('object:added', function (e) {
                if (e.target) {
                    c.setActiveObject(e.target);
                    c.centerObject(e.target);
                }
                setObjects(c.getObjects());
            });

            // Handle selection events
            c.on("selection:created", (e) => {
                setSelectedObject(e.selected?.[0] || null);
            });

            c.on('selection:updated', (e) => {
                setSelectedObject(e.selected?.[0] || null);
            });

            c.on("selection:cleared", () => {
                setSelectedObject(null);
            });

            c.on('object:removed', () => {
                setObjects(c.getObjects());
            });

            // c.on('object:selected', (e) => {
            //     const selectedObject = e.target;
                
            //     // Disable the automatic bringing to front by removing this line
            //     // selectedObject.bringToFront(); // Do not call this method
              
            //     // Optionally, you can force the selected object to stay where it is in the stack
            //     // selectedObject.moveTo(selectedObject.canvas._objects.length - 1); // Keeps it in the same layer position
            //   });
              

            setObjects(c.getObjects());

            setCanvas(c);

            return () => {
                c.dispose();
            };
        }
    }, [isResetCanvas, selectedPhone]);

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

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await fetch('/api/images', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        searchQuery: 'iphone',
                        category: 'fashion',
                        per_page: 9,
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
        <div className="w-full h-full relative bg-gray-200">
            <div className="relative h-screen">
                <div className="ml-16 my-16 inline-block relative">
                    <div className="mobileFrame overflow-hidden">
                        <Image
                            className="object-contain"
                            style={{ position: "absolute", zIndex: 20, pointerEvents: 'none' }}
                            width={fabricCanvasRef?.current?.getWidth() || selectedPhone.width}
                            height={fabricCanvasRef?.current?.getHeight() || selectedPhone.height}
                            src={selectedPhone.svg}
                            alt=""
                            priority
                        />
                    </div>
                    <div className="absolute left-0 -ml-14 z-10 text-white">
                        <div className="flex flex-col place-items-center gap-4">
                            <div className="flex flex-col gap-2 rounded-xl p-2 bg-black">
                                <button className="action-button" onClick={() => undo(canvas)} title="Undo"><HiArrowUturnLeft /></button>
                                <button className="action-button" onClick={() => redo(canvas)}><HiArrowUturnRight /></button>
                            </div>
                            <div className="flex flex-col gap-2 bg-black rounded-xl p-2">
                                <button className="action-button" onClick={() => addText(canvas, () => saveCanvasState(canvas))}><AiOutlineFontSize /></button>
                                <button className="action-button" onClick={() => setOpenPopup('open_image_popup')}><IoImageSharp /></button>
                                <button className="action-button" onClick={() => {
                                    setOpenPopup('open_layer_bottom_sheet');
                                }}><HiSquare3Stack3D /></button>
                                <button className="action-button" onClick={() => setOpenPopup('open_background_image_popup')}><AiFillMobile /></button>
                            </div>

                            <div className="flex flex-col gap-2 bg-black rounded-xl p-2">
                                <button className="action-button" onClick={() => exportImage(canvas)}><HiArrowDownOnSquare /></button>
                            </div>

                            <div className="flex flex-col gap-2 bg-red-500 rounded-xl p-2">
                                <button className="action-button" onClick={() => setOpenPopup('open_ask_popup')}><HiMiniTrash /></button>
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-0 -mt-12 left-4 right-4 text-center">
                        <div className="my-2 text-black inline-block relative text-xs">
                            <select
                                className="px-4 py-2 rounded-lg"
                                value={selectedPhone?.id} onChange={(e) => {
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

                    <canvas ref={canvasRef} id="canvas" className="rounded-[50px]" />
                </div>

                {/* Popup Text Editor */}
                {(selectedObject instanceof fabric.IText && canvas) && (
                    <div
                        className="bg-gray-300 rounded-2xl h-16"
                        style={{
                            position: "absolute",
                            top: (fabricCanvasRef?.current?.getHeight() ?? 1) + 70,
                            width: fabricCanvasRef?.current?.getWidth() || selectedPhone.width,
                            left: canvasRef.current ? canvasRef.current.getBoundingClientRect().left : 0,
                            padding: "16px",
                            zIndex: 100,
                        }}
                    >
                        <TextEditor selectedText={selectedObject} canvas={canvas} />
                    </div>
                )}
            </div>

            <BottomSheet isOpen={openPopup === 'open_layer_bottom_sheet'} onClose={() => setOpenPopup('')}>
                <div
                    className="bg-gray-300 rounded-2xl"
                    style={{
                        position: "absolute",
                        bottom: 0,
                        width: fabricCanvasRef?.current?.getWidth() || selectedPhone.width,
                        left: canvasRef.current ? canvasRef.current.getBoundingClientRect().left : 0,
                        padding: "16px",
                        zIndex: 100,
                    }}
                >
                    {
                        canvas && fabricCanvasRef.current && (
                            <Layers canvas={canvas} selectedObject={selectedObject} setSelectedObject={setSelectedObject} fabricObjects={objects} />
                        )
                    }
                </div>
            </BottomSheet>

            <Modal isOpen={openPopup === 'open_ask_popup'} onClose={() => setOpenPopup('')}>
                <div className="max-w-md relative p-4">
                    <HiXCircle size={36} onClick={() => setOpenPopup('')} className="absolute -mt-2 -mr-2 top-0 right-0 cursor-pointer" />
                    <h1 className="text-lg font-bold">Are you sure you want to reset the design?</h1>
                    <p>This action will clear all the designs you have created. You will need to start from scratch. Are you sure you want to proceed?</p>
                    <div className="flex flex-row gap-8 mt-4 place-content-center">
                        <button className="border px-6 py-2 rounded-md border-black" onClick={() => setOpenPopup('')}>Cancel</button>
                        <button className="border px-6 py-2 rounded-md border-red-500 text-red-500" onClick={() => {
                            setOpenPopup('');
                            setIsResetCanvas(isResetCanvas + 1);
                        }}>Reset</button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={openPopup === 'open_image_popup'} onClose={() => setOpenPopup('')}>
                <div className="max-w-4xl min-w-[70vw] relative">
                    <div className="p-4 flex flex-row gap-2">
                        <HiXCircle size={36} onClick={() => setOpenPopup('')} className="absolute -mt-2 -mr-2 top-0 right-0 cursor-pointer" />
                        <button onClick={() => setSelectedImageTab(0)} className={`border px-3 p-1 rounded-md ${selectedImageTab === 0 && 'bg-black text-white'}`}>Upload an Image</button>
                        <button onClick={() => setSelectedImageTab(1)} className={`border px-3 p-1 rounded-md ${selectedImageTab === 1 && 'bg-black text-white'}`}>Select an Image</button>
                    </div>
                    {
                        selectedImageTab === 0 && (
                            <div className="max-h-[70vh] overflow-y-auto">
                                <div className="inline-block mx-auto min-h-[70vh]">
                                    <label className="border-2 border-black border-dashed m-4 p-8 rounded-md cursor-pointer flex flex-col place-items-center">
                                        <HiArrowUpCircle size={48} />
                                        Upload an Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => uploadImage(canvas, e, () => {
                                                saveCanvasState(canvas);
                                                setOpenPopup('');
                                            })}
                                        />
                                    </label>
                                </div>
                            </div>
                        )
                    }
                    {
                        selectedImageTab === 1 && (
                            <div className="max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                    {images.map((image) => (
                                        <div
                                            key={image.id}
                                            className="cursor-pointer border p-2 hover:shadow-lg"
                                            onClick={() => addImage(canvas, image.largeImageURL, () => {
                                                setOpenPopup('');
                                                saveCanvasState(canvas);
                                            })}
                                        >
                                            <img src={image.webformatURL} alt={image.tags} className="w-full h-auto" />
                                            <p className="text-center mt-2">{image.tags}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                </div>
            </Modal>

            <Modal isOpen={openPopup === 'open_background_image_popup'} onClose={() => setOpenPopup('')}>
                <div className="max-w-4xl min-w-[70vw] relative">
                    <div className="p-4 flex flex-row gap-2">
                        <HiXCircle size={36} onClick={() => setOpenPopup('')} className="absolute -mt-2 -mr-2 top-0 right-0 cursor-pointer" />
                        <button onClick={() => setSelectedImageTab(0)} className={`border px-3 p-1 rounded-md ${selectedImageTab === 0 && 'bg-black text-white'}`}>Upload Background Image</button>
                        <button onClick={() => setSelectedImageTab(1)} className={`border px-3 p-1 rounded-md ${selectedImageTab === 1 && 'bg-black text-white'}`}>Select Background Image</button>
                    </div>
                    {
                        selectedImageTab === 0 && (
                            <div className="max-h-[70vh] overflow-y-auto">
                                <div className="inline-block mx-auto min-h-[70vh]">
                                    <label className="border-2 border-black border-dashed m-4 p-8 rounded-md cursor-pointer flex flex-col place-items-center">
                                        <HiArrowUpCircle size={48} />
                                        Upload an Image
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={(e) => setBackgroundFromUpload(canvas, e, () => {
                                                saveCanvasState(canvas);
                                                setOpenPopup('');
                                            })}
                                        />
                                    </label>
                                </div>
                            </div>
                        )
                    }
                    {
                        selectedImageTab === 1 && (
                            <div className="max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                    {images.map((image) => (
                                        <div
                                            key={image.id}
                                            className="cursor-pointer border p-2 hover:shadow-lg"
                                            onClick={() => setBackgroundFromImage(canvas, image.largeImageURL, () => {
                                                setOpenPopup('');
                                                saveCanvasState(canvas);
                                            })}
                                        >
                                            <img src={image.webformatURL} alt={image.tags} className="w-full h-auto" />
                                            <p className="text-center mt-2">{image.tags}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                </div>
            </Modal>
        </div>
    );
}
