"use client";

import { useState } from "react";

type SmartImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

/**
 * Drop-in replacement for a plain <img>. Shows a shimmering skeleton placeholder
 * until the image decodes, then fades it in. The parent element must be
 * positioned (`relative`) so the absolutely-positioned skeleton overlays it —
 * every image wrapper in this app already is.
 *
 * We keep a native <img> (not next/image) to match the existing Unsplash-URL
 * pattern across the site; the lint rule is intentionally suppressed here only.
 */
export default function SmartImage({ className = "", alt = "", onLoad, ...props }: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <span aria-hidden className="absolute inset-0 z-0 skeleton" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={alt}
        {...props}
        loading={props.loading ?? "lazy"}
        decoding={props.decoding ?? "async"}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={`${className} transition-opacity duration-700 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
