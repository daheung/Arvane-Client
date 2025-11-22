import { getTableHeadUtilityClass } from "@mui/material";
import { EBufferType } from "../misc";
import type { 
  FVertexDeclaration, 
  TWebGL2InputElementDescription 
} from "@/runtime/private/engine/webgl2/vertex_declaration/vertex_declaration";

export class IFWebGL2CommandExecutor {
  private _renderTargetView: WebGL2RenderingContext;

  private _program: WebGLProgram;

  private _vertexShader: WebGLShader | null = null;
  private _fragmentShader: WebGLShader | null = null;

  // private _vertexArrayObjectRef: WebGLVertexArrayObject | null = null;
  // private _vertexBufferObjectRef: WebGLBuffer | null = null;

  private _windowWidth: number | null = null;
  private _windowHeight: number | null = null;

  public get context(): WebGL2RenderingContext { return this._renderTargetView; }

  constructor(
    renderTargetView: WebGL2RenderingContext,
    enable_depth: boolean = true,
    enable_stencil: boolean = true
  ) {
    this._renderTargetView = renderTargetView;

    this._program = this._renderTargetView.createProgram();
    
    const graphicContextAttributes: WebGLContextAttributes = this._renderTargetView.getContextAttributes() as WebGLContextAttributes;
    if ( enable_depth ) {
      if ( !graphicContextAttributes.depth ) {
        console.error(`IFWebGL2CommandExecutor use depth, but WebGLContextAttrbutes::depth is not enabled.`);
      }

      else {
        this._renderTargetView.enable(this._renderTargetView.DEPTH_TEST);
        this._renderTargetView.depthFunc(this._renderTargetView.LEQUAL);
      }
    }

    if ( enable_stencil ) {
      if ( !graphicContextAttributes.stencil ) {
        console.error(`IFWebGL2CommandExecutor use depth, but WebGLContextAttrbutes::depth is not enabled.`)
      }

      else {
        this._renderTargetView.enable(this._renderTargetView.STENCIL_TEST);
      }
    }
  }

  public SetVertexShader(shaderSource: string) {
    this._vertexShader = this._renderTargetView.createShader(this._renderTargetView.VERTEX_SHADER) as WebGLShader;
    this._renderTargetView.shaderSource(this._vertexShader, shaderSource);
    this._renderTargetView.compileShader(this._vertexShader);

    if ( !this._renderTargetView.getShaderParameter(this._vertexShader, this._renderTargetView.COMPILE_STATUS) ) {
      const shaderLog: string = this._renderTargetView.getShaderInfoLog(this._vertexShader) as string;
      this._renderTargetView.deleteShader(this._vertexShader);

      console.error(`Vertex shader compile failed. ERROR: ${shaderLog}`);
    }

    this._renderTargetView.attachShader(this._program, this._vertexShader);
  }

  // public SetVertexBuffer(vertexBuffer: ArrayBuffer) {
  //   this._vertexArrayObjectRef = this._renderTargetView.createVertexArray();
  //   this._renderTargetView.bindVertexArray(this._vertexArrayObjectRef);
  
  //   this._vertexBufferObjectRef = this._renderTargetView.createBuffer()!;
  //   this._renderTargetView.bindBuffer(this._renderTargetView.ARRAY_BUFFER, this._vertexBufferObjectRef);
  //   this._renderTargetView.bufferData(this._renderTargetView.ARRAY_BUFFER, vertexBuffer, this._renderTargetView.STATIC_DRAW);
    
  //   const vertexDelcaration: FVertexDeclaration | null = this._curVertexDeclarationIndex?.value ?? null;
  //   if ( !vertexDelcaration ) {
  //     console.error("Cannot bind vertex buffer; Vertex declaration is not defined.");
  //     return;
  //   }

  //   vertexDelcaration.vertexElements.forEach((vertexElement: TWebGL2InputElementDescription) => {
  //     this._renderTargetView.enableVertexAttribArray(vertexElement.index);

  //     if ( EBufferType.IsInt(vertexElement.type) ) {
  //       this._renderTargetView.vertexAttribIPointer(
  //         vertexElement.index,
  //         vertexElement.size,
  //         vertexElement.type,
  //         vertexElement.stride,
  //         vertexElement.offset
  //       );
  //     } 
  //     else if ( EBufferType.IsFloat(vertexElement.type)) {
  //       if ( vertexElement.normalized === undefined) {
  //         console.error(`FVertexDeclaration::normalized must be not undefined or null.`);
  //         return;
  //       }

  //       this._renderTargetView.vertexAttribPointer(
  //         vertexElement.index,
  //         vertexElement.size,
  //         vertexElement.type,
  //         vertexElement.normalized,
  //         vertexElement.stride,
  //         vertexElement.offset
  //       );
  //     }
  //     else {
  //       console.error(`Vertex buffer type is not Int or Float type. Check vertex buffer declaration. type: ${vertexElement.type}`)
  //     }
  //   });

  //   this._renderTargetView.bindVertexArray(null);
  //   this._renderTargetView.bindBuffer(this._renderTargetView.ARRAY_BUFFER, null);
  // }

  public SetFragmentShader(shaderSource: string) {
    this._fragmentShader = this._renderTargetView.createShader(this._renderTargetView.FRAGMENT_SHADER) as WebGLShader;
    this._renderTargetView.shaderSource(this._fragmentShader, shaderSource);
    this._renderTargetView.compileShader(this._fragmentShader);

    if ( !this._renderTargetView.getShaderParameter(this._fragmentShader, this._renderTargetView.COMPILE_STATUS) ) {
      const shaderLog: string = this._renderTargetView.getShaderInfoLog(this._fragmentShader) as string;
      this._renderTargetView.deleteShader(this._fragmentShader);

      console.error(`Fragment shader compile failed. ERROR: ${shaderLog}`);
    }

    this._renderTargetView.attachShader(this._program, this._fragmentShader);
  }

  public ResizeWindowRect(width: number, height: number) {
    this._windowWidth = width;
    this._windowHeight = height;
  }

  public SubmitAndExecuteCommand() {
    this._renderTargetView.linkProgram(this._program);

    /** Check shaders linked successly at Progarm */
    if ( !this._renderTargetView.getProgramParameter(this._program, this._renderTargetView.LINK_STATUS) ) {
      const shaderLog: string = this._renderTargetView.getProgramInfoLog(this._program) as string;
      this._renderTargetView.deleteProgram(this._program);

      console.error(`Program link failed. ERROR: ${shaderLog}`);
    }

    if ( this._vertexShader ) {
      this._renderTargetView.deleteShader(this._vertexShader);
      this._vertexShader = null;
    }

    if ( this._fragmentShader ) {
      this._renderTargetView.deleteShader(this._fragmentShader);
      this._fragmentShader = null;
    }

    /** Set Viewports */
    const windowWidth : number = this._windowWidth  ?? this._renderTargetView.drawingBufferWidth;
    const windowHeight: number = this._windowHeight ?? this._renderTargetView.drawingBufferHeight;

    this._renderTargetView.viewport(
      0, 
      0, 
      windowWidth,
      windowHeight,
    );
  }

  public Present() {
    this._renderTargetView.clearColor(1, 1, 1, 1.0);

    let mask: number = this._renderTargetView.COLOR_BUFFER_BIT;
    const contextAttributes: WebGLContextAttributes = this._renderTargetView.getContextAttributes() as WebGLContextAttributes;
    if (contextAttributes.depth) { 
      this._renderTargetView.clearDepth(1.0);    
      mask |= this._renderTargetView.DEPTH_BUFFER_BIT; 
    }

    if (contextAttributes.stencil) { 
      this._renderTargetView.clearStencil(0);
      mask |= this._renderTargetView.STENCIL_BUFFER_BIT; 
    }

    this._renderTargetView.clear(mask);

    this._renderTargetView.useProgram(this._program);
    // this._renderTargetView.bindVertexArray(this._vertexArrayObjectRef);
    // this._renderTargetView.drawArrays(this._renderTargetView.TRIANGLES, 0, 3);
    // this._renderTargetView.bindVertexArray(null);
  }
}