export class FSimulWorld {
  
}

// World.tsx
import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import { IFWebGL2CommandExecutor } from "@/runtime/private/engine/command_executor";

type DrawHandle = { draw: () => void; dispose: () => void };
type RegisterFn = (factory: (gl: WebGL2RenderingContext, program: WebGLProgram) => DrawHandle) => void;

export const WorldCtx = createContext<RegisterFn>(() => {});

export const World: React.FC = () => {
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  // const executorRef = useRef<IFWebGL2CommandExecutor | null>(null);
  // const drawsRef = useRef<DrawHandle[]>([]);
  // const [ready, setReady] = useState(false);

  // // FObject가 draw 핸들을 등록
  // const register = useCallback<RegisterFn>((factory) => {
  //   const exec = executorRef.current;
  //   if (!exec) return;
  //   const handle = factory(exec.context, exec);
  //   drawsRef.current.push(handle);
  //   // 언마운트용 반환 (선택)
  //   return () => {
  //     handle.dispose();
  //     drawsRef.current = drawsRef.current.filter((h) => h !== handle);
  //   };
  // }, []);

  useEffect(() => {
    // const canvas = canvasRef.current!;
    // const gl = canvas.getContext("webgl2", {
    //   antialias: true,
    //   depth: true,
    //   stencil: false,
    //   alpha: true,
    //   premultipliedAlpha: false,
    //   preserveDrawingBuffer: false,
    // }) as WebGL2RenderingContext | null;

    // if (!gl) {
    //   console.error("WebGL2 not supported");
    //   return;
    // }

    // // CSS 크기 ↔ 실제 해상도 동기화 + viewport
    // const dpr = window.devicePixelRatio || 1;
    // const w = Math.floor(canvas.clientWidth * dpr);
    // const h = Math.floor(canvas.clientHeight * dpr);
    // if (canvas.width !== w || canvas.height !== h) {
    //   canvas.width = w; canvas.height = h;
    // }

    // // Executor 생성 + 셰이더 컴파일/링크
    // const exec = new IFWebGL2CommandExecutor(gl, /*depth*/ true, /*stencil*/ false);

    // const vs = `#version 300 es
    // layout(location=0) in vec3 aPos;
    // void main() {
    //   gl_Position = vec4(aPos, 1.0);
    // }`;

    // const fs = `#version 300 es
    // precision mediump float;
    // out vec4 FragColor;
    // void main() { FragColor = vec4(0.45, 0.20, 0.85, 1.0); }`;

    // exec.SetVertexShader(vs);
    // exec.SetFragmentShader(fs);
    // exec.ResizeWindowRect(w, h);
    // exec.SubmitCommandExecute(); // link + viewport

    // executorRef.current = exec;
    // setReady(true);

    // // 렌더 루프
    // let raf = 0;
    // const render = () => {
    //   // clear (색/깊이)
    //   gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    //   gl.clearColor(1, 1, 1, 1);
    //   gl.clearDepth(1.0);
    //   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //   gl.useProgram(exec.program);

    //   // 등록된 모든 오브젝트 그리기
    //   for (const h of drawsRef.current) h.draw();

    //   raf = requestAnimationFrame(render);
    // };
    // raf = requestAnimationFrame(render);

    // // 리사이즈 대응
    // const onResize = () => {
    //   const dpr = window.devicePixelRatio || 1;
    //   const w = Math.floor(canvas.clientWidth * dpr);
    //   const h = Math.floor(canvas.clientHeight * dpr);
    //   if (canvas.width !== w || canvas.height !== h) {
    //     canvas.width = w; canvas.height = h;
    //   }
    //   exec.ResizeWindowRect(w, h);
    //   exec.SubmitCommandExecute();
    // };
    // window.addEventListener("resize", onResize);

    // return () => {
    //   cancelAnimationFrame(raf);
    //   window.removeEventListener("resize", onResize);
    //   // 리소스 정리
    //   for (const h of drawsRef.current) h.dispose();
    //   drawsRef.current = [];
    //   // (원하면) exec 안 버퍼/VAO/프로그램 delete 메소드도 추가해 호출
    // };
  }, []);

  return (
    <></>
    // <WorldCtx.Provider value={register}>
    //   <div style={{ width: 600, height: 400, border: "1px solid #ccc" }}>
    //     <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    //   </div>
    //   {ready && children}
    // </WorldCtx.Provider>
  );
};
