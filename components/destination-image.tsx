"use client";

import { useEffect, useRef, useState } from "react";

const FALLBACK_IMAGE = "/image/Banner.png";

type DestinationImageProps = {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

/**
 * Destination photos are user-submitted, so a URL can point at an HTML page
 * (for example a Google Images result) or simply stop working. Resolve what
 * we can and fall back to the hero image instead of leaving a broken photo.
 */
function resolveImageUrl(imageUrl?: string) {
  if (!imageUrl) return FALLBACK_IMAGE;

  try {
    const url = new URL(imageUrl);
    return url.searchParams.get("imgurl") ?? imageUrl;
  } catch {
    return imageUrl;
  }
}

export function DestinationImage({
  src,
  alt,
  className,
  priority = false,
}: DestinationImageProps) {
  const [imageSrc, setImageSrc] = useState(() => resolveImageUrl(src));
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImageSrc(resolveImageUrl(src));
  }, [src]);

  useEffect(() => {
    // The image may have failed before React hydrated and attached onError.
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth === 0) {
      setImageSrc(FALLBACK_IMAGE);
    }
  }, [imageSrc]);

  return (
    /* eslint-disable-next-line @next/next/no-img-element -- destination photos use arbitrary user-provided URLs */
    <img
      ref={imageRef}
      src={imageSrc}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setImageSrc(FALLBACK_IMAGE)}
      className={className}
    />
  );
}
