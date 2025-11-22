import { Vector3, Vector4 } from "three";

export function DefaultScaleVector(): Vector3 {
  return new Vector3(1, 1, 1)
}

export function DefaultRotateVector(): Vector3 {
  return new Vector3(0, 0, 0)
}

export function DefaultTransformVector(): Vector4 {
  return new Vector4(0, 0, 0, 0);
}

export function DefaultColorVector(): Vector4 {
    return new Vector4(0, 0, 0, 1.0);
}

export type Mat3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

export type Mat4x4 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number]
];

export function Mat3x3SplitPoseMatrices(poseData: Float64Array | null | undefined): Mat3x3[] {
  if (!poseData) return [];
  
  if (poseData.length % 9 !== 0) {
    throw new Error(
      `Invalid pose data length: ${poseData.length}. Expected multiple of 9 (3x3 matrices).`
    );
  }

  const numMatrices = poseData.length / 9;
  const result: Mat3x3[] = new Array(numMatrices);

  for (let i = 0; i < numMatrices; i++) {
    const base = i * 9;

    result[i] = [
      [poseData[base],     poseData[base + 1], poseData[base + 2]],
      [poseData[base + 3], poseData[base + 4], poseData[base + 5]],
      [poseData[base + 6], poseData[base + 7], poseData[base + 8]],
    ];
  }

  return result;
}

export function Mat4x4SplitPoseMatrices(poseData: Float64Array | null | undefined): Mat4x4[] {
  if (!poseData) return [];
  
  if (poseData.length % 16 !== 0) {
    throw new Error(
      `Invalid pose data length: ${poseData.length}. Expected multiple of 9 (3x3 matrices).`
    );
  }

  const numMatrices = poseData.length / 16;
  const result: Mat4x4[] = new Array(numMatrices);

  for (let i = 0; i < numMatrices; i++) {
    const base = i * 16;

    result[i] = [
      [poseData[base + 0 ], poseData[base + 1 ], poseData[base + 2 ], poseData[base + 3 ]],
      [poseData[base + 4 ], poseData[base + 5 ], poseData[base + 6 ], poseData[base + 7 ]],
      [poseData[base + 8 ], poseData[base + 9 ], poseData[base + 10], poseData[base + 11]],
      [poseData[base + 12], poseData[base + 13], poseData[base + 14], poseData[base + 15]],
    ];
  }

  return result;
}

export async function loadMat4FromFile(path: string): Promise<Mat4x4> {
  const res = await fetch(path);

  const text = (await res.text()).trim();
  const rows = text
    .split(/\r?\n/)                         // 줄 나누기
    .filter(line => line.trim().length > 0) // 빈 줄 제거
    .map(line =>
      line
        .trim()
        .split(/\s+/)                       // 공백(스페이스 여러 개도 OK)
        .map(v => parseFloat(v))
    );

  if (rows.length !== 4 || rows.some(r => r.length !== 4)) {
    throw new Error("Invalid matrix format: expected 4x4 numbers.");
  }

  return rows as Mat4x4;
}

export function to3x3(rows: number[][]): Mat3x3 | null {
  // 3x3 그대로
  if (rows.length === 3 && rows.every(r => r.length === 3 && r.every(n => !Number.isNaN(n)))) {
    return rows as Mat3x3;
  }
  // 4x4에서 좌상단 3x3만 사용
  if (rows.length === 4 && rows.every(r => r.length === 4 && r.every(n => !Number.isNaN(n)))) {
    const m = rows.slice(0, 3).map(r => r.slice(0, 3)) as Mat3x3;
    return m;
  }
  // 한 줄에 9개 숫자
  if (rows.length === 1 && rows[0].length === 9 && rows[0].every(n => !Number.isNaN(n))) {
    const a = rows[0];
    return [
      [a[0], a[1], a[2]],
      [a[3], a[4], a[5]],
      [a[6], a[7], a[8]],
    ];
  }
  return null;
}