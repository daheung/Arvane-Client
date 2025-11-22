import "@/arvane/debug/private/debug_main.scss";

import { RArvaneLogo } from "@/components/logo";
import { useNavigate } from "react-router-dom";
import { loadMat4FromFile, Mat4x4SplitPoseMatrices, to3x3, type Mat3x3, type Mat4x4 } from "@/runtime/public/utils/math";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Npyjs from "npyjs";
import axios from 'axios' 

import {
  useState,
  type FC,
  type ChangeEventHandler,
  type MouseEventHandler,
  useRef,
  useCallback,
} from "react";
import { fileToBase64WithSize, type DepthBase64WithSize, type ImageBase64WithSize } from "@/runtime/public/utils/utils";
import { base64PngToFloat32Array, convertToColorDepthLUT, float32DepthToNDArrayB64, normalizeBase64 } from "@/runtime/public/utils/depth";
import { DepthImage } from "../private/depth_image";
import { sortedArray } from "three/src/animation/AnimationUtils.js";

type TDebugMainPropType = {};

export const RDebugMain: FC<TDebugMainPropType> = (_: TDebugMainPropType) => {
  const navigate = useNavigate();
  
  const [serverInfo, setServerInfo] = useState<string>("http://localhost:8080");
  const taskId = useRef<string | null>(null);
  const userId = "uid-123123";
  const name = "n-123123";

  const [relPath, setRelPath] = useState<string>("");
  const [numImages, setNumImages] = useState<number>(0);
  const [poseInfo, setPoseInfo] = useState<string>("");
  const inputElRef = useRef<HTMLInputElement | null>(null);

  // 실제 데이터는 ref에 저장 (렌더 최소화)
  const [imageBase64, setImageBase64] = useState<string[]>([]);
  const [imageShape, setImageShape] = useState<ImageBase64WithSize[]>([]);
  const depthFloat32MetersRef = useRef<Array<{ buffer_b64: string, data: Float32Array; width: number; height: number }>>([]);
  const poseNpyRef = useRef<Float64Array | null>(null);
  const imagePathRef = useRef<string | null>(null);
  const depthPathRef = useRef<string | null>(null);
  const kImagePathRef = useRef<string | null>(null);
  const posePathRef = useRef<string | null>(null);

  const mat4x4Pose: Array<Mat4x4> | null = Mat4x4SplitPoseMatrices(poseNpyRef.current);
  const mat3x3KImage = useRef<Mat3x3 | null>(null);

  const validSubmit: boolean = relPath !== "" && serverInfo !== null;
  const handleLogoClick: MouseEventHandler<HTMLDivElement> = () => {
    navigate("/main");
  };

  const handlePathBtnClick: MouseEventHandler<HTMLButtonElement> = () => {
    inputElRef.current?.click();
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        else reject(new Error("Failed to read file as base64"));
      };
      reader.onerror = () => reject(new Error("Failed to read file as base64"));
      reader.readAsDataURL(file);
    });

  const setPaths = useCallback((baseDir: string) => {
    setRelPath(baseDir);
    imagePathRef.current = baseDir ? `${baseDir}/color/` : null;
    depthPathRef.current = baseDir ? `${baseDir}/depth/` : null;
    kImagePathRef.current = baseDir ? `${baseDir}/intrinsic_color.txt` : null;
    posePathRef.current = baseDir ? `${baseDir}/pose.npy` : null;
  }, []);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const npy = new Npyjs();

    const poseFile =
      fileArray.find(
        (f) =>
          f.name === "pose.npy" ||
          (f as any).webkitRelativePath?.endsWith("/pose.npy")
      ) || null;

    let baseDir = "";
    if (poseFile && (poseFile as any).webkitRelativePath) {
      const path = (poseFile as any).webkitRelativePath as string;
      const idx = path.lastIndexOf("/");
      baseDir = idx !== -1 ? path.slice(0, idx) : "";
    } else if ((fileArray[0] as any).webkitRelativePath) {
      const path = (fileArray[0] as any).webkitRelativePath as string;
      const idx = path.indexOf("/");
      baseDir = idx !== -1 ? path.slice(0, idx) : "";
    }
    setPaths(baseDir);

    if (poseFile) {
      const buf = await poseFile.arrayBuffer();
      const { data, dtype } = await npy.load(buf);

      if (dtype !== "f8") {
        throw new Error(`Expected float64 (f8) but got ${dtype}`);
      }

      poseNpyRef.current = data as Float64Array;
      setPoseInfo(
        `pose.npy loaded: dtype=${dtype}`
      );
    } else {
      setPoseInfo("pose.npy not found in selected folder");
    }

    // 2) intrinsic_color.txt 처리
    const kFile = fileArray.find(
      (f) =>
        f.name === "intrinsic_color.txt" ||
        (f as any).webkitRelativePath?.endsWith("/intrinsic_color.txt")
    );

    if (kFile) {
      const kText = (await kFile.text()).trim();
      const rows = kText
        .split(/\r?\n/)
        .filter((l) => l.trim().length > 0)
        .map((l) => l.trim().split(/\s+/).map(Number));

      if (
        rows.length === 4 &&
        !rows.some((r) => r.length !== 4 || r.some((n) => Number.isNaN(n)))
      ) {
        mat3x3KImage.current = to3x3(rows) as Mat3x3;
      } else {
        console.error("Invalid intrinsic_color.txt format", kText);
      }
    } else {
      console.warn("intrinsic_color.txt not found in selected folder");
    }

    const imageFiles = fileArray.filter((f) => {
      const path = (f as any).webkitRelativePath as string;
      return (
        f.type.startsWith("image/") &&
        (path ? path.includes("/color/") : true)
      );
    });

    imageFiles.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base"
      })
    );

    const base64List = await Promise.all(imageFiles.map(fileToBase64));
    setImageBase64(base64List);
    setNumImages(base64List.length);

    const base64Shape = await Promise.all(imageFiles.map(fileToBase64WithSize));
    setImageShape(base64Shape);

    const depthFiles = fileArray.filter((f) => {
      const path: string = (f as any).webkitRelativePath as string;
      return f.type.startsWith("image/") && (path ? path.includes("/depth/") : true);
    });
    
    depthFiles.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base"
      })
    );

    const depthBase64List = await Promise.all(depthFiles.map(fileToBase64));
    const decodeDepthMeters = async (b64: string) => {
      // base64PngToFloat32Array: PNG를 Float32Array로 복원 (보통 mm 단위일 것)
      const buffer_b64: string = normalizeBase64(b64);
      const { data, width, height } = await base64PngToFloat32Array(buffer_b64);
      // OpenCV: .astype(np.float32) / 1000 과 동일하게 처리
      const out = new Float32Array(data.length);
      for (let i = 0; i < data.length; i++) {
        out[i] = data[i] / 1000.0;
      }

      return { buffer_b64: buffer_b64, data: out, width, height };
    };

    const decodedDepths = await Promise.all(depthBase64List.map(decodeDepthMeters));
    depthFloat32MetersRef.current = decodedDepths;
  };

  const handleSubmitBtnClick: MouseEventHandler<HTMLButtonElement> = async (_) => {
    const endPoint: string = serverInfo as string;
    if (!endPoint) {
      return;
    }

    const apiCreate = await axios.post(
      `${endPoint}/api/world/create`,
      {
        "user_id": userId,
        'name': name,
      }
    );
    taskId.current = apiCreate.data.task_id;
    
    for (let num = 0; num < numImages; ++num) {
      const shape: ImageBase64WithSize =  imageShape[num];
      const apiUpdate = await axios.post(
        `${endPoint}/api/world/update`,
        {
          "task_id": taskId.current,
          "color": {
            "buffer_b64": imageBase64[num],
            "shape": [3, shape.height, shape.width],
            "data_url": true
          },
          "k_color": mat3x3KImage.current?.flat(),
          "pose": mat4x4Pose[num].flat(),
          "gt_origin": mat4x4Pose.at(0)?.flat(),
          "gt_maxbound": mat4x4Pose.at(-1)?.flat()
        }
      )

      const apiDepthUpdate = await axios.post(
        `${endPoint}/api/debug/depth`,
        {
          "task_id": taskId.current,
          "depth": {
            "buffer_b64": normalizeBase64(depthFloat32MetersRef.current[num].buffer_b64)
          }
        }
      );
    }

    const apiStart = await axios.post(
      `${endPoint}/api/world/start`,
      {
        "task_id": taskId.current
      }
    );
  }

  const btnSx = {
    border: "2px solid currentColor",
    borderRadius: "10px",
    marginLeft: "20px",
  };

  const fieldSx = {
    width: "400px",
    "& .MuiInputBase-input": {
      fontFamily: "Consolas",
    },
  };

  const serverFieldSx = {
    width: "300px",
    marginLeft: "20px",
    "& .MuiInputBase-input": {
      fontFamily: "Consolas",
    },
  };

  return (
    <div className="arvane-debug">
      <div className="arvane-header">
        <RArvaneLogo handleClick={handleLogoClick} />
      </div>

      <div className="arvane-body">
        <div className="path-container">
          <div className="path-input-container">
            <input
              ref={inputElRef}
              id="image-input"
              type="file"
              style={{ display: "none" }}
              multiple
              // 폴더 선택 (Vite dev server랑 상관없이 로컬 폴더 내용 읽기)
              {...({ webkitdirectory: "" } as any)}
              onChange={handleFileChange}
            />

            <TextField
              sx={fieldSx}
              value={relPath}
              autoComplete="off"
              InputProps={{ readOnly: true }}
            />
            <TextField
              sx={serverFieldSx}
              value={serverInfo}
              label="서버 IP/Port"
              onChange={(e) => { setServerInfo(e.target.value); }}
            />
            <Button
              sx={btnSx}
              variant="outlined"
              onClick={handlePathBtnClick}
            >
              경로 찾기
            </Button>
            <Button 
              sx={btnSx}
              variant="outlined"
              onClick={handleSubmitBtnClick}
              disabled={!validSubmit}
            >
              서버 전송
            </Button>
          </div>

          <div className="path-desc-container">
            <div className="image-path">
              Image path: {imagePathRef.current
                ? `${imagePathRef.current}...`
                : ""}
            </div>
            <div className="depth-path">
              Depth path: {depthPathRef.current
                ? `${depthPathRef.current}...`
                : ""}
            </div>
            <div className="k-image-path">
              K-Image path: {kImagePathRef.current ?? ""}
            </div>
            <div className="pose-path">
              Pose Path: {posePathRef.current ?? ""}
            </div>
          </div>
        </div>

        <div className="desc">
          <div className="num-image">Loaded images: {numImages}</div>
          <div className="pose-info">{poseInfo}</div>
        </div>
        
        <div className="desc-container">
          <div className="image-container">{ imageBase64.map((value, index) => {
            return (
              <img 
                key={index + 1} 
                className={`image-${index + 1}`}
                src={value}
              />
            )
          })}</div>
          <div className="depth-container">{ depthFloat32MetersRef.current.map((value, index) => {
            return (
                <DepthImage 
                  key={index + 1}
                  depthBase64={normalizeBase64(value.buffer_b64)}
                  className={`depth-${index + 1}`}
                />
            )
          })}</div>
          <div className="k-image-container"></div>
          <div className="pose-container">{ mat4x4Pose.map((value, index) => {
            return (
              <div
                key={index + 1}
                className={`pose-${index + 1}`}
                style={{
                  fontFamily: "Consolas"
                }}
              >{index}: [
                <span style={{ width: "45px", display: "inline-block" }}>{value[0][0].toFixed(2)}</span>, 
                <span style={{ width: "45px", display: "inline-block" }}>{value[1][1].toFixed(2)}</span>, 
                <span style={{ width: "45px", display: "inline-block" }}>{value[2][2].toFixed(2)}</span>, 
                <span style={{ width: "45px", display: "inline-block" }}>{value[3][3].toFixed(2)}</span>
              ]</div>
            )
          })}</div>
        </div>
      </div>
    </div>
  );
};
