import { useState, useRef, useEffect } from "react";

interface DraggableOverlayProps {
  id: string;
  content: string;
  initialX: number;
  initialY: number;
  width: number;
  height: number;
  fontSize: number;
  color: string;
  onUpdate: (id: string, x: number, y: number, width: number, height: number) => void;
}

export const DraggableOverlay = ({
  id,
  content,
  initialX,
  initialY,
  width: initialWidth,
  height: initialHeight,
  fontSize,
  color,
  onUpdate,
}: DraggableOverlayProps) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0 });
  const resizeRef = useRef({ startX: 0, startY: 0, startWidth: 0, startHeight: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('resize-handle')) return;
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX - position.x,
      startY: e.clientY - position.y,
    };
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startWidth: size.width,
      startHeight: size.height,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragRef.current.startX;
        const newY = e.clientY - dragRef.current.startY;
        setPosition({ x: newX, y: newY });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeRef.current.startX;
        const deltaY = e.clientY - resizeRef.current.startY;
        const newWidth = Math.max(100, resizeRef.current.startWidth + deltaX);
        const newHeight = Math.max(50, resizeRef.current.startHeight + deltaY);
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const handleMouseUp = () => {
      if (isDragging || isResizing) {
        onUpdate(id, position.x, position.y, size.width, size.height);
      }
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, position, size, id, onUpdate]);

  return (
    <div
      className="absolute cursor-move select-none border-2 border-primary/50 rounded-md p-2"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        fontSize: `${fontSize}px`,
        color: color,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center justify-center h-full overflow-hidden">
        {content}
      </div>
      <div
        className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-primary cursor-se-resize"
        onMouseDown={handleResizeMouseDown}
      />
    </div>
  );
};
