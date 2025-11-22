// --- turbo LUT 생성 (256 x 3, 0~255 범위) -------------------------------

import { viewToSafeArrayBuffer } from "./utils";

// Google's Turbo colormap analytic approximation coefficients
const TURBO_COEFF_R = [0.13572138, 4.61539260, -42.66032258, 132.13108234, -152.94239396, 59.28637943];
const TURBO_COEFF_G = [0.09140261, 2.41240994, -24.27976911,  80.90308021,  -95.48943344, 38.71212629];
const TURBO_COEFF_B = [0.10667330, 0.91525463,  -1.00839638,  -7.43504211,   14.34512827, -5.97372130];

function turboRGB01(t: number): [number, number, number] {
  // t in [0,1]
  const clamped = Math.min(1, Math.max(0, t));
  const t2 = clamped * clamped;
  const t3 = t2 * clamped;
  const t4 = t3 * clamped;
  const t5 = t4 * clamped;

  const r = TURBO_COEFF_R[0]
        + TURBO_COEFF_R[1]*clamped
        + TURBO_COEFF_R[2]*t2
        + TURBO_COEFF_R[3]*t3
        + TURBO_COEFF_R[4]*t4
        + TURBO_COEFF_R[5]*t5;

  const g = TURBO_COEFF_G[0]
        + TURBO_COEFF_G[1]*clamped
        + TURBO_COEFF_G[2]*t2
        + TURBO_COEFF_G[3]*t3
        + TURBO_COEFF_G[4]*t4
        + TURBO_COEFF_G[5]*t5;

  const b = TURBO_COEFF_B[0]
        + TURBO_COEFF_B[1]*clamped
        + TURBO_COEFF_B[2]*t2
        + TURBO_COEFF_B[3]*t3
        + TURBO_COEFF_B[4]*t4
        + TURBO_COEFF_B[5]*t5;

  // clamp just in case
  return [
    Math.min(1, Math.max(0, r)),
    Math.min(1, Math.max(0, g)),
    Math.min(1, Math.max(0, b)),
  ];
}

const TURBO_LUT: Uint8Array = (() => {
  const lut = new Uint8Array(256 * 3);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    const [r, g, b] = turboRGB01(t);
    lut[i*3 + 0] = Math.round(r * 255);
    lut[i*3 + 1] = Math.round(g * 255);
    lut[i*3 + 2] = Math.round(b * 255);
  }
  return lut;
})();

// --- PyTorch 함수 포팅 ---------------------------------------------------
type DType = "uint8" | "uint8clamped" | "uint16" | "float32";

/**
 * PyTorch의 convert_to_color_depth_lut와 동일한 로직.
 * depth: 길이 H*W의 1D 배열(행 우선). 값 단위는 "미터" 가정.
 * 반환: RGB 순서의 1D 배열(길이 H*W*3)
 */
export function convertToColorDepthLUT(
  depth: Float32Array | number[],
  opts?: {
    dtype?: DType;           // 기본: "uint8"
    minDepth?: number;       // 시각화 하한(m) 기본: 0.1
    maxDepth?: number;       // 시각화 상한(m) 기본: 250
  }
): Uint8Array | Uint8ClampedArray | Uint16Array | Float32Array {
  const { dtype = "uint8", minDepth = 0.1, maxDepth = 250 } = opts ?? {};

  const n = depth.length;
  // 출력 버퍼 준비
  const outLen = n * 3;

  let outU8: Uint8Array | Uint8ClampedArray | Uint16Array | Float32Array;
  switch (dtype) {
    case "uint8clamped": outU8 = new Uint8ClampedArray(outLen); break;
    case "uint16":       outU8 = new Uint16Array(outLen); break;
    case "float32":      outU8 = new Float32Array(outLen); break;
    default:             outU8 = new Uint8Array(outLen); // "uint8"
  }

  // 1) inverse depth
  //    NaN/0/음수는 안전하게 처리 (∞ 또는 음수 방지)
  const inv = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const d = (depth as any)[i];
    inv[i] = d > 0 && Number.isFinite(d) ? (1.0 / d) : 0; // 0 또는 비정상값은 0으로
  }

  // 2) min/max 계산 (PyTorch 코드와 동일한 컷팅)
  //    max_invdepth_vizu = min(max(inv), 1/0.1)
  //    min_invdepth_vizu = max(1/250, min(inv))
  let invMin = Number.POSITIVE_INFINITY;
  let invMax = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < n; i++) {
    const v = inv[i];
    if (!Number.isFinite(v)) continue;
    if (v < invMin) invMin = v;
    if (v > invMax) invMax = v;
  }
  const maxInvCap = 1.0 / minDepth; // 1/0.1 = 10
  const minInvCap = 1.0 / maxDepth; // 1/250 = 0.004

  const maxInvDepthVizu = Math.min(invMax, maxInvCap);
  const minInvDepthVizu = Math.max(minInvCap, invMin);

  const denom = (maxInvDepthVizu - minInvDepthVizu) || 1.0;

  // 3) 정규화 + LUT 인덱싱
  for (let i = 0; i < n; i++) {
    // normalize
    let t = (inv[i] - minInvDepthVizu) / denom;
    if (!Number.isFinite(t)) t = 0;
    if (t < 0) t = 0;
    else if (t > 1) t = 1;

    const idx = Math.round(t * 255) | 0; // [0,255]
    const base = i * 3;

    // LUT에서 RGB(0~255)를 꺼낸 뒤, dtype에 맞게 저장
    const r = TURBO_LUT[idx * 3 + 0];
    const g = TURBO_LUT[idx * 3 + 1];
    const b = TURBO_LUT[idx * 3 + 2];

    if (dtype === "float32") {
      (outU8 as Float32Array)[base + 0] = r;
      (outU8 as Float32Array)[base + 1] = g;
      (outU8 as Float32Array)[base + 2] = b;
    } else if (dtype === "uint16") {
      (outU8 as Uint16Array)[base + 0] = r;
      (outU8 as Uint16Array)[base + 1] = g;
      (outU8 as Uint16Array)[base + 2] = b;
    } else {
      (outU8 as Uint8Array)[base + 0] = r;
      (outU8 as Uint8Array)[base + 1] = g;
      (outU8 as Uint8Array)[base + 2] = b;
    }
  }

  return outU8;
}

export async function base64PngToFloat32Array(base64: string): Promise<{
  width: number;
  height: number;
  data: Float32Array;
}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("No 2D context"));

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const src = imageData.data; // RGBA 8bit
      const out = new Float32Array(canvas.width * canvas.height);

      // 흑백 이미지라고 가정하고 R 채널만 사용 (0 또는 255)
      for (let i = 0, j = 0; i < src.length; i += 4, j++) {
        const r = src[i];
        out[j] = r / 255.0; // 0~1로 정규화 (원하면 그대로 r 사용)
      }

      resolve({ width: canvas.width, height: canvas.height, data: out });
    };
    img.onerror = reject;
    img.src = `data:image/png;base64,${base64}`;
  });
}


export function normalizeBase64(b64: string): string {
  let s = b64.trim()
    .replace(/^data:[^,]+,/, "")        // data: 헤더 제거
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const pad = s.length % 4;
  if (pad === 2) s += "==";
  else if (pad === 3) s += "=";
  else if (pad === 1) throw new Error("Invalid base64 length");
  return s;
}

type NDArrayB64Payload = {
  buffer_b64: string;     // data:application/octet-stream;base64,....  형태
  dtype: "float32";
  shape: [number, number]; // [H, W]
  data_url: boolean;       // server에서 dataURL로 온 걸 처리한다면 true
  little_endian: boolean;  // 일반 x86 환경이면 true
};

export async function float32DepthToNDArrayB64(
  data: Float32Array,
  width: number,
  height: number
): Promise<NDArrayB64Payload> {
  // Float32Array가 ArrayBuffer의 일부 view일 수도 있으므로 offset/length를 보존해 Uint8Array로 래핑
  const u8 = viewToSafeArrayBuffer(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));

  // Blob -> FileReader.readAsDataURL 로 base64(DataURL) 생성
  const blob = new Blob([u8], { type: "application/octet-stream" });
  const buffer_b64: string = await new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });

  return {
    buffer_b64,
    dtype: "float32",
    shape: [height, width],
    data_url: true,
    little_endian: true,
  };
}
