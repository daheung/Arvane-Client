import type { FVertexDeclaration, TWebGL2InputElementDescription } from "@/runtime/private/engine/webgl2/vertex_declaration/vertex_declaration";
import { EBufferType } from "@/runtime/private/misc";

export class FVertexBuffer {
  private _context: WebGL2RenderingContext;

  private _vertexArrayObjectRef: WebGLVertexArrayObject;
  private _vertexBufferObjectRef: WebGLBuffer;

  private _vertexDeclaration: FVertexDeclaration | null = null;
  
  private _rawBufferRef: ArrayBuffer | null = null;

  constructor(context: WebGL2RenderingContext) {
    this._context = context;

    this._vertexArrayObjectRef = this._context.createVertexArray();
    this._vertexBufferObjectRef = this._context.createBuffer();
  }

  public get vertexArrayObject(): WebGLVertexArrayObject { return this._vertexArrayObjectRef; }
  public get buffer(): ArrayBuffer | null { return this._rawBufferRef; }

  public CreateVertexBuffer(buffer: ArrayBuffer) {
    this._rawBufferRef = buffer;
    
    /** Set buffer to bind vertex buffer. */
    this._context.bindBuffer(this._context.ARRAY_BUFFER, this._vertexBufferObjectRef);
    this._context.bufferData(this._context.ARRAY_BUFFER, this._rawBufferRef, this._context.STATIC_DRAW);
    this._context.bindBuffer(this._context.ARRAY_BUFFER, null);
  }

  public SetVertexBuffer(vertexDeclaration: FVertexDeclaration) {
    this._vertexDeclaration = vertexDeclaration;

    this._context.bindVertexArray(this._vertexArrayObjectRef);
    this._context.bindBuffer(this._context.ARRAY_BUFFER, this._vertexBufferObjectRef);

    this._vertexDeclaration.vertexElements.forEach((vertexElement: TWebGL2InputElementDescription) => {
      this._context.enableVertexAttribArray(vertexElement.index);

      if ( EBufferType.IsInt(vertexElement.type) ) {
        this._context.vertexAttribIPointer(
          vertexElement.index,
          vertexElement.size,
          vertexElement.type,
          vertexElement.stride,
          vertexElement.offset
        );
      } 
      else if ( EBufferType.IsFloat(vertexElement.type)) {
        if ( vertexElement.normalized === undefined) {
          console.error(`FVertexDeclaration::normalized must be not undefined or null.`);
          return;
        }
        
        this._context.vertexAttribPointer(
          vertexElement.index,
          vertexElement.size,
          vertexElement.type,
          vertexElement.normalized,
          vertexElement.stride,
          vertexElement.offset
        );
      }
      else {
        console.error(`Vertex buffer type is not Int or Float type. Check vertex buffer declaration. type: ${vertexElement.type}`)
      }
    });

    /** Unset vertex description for debugging */
    this._context.bindVertexArray(null);
    this._context.bindBuffer(this._context.ARRAY_BUFFER, null);
  }
}
