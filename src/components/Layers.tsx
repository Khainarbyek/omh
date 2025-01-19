import { useState } from "react";
import { FaFileImage } from "react-icons/fa6";
import { MdCheckBoxOutlineBlank, MdOutlineTextFields } from "react-icons/md";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { AiOutlineDrag } from "react-icons/ai";
interface LayersProps {
  canvas: fabric.Canvas,
  selectedObject: fabric.Object | null;
  setSelectedObject: React.Dispatch<React.SetStateAction<fabric.Object | null>>,
  fabricObjects: fabric.Object[]
}

type FabricObjectList = SortableFabricObject[];

export const Layers = ({ selectedObject, fabricObjects, canvas, setSelectedObject }: LayersProps) => {

  const createSortedObjects = () => {
    return fabricObjects.map((obj, index) => ({
      id: `object-${index}`,
      object: obj,
    }))
  }

  const [objects, setObjects] = useState<FabricObjectList>(
    createSortedObjects()
  );

  // // Handler to update the order of the objects
  const handleSort = (sortedObjects: FabricObjectList) => {
    setObjects(sortedObjects);

    const canvas = objects[0]?.object.canvas;
    if (canvas) {
      sortedObjects.forEach(({ object }, index) => {
        object.moveTo(index); // Set the new stacking order
      });

      canvas.renderAll(); // Re-render the canvas after updating
      canvas.discardActiveObject();
    }
  };

  const handleSelectObject = (object: fabric.Object) => {
    canvas?.setActiveObject(object);
    canvas?.renderAll();
    setSelectedObject(object);
  };

  // // Function to move object forward in the stack
  // const bringForward = () => {
  //   if (selectedObject && canvasRef.current) {
  //     canvasRef.current?.bringForward(selectedObject);
  //     canvasRef.current?.renderAll();
  //     setObjects(createSortedObjects() ?? []);
  //   }
  // };

  // // Function to move object backward in the stack
  // const sendBackward = () => {
  //   if (selectedObject && canvasRef.current) {
  //     canvasRef.current?.sendBackwards(selectedObject);
  //     canvasRef.current?.renderAll();
  //     setObjects(createSortedObjects() ?? []);
  //   }
  // };

  // const bringToFront = () => {
  //   if (selectedObject && canvasRef.current) {
  //     canvasRef.current?.bringToFront(selectedObject);
  //     canvasRef.current?.renderAll();
  //   }
  // };

  // const sendToBack = () => {
  //   if (selectedObject && canvasRef.current) {
  //     canvasRef.current?.sendToBack(selectedObject);
  //     canvasRef.current?.renderAll();
  //   }
  // };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-2 place-items-center place-content-center">
        <div className="pb-2 flex-grow leading-0">Layers</div>
        {/* <button onClick={() => bringForward()} disabled={!selectedObject}>
          <TbLayersSelected size={24} title="Bring forward" />
        </button>
        <button onClick={() => sendBackward()} disabled={!selectedObject}>
          <TbLayersSelectedBottom size={24} title="Send backward" />
        </button>
        <button onClick={() => bringToFront()} disabled={!selectedObject}>
          <BiSolidLayer size={24} title="Bring to front" />
        </button>
        <button onClick={() => sendToBack()} disabled={!selectedObject}>
          <VscLayersDot size={24} title="Send to back" />
        </button> */}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {objects.map((item, index) => (
          <div
            key={item.id}
            onClick={() => handleSelectObject(item.object)}>
            <SortableItem
              index={index}
              id={item.id}
              isSelected={item.object === selectedObject}
              sortableObject={item}
              objects={objects}
              setObjects={handleSort}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

interface SortableFabricObject {
  id: string;
  object: fabric.Object;
}

interface SortableItemProps {
  id: string;
  index: number;
  isSelected: boolean,
  sortableObject: SortableFabricObject;
  objects: FabricObjectList;
  setObjects: (objects: FabricObjectList) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, index, sortableObject, isSelected, objects, setObjects }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('draggedIndex', index.toString());
  };

  const handleDrop = (e: React.DragEvent) => {
    const draggedIndex = parseInt(e.dataTransfer.getData('draggedIndex'), 10);
    const targetIndex = index;

    // Swap the items
    const updatedObjects = [...objects];
    const [draggedItem] = updatedObjects.splice(draggedIndex, 1);
    updatedObjects.splice(targetIndex, 0, draggedItem);

    setObjects(updatedObjects);
  };

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "8px",
    margin: "4px 0",
    backgroundColor: isSelected ? '#ccc' : 'transparent',
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "grab",
    color: "#000"
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()} // Allow drop
      style={style}
      ref={setNodeRef}
      {...attributes} {...listeners}
    >
      <div className="flex place-items-center place-content-between">
        {
          sortableObject.object.type === 'image' ?
            <FaFileImage /> :
            sortableObject.object.type === 'i-text' ?
              <MdOutlineTextFields /> :
              <MdCheckBoxOutlineBlank />
        }

        {
          sortableObject.object.type === 'i-text' ?
            (sortableObject.object as fabric.IText).text ?? id :
            sortableObject.object.type
        }
        <div className="">
          <AiOutlineDrag />
        </div>
      </div>
    </div>
  );
};