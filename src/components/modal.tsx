import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    useEffect(() => {
      if (isOpen) {
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
      // Cleanup to ensure the class is removed when the component unmounts
      return () => document.body.classList.remove("no-scroll");
    }, [isOpen]);
  
    if (!isOpen) return null;
  
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          color:"black"
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
          }}
          onClick={(e) => e.stopPropagation()} // Prevents click on modal content from closing the modal
        >
          {children}
        </div>
      </div>
    );
  };