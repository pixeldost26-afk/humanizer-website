"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Card3DProps {
  children: ReactNode;
  className?: string;
  depth?: number;
  glareOpacity?: number;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
  interactive?: boolean;
}

export function Card3D({
  children,
  className,
}: Card3DProps) {
  return (
    <div
      className={cn(
        "card-pro rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
