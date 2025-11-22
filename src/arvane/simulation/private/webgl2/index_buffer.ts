import type { FVertexDeclaration } from "@/runtime/private/engine/webgl2/vertex_declaration/vertex_declaration";
import { EScalarType, type TScalarType } from "./utils/define";

export class FIndexBuffer {
  private _context: WebGL2RenderingContext;

  private _indexBufferObjectRef: WebGLBuffer;

  private _rawBufferRef: ArrayBuffer | null = null;
  private _rawBufferCount: number | null = null;
  private _rawBufferTypeRef: TScalarType | null = null;
  
  constructor(context: WebGL2RenderingContext) {
    this._context = context;
    this._indexBufferObjectRef = this._context.createBuffer();
  }

  public get buffer(): ArrayBuffer | null { return this._rawBufferRef; }
  public get bufferCount(): number | null { return this._rawBufferCount; }
  public get bufferType(): TScalarType | null { return this._rawBufferTypeRef; }

  public CreateIndexBuffer(buffer: ArrayBuffer, type: TScalarType) {
    if ( !this.Internal_CheckBufferType(type) ) {
      return;
    }

    const bufferElementSize: number = this.Internal_GetBufferSize(type) as number;
    if ( buffer.byteLength % bufferElementSize ) {
      console.warn(`[FIndexBuffer] byteLength(${buffer.byteLength})가 요소 크기(${bufferElementSize})로 나누어떨어지지 않습니다.`);
    }

    this._rawBufferRef = buffer;
    this._rawBufferTypeRef = type;
    this._rawBufferCount = Math.floor(buffer.byteLength / bufferElementSize);

    /** Set buffer to bind index buffer. */
    this._context.bindBuffer(this._context.ELEMENT_ARRAY_BUFFER, this._indexBufferObjectRef);
    this._context.bufferData(this._context.ELEMENT_ARRAY_BUFFER, buffer, this._context.STATIC_DRAW);
    this._context.bindBuffer(this._context.ELEMENT_ARRAY_BUFFER, null);
  }

  public SetIndexBuffer(vertexArrayObject: WebGLVertexArrayObject) {
    this._context.bindVertexArray(vertexArrayObject);
    this._context.bindBuffer(this._context.ELEMENT_ARRAY_BUFFER, this._indexBufferObjectRef);
    this._context.bindVertexArray(null);
  }

  private Internal_CheckBufferType(type: TScalarType) {
    const isUnsignedType: boolean = (
      type === EScalarType.TF_UByte ||
      type === EScalarType.TF_UShort ||
      type === EScalarType.TF_UInt
    );

    if ( !isUnsignedType ) {
      console.error(`Index buffer type is not unsigned type. Given: ${type.valueOf()}`);
      return false;
    }

    return true;
  }

  private Internal_GetBufferSize(type: TScalarType): number | null {
    if (
      type === EScalarType.TF_Byte ||
      type === EScalarType.TF_UByte
    ) {
      return ( 1 );
    }

    else if ( 
      type === EScalarType.TF_Short ||
      type === EScalarType.TF_UShort
    ) {
      return ( 2 )
    }

    else if ( 
      type === EScalarType.TF_Int ||
      type === EScalarType.TF_UInt
    ) {
      return ( 4 );
    }

    else {
      return null;
    }
  }
}