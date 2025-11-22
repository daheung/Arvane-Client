export function formatMatrixPretty(
  rows: number[][],
  decimals: number = 2
): string {
  if (!rows.length) return "";

  const colCount = rows[0].length;

  // 1) 각 값 문자열로 변환 (최대 decimals 자리, 뒤 0은 제거)
  const formatted = rows.map((row, i) => {
    if (row.length !== colCount) {
      throw new Error(`Row ${i} has inconsistent length.`);
    }
    return row.map((v) => {
      const rounded = v.toFixed(decimals);      // "-0.41", "1.00"
      const trimmed = rounded.replace(/\.?0+$/, ""); // "-0.41", "1"
      return trimmed;
    });
  });

  // 2) 각 열별 최대 길이 계산
  const colWidths = new Array(colCount).fill(0);
  for (let c = 0; c < colCount; c++) {
    for (let r = 0; r < formatted.length; r++) {
      colWidths[c] = Math.max(colWidths[c], formatted[r][c].length);
    }
  }

  // 3) padStart로 열 맞춰서 한 줄 문자열 생성
  const lines = formatted.map((row) => {
    const cells = row.map((cell, c) => cell.padStart(colWidths[c], " "));
    return `[${cells.join(", ")}]`;
  });

  return lines.join("\n");
}

export function formatNumberPretty(
  value: number,
  decimals = 2,
  truncate = false,
  width?: number
): string {
  const factor = Math.pow(10, decimals);

  const fixed = truncate
    ? String(Math.trunc(value * factor) / factor)
    : value.toFixed(decimals);

  if (width === undefined) {
    return fixed;
  }

  // 오른쪽 패딩으로 자릿수 맞추기
  const padSize = Math.max(0, width - fixed.length);
  return fixed + " ".repeat(padSize);
}

export type ImageBase64WithSize = {
  base64: string;
  width: number;
  height: number;
};
export type DepthBase64WithSize = ImageBase64WithSize;

export const fileToBase64WithSize = (file: File): Promise<ImageBase64WithSize> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read file as base64"));

    reader.onloadend = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Failed to read file as base64"));
        return;
      }

      const base64 = reader.result;
      const img = new Image();

      img.onload = () => {
        resolve({
          base64,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        });
      };

      img.onerror = () => {
        reject(new Error("Failed to load image for size detection"));
      };

      img.src = base64; // data URL 그대로 사용
    };

    reader.readAsDataURL(file);
  });

export function viewToSafeArrayBuffer(view: ArrayBufferView): ArrayBuffer {
  // view.buffer가 SharedArrayBuffer일 수도 있으니,
  // 안전하게 새 ArrayBuffer로 복사
  const copy = new Uint8Array(view.byteLength);
  copy.set(new Uint8Array(view.buffer, view.byteOffset, view.byteLength));
  return copy.buffer; // ← ArrayBuffer
}