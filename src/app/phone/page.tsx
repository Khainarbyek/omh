"use client"; // next.js app router

// import React, { useState, useEffect } from "react";
// import { fabric } from "fabric";

// import Image from "next/image";

export default function Home() {

    return (
        <div className="w-full relative bg-white h-screen">
            <div className="relative">
                <canvas id="canvas" className="ml-20 mt-16 rounded-[50px]" />
            </div>
        </div>
    );
}
