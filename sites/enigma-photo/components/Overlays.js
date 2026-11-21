"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { photos } from "@/lib/site";

const OverlayContext = createContext(null);
export const useOverlays = () => useContext(OverlayContext);

export default function Overlays({ children }) {
  const [box, setBox] = useState(null); // { list, index }
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const openLightbox = useCallback((list, index) => setBox({ list, index }), []);
  const notify = useCallback((text) => {
    clearTimeout(toastTimer.current);
    setToast({ text, key: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  return (
    <OverlayContext.Provider value={{ openLightbox, notify }}>
      {children}
      {box && <Lightbox {...box} onClose={() => setBox(null)} />}
      <div className="toast-region" aria-live="polite">
        {toast && (
          <div key={toast.key} className="toast">
            {toast.text}
          </div>
        )}
      </div>
    </OverlayContext.Provider>
  );
}

function Lightbox({ list, index: start, onClose }) {
  const [index, setIndex] = useState(start);
  const root = useRef(null);
  const frame = useRef(null);
  const touch = useRef(null);
  const closeBtn = useRef(null);
  const name = list[index];
  const p = photos[name];

  const go = useCallback(
    (dir) => setIndex((i) => (i + dir + list.length) % list.length),
    [list.length]
  );

  const close = useCallback(() => {
    gsap.to(root.current, { autoAlpha: 0, duration: 0.25, ease: "power2.out", onComplete: onClose });
  }, [onClose]);

  useEffect(() => {
    const prev = document.activeElement;
    document.documentElement.classList.add("is-locked");
    gsap.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: "power2.out" });
    closeBtn.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("is-locked");
      prev?.focus?.();
    };
  }, [close, go]);

  useEffect(() => {
    gsap.fromTo(
      frame.current,
      { autoAlpha: 0, scale: 0.97 },
      { autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out" }
    );
  }, [index]);

  return (
    <div
      ref={root}
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Просмотр фотографии"
      onClick={(e) => e.target === e.currentTarget && close()}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current == null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <figure ref={frame} className="lightbox__frame">
        <img src={p.src} width={p.w} height={p.h} alt={p.alt} />
        <figcaption>
          <span>{p.alt}</span>
          <span className="tabular">
            {index + 1} из {list.length}
          </span>
        </figcaption>
      </figure>
      <div className="lightbox__bar">
        <button className="text-btn" onClick={() => go(-1)}>
          Назад
        </button>
        <button className="text-btn" onClick={() => go(1)}>
          Дальше
        </button>
        <button ref={closeBtn} className="text-btn" onClick={close}>
          Закрыть
        </button>
      </div>
    </div>
  );
}
