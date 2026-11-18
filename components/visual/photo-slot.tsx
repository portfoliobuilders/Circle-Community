"use client"

import * as React from "react"
import Image from "next/image"
import { Camera } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PhotoSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string // e.g. "[PHOTO: Community Meetup, Kochi]"
  caption?: string
  aspectRatio?: "video" | "square" | "portrait" | "wide"
  src?: string
  alt?: string
  className?: string
}

export function PhotoSlot({
  label,
  caption,
  aspectRatio = "video",
  src,
  alt = "",
  className,
  ...props
}: PhotoSlotProps) {
  const aspectClasses = {
    video: "aspect-video",
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    wide: "aspect-[21/9]",
  }

  return (
    <figure className={cn("relative flex flex-col gap-2 w-full", className)} {...props}>
      <div
        className={cn(
          "relative w-full rounded-2xl bg-surface border border-border overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none",
          aspectClasses[aspectRatio]
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt || label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 max-w-xs text-center">
            <div className="flex items-center justify-center size-10 rounded-full bg-bg border border-border text-silver">
              <Camera className="size-5 stroke-[1.5]" />
            </div>
            <span className="font-mono text-xs font-semibold text-silver tracking-tight px-3 py-1 rounded-md bg-bg/80 border border-border">
              {label}
            </span>
            <span className="text-[11px] text-silver/60">
              Verified community archive · Real photography only
            </span>
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="text-xs text-silver font-mono px-1">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
