"use client";

import type React from "react";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  value?: string | null;
  className?: string;
}

export function ImageUpload({ onChange, value, className }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    } else {
      setPreview(null);
      onChange(null);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <div
        className={cn(
          "relative flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg overflow-hidden",
          "bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer",
          preview ? "border-primary" : "border-muted-foreground/25"
        )}
        onClick={handleClick}
      >
        {preview ? (
          <>
            <img
              src={preview || "/placeholder.svg"}
              alt="Preview"
              className="rounded-lg w-full "
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-10 w-10" />
            <span className="text-sm">Click to upload an image</span>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
