import { useEffect, useRef } from "react";
import "../Styles/CustomCursor.css";

export default function CustomCursor() {
  const rootRef = useRef(null);
  const cursorRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {

    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const root = rootRef.current;
    const cursor = cursorRef.current;
    const icon = iconRef.current;
    const html = document.documentElement;

    html.classList.add("has-custom-cursor");

    let hoverEl = null;
    let isHover = false;

    const bounce = () => {
      icon.classList.remove("bounce");
      void icon.offsetWidth; // reinicia la animación
      icon.classList.add("bounce");
    };


    const checkHover = (el) => {
      if (!el || el.nodeType !== 1) return false;
      if (el.closest("[data-cursor='hover']")) return true;
      html.classList.remove("has-custom-cursor");
      const c = getComputedStyle(el).cursor;
      html.classList.add("has-custom-cursor");
      return c === "pointer" || c === "text";
    };

    const onMove = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      root.classList.add("visible");
    };

    const onOver = (e) => {
      const el = e.target;
      const hov = checkHover(el);

      if (hov) {
        const changedTarget =
          hoverEl && !hoverEl.contains(el) && !el.contains(hoverEl);
        if (!isHover || changedTarget) bounce();
        hoverEl = el;
      } else {
        hoverEl = null;
      }

      isHover = hov;
      root.classList.toggle("hovering", hov);
    };

    const onDown = () => root.classList.add("pressed");
    const onUp = () => root.classList.remove("pressed");
    const onLeave = () => root.classList.remove("visible");
    const onEnter = () => root.classList.add("visible");

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    html.addEventListener("mouseleave", onLeave);
    html.addEventListener("mouseenter", onEnter);

    return () => {
      html.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      html.removeEventListener("mouseleave", onLeave);
      html.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor-root" aria-hidden="true">
      <div ref={cursorRef} className="custom-cursor">
        <div ref={iconRef} className="custom-cursor__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 434.35 434.51"
          >
            <path
              fill="#56b366"
              d="M263.43,263.48l-73.43,161.07c-7.98,13.03-27.85,13.4-36.03.36L.25,25.63C-1.87,9.74,9.66-2.06,25.58.3l392.57,150.43c17.96,5.59,22.3,28.41,6.35,39.32l-161.07,73.43Z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}