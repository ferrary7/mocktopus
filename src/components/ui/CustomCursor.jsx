"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const cursorRef = useRef(null);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  useEffect(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${cursorPosition.x}px, ${cursorPosition.y}px)`;
    }
  }, [cursorPosition]);

  // Only show custom cursor on home page, but ensure the div is still rendered elsewhere
  // to maintain consistent behavior
  return (
    <div 
      ref={cursorRef} 
      className={`fixed w-6 h-6 rounded-full pointer-events-none z-50 hidden md:block ${
        isHomePage 
          ? "bg-white opacity-70 mix-blend-difference" 
          : "opacity-0"
      }`}
      style={{ transition: "transform 0.1s ease-out" }}
    />
  );
}
