import { base64PngToFloat32Array, convertToColorDepthLUT } from "@/runtime/public/utils/depth";
import { useEffect, useRef, useState } from "react";

type TDepthImagePropType = { 
    depthBase64: string; 
    className?: string;
};
export const DepthImage: React.FC<TDepthImagePropType> = ({
  depthBase64,
  className,
}) => {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { width, height, data } = await base64PngToFloat32Array(depthBase64);

        const lut = convertToColorDepthLUT(data) as Uint8Array; // 또는 Uint8ClampedArray
        const n = width * height;

        if (lut.length !== n * 3) {
          console.error("LUT size mismatch", {
            lutLen: lut.length,
            expected: n * 3,
            width,
            height,
          });
          if (!cancelled) setSrc("");
          return;
        }

        // RGB(3) → RGBA(4) 변환
        const rgba = new Uint8ClampedArray(n * 4);
        for (let i = 0, j = 0; i < lut.length; i += 3, j += 4) {
          rgba[j + 0] = lut[i + 0]; // R
          rgba[j + 1] = lut[i + 1]; // G
          rgba[j + 2] = lut[i + 2]; // B
          rgba[j + 3] = 255;        // A (불투명)
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const imgData = new ImageData(rgba, width, height);
        ctx.putImageData(imgData, 0, 0);

        const url = canvas.toDataURL("image/png");
        if (!cancelled) setSrc(url);
      } catch (err) {
        console.error("Failed to render depth image:", err);
        if (!cancelled) setSrc("");
      }
    })();

    return () => { cancelled = true; };
  }, [depthBase64]);

  return (
    src 
      ? <img src={src} alt="depth-colored" className={className}/> 
      : null
  );
};
