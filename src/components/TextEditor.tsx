import { useTextUtils } from "@/utils/textUtils";
import { useEffect, useRef, useState } from "react";
import { IoColorFill } from "react-icons/io5";
import { BottomSheet } from "./bottomsheet";
import { HiXCircle } from "react-icons/hi2";
import Fonts from "@/data/fonts";

interface TextEditorProps {
  selectedText: fabric.IText;
  canvas: fabric.Canvas;
}

export const TextEditor = ({ selectedText, canvas }: TextEditorProps) => {

  const colorPickerRef = useRef<HTMLInputElement>(null);
  const [fontColor, setFontColor] = useState<string>("#000000");
  const [selectedFont, setSelectedFont] = useState<string>();
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [islineThrough, setIslineThrough] = useState<boolean>(false);
  const [openFontPopup, setOpenFontPopup] = useState<boolean>(false);

  const { updateTextProperty } = useTextUtils();

  useEffect(() => {
    setSelectedFont(selectedText.fontFamily || 'Helvetica');
    setIsBold(selectedText.fontWeight === 'bold');
    setFontColor(selectedText.fill as string || "#000000");
    setIsUnderline(selectedText.underline === true ? true : false);
    setIslineThrough(selectedText.linethrough === true ? true : false);
  }, [selectedText])

  return (
    <div>
      <div className="flex gap-3 place-items-center place-content-center mb-12 text-black">
        <button className="flex flex-col items-center" onClick={() => {
          setOpenFontPopup(true);
        }}>
          <div className="leading-none" style={{ fontFamily: selectedFont }}>A</div>
          <div className="text-xs">Font</div>
        </button>
        <button className="relative flex flex-col items-center" onClick={() => {
          if (colorPickerRef.current) {
            colorPickerRef.current.click();
          }
        }}>
          <IoColorFill color={fontColor} />
          <div className="text-xs">Color</div>
          <input
            type="color"
            ref={colorPickerRef}
            value={fontColor}
            style={{ opacity: '0', position: 'absolute', left: 0, top: 0, width: '30px', }}
            onChange={(e) => {
              setFontColor(e.target.value);
              updateTextProperty(canvas, selectedText, "fill", e.target.value);
            }}
          />
        </button>
        <button className="flex flex-col items-center" onClick={() => {
          updateTextProperty(canvas, selectedText, "fontWeight", isBold ? 'normal' : 'bold');
          setIsBold(!isBold);
        }}>
          <div className="leading-none" style={{ fontWeight: isBold ? 'bold' : 'normal' }}>B</div>
          <div className="text-xs">Bold</div>
        </button>
        <button className="flex flex-col items-center" onClick={() => {
          setIsUnderline(!isUnderline);
          updateTextProperty(canvas, selectedText, "underline", isUnderline ? 'true' : null);
        }}>
          <div className="leading-none underline">U</div>
          <div className="text-xs">Underline</div>
        </button>

        <button className="flex flex-col items-center" onClick={() => {
          setIslineThrough(!islineThrough);
          updateTextProperty(canvas, selectedText, "linethrough", islineThrough ? 'true' : null);
        }}>
          <div className="leading-none line-through">D</div>
          <div className="text-xs">Stroke</div>
        </button>
      </div>
      <BottomSheet isOpen={openFontPopup} onClose={() => setOpenFontPopup(false)}>
        <div className="bg-white shadow-md absolute bottom-0 inset-x-0 pt-12 rounded-t-xl">
          <HiXCircle size={36} onClick={() => setOpenFontPopup(false)} className="absolute mt-1 mr-1 top-0 right-0 cursor-pointer" />
          <div className="max-h-[35vh] overflow-y-auto px-4">
            <div className="grid grid-cols-2 gap-4">
              {Fonts.map((font) => (
                <button key={font} style={{ fontFamily: font, fontSize: 24 }} onClick={() => {
                  if (selectedText) {
                    setSelectedFont(font);
                    updateTextProperty(canvas, selectedText, "fontFamily", font);
                  }
                }}>
                  <div className="flex flex-col border border-black p-4" style={{
                    border: selectedFont === font ? '2px solid black' : '1px solid black',
                    backgroundColor: selectedFont === font ? '#f0f0f0' : ''
                  }}>
                    <span>One More</span>
                    <span className="font-sans text-xs">{font}</span>
                  </div>
                </button>
              ))}

            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};