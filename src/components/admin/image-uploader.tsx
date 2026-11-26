"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

async function compressImage(
  file: File,
  maxDimension = 800,
  quality = 0.82
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("Compression failed"));
          resolve(
            new File([blob], file.name.toLowerCase().replace(/\.[^.]+$/, ".webp"), {
              type: "image/webp",
            })
          );
        },
        "image/webp",
        quality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

const FALLBACK_IMAGE = "/foodlogin.webp";

type Props = {
  currentImageUrl?: string | null;
  onChange: (file: File | null) => void;
};

export function ImageUploader({ currentImageUrl, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const displaySrc = preview ?? currentImageUrl ?? FALLBACK_IMAGE;
  const hasRealImage = preview !== null || Boolean(currentImageUrl);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressing(true);
    try {
      const compressed = await compressImage(file);
      if (preview) URL.revokeObjectURL(preview);
      const previewUrl = URL.createObjectURL(compressed);
      setPreview(previewUrl);
      onChange(compressed);
    } catch {
      // ignore compression errors silently
    } finally {
      setIsCompressing(false);
    }
    e.target.value = "";
  }

  function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onChange(null);
  }

  return (
    <div className="space-y-2">
      <div
        className="relative w-24 h-24 group cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        <img
          src={displaySrc}
          alt="Product image"
          width={96}
          height={96}
          className="w-24 h-24 rounded-2xl object-cover border border-[#E8D8CC]"
        />
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          {isCompressing ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ImagePlus className="w-5 h-5 text-white" />
          )}
        </div>
        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {isCompressing
          ? "Compressing…"
          : hasRealImage
            ? "Click image to change"
            : "Click to add image"}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
