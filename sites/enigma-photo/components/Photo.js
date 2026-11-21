import { photos } from "@/lib/site";

// Кадр «проявляется»: рамка открывается маской, а тёмный слой проявителя уходит.
export default function Photo({ name, className = "", priority = false, develop = true, sizes, ...rest }) {
  const p = photos[name];
  return (
    <div className={`photo ${className}`} data-reveal={develop ? "develop" : undefined} {...rest}>
      <img
        src={p.src}
        width={p.w}
        height={p.h}
        alt={p.alt}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
      />
      {develop && <span className="photo__developer" aria-hidden="true" />}
    </div>
  );
}
