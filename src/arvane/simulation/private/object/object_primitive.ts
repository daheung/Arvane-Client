import * as THREE from "three";
import { EBufferType } from "../../../../runtime/private/misc";
import { buffer, thickness } from "three/tsl";
import { 
  type FVertexDeclaration, 
  type TWebGL2InputElementDescription 
} from "@/runtime/private/engine/webgl2/vertex_declaration/vertex_declaration";
import { FVertexBuffer } from "../webgl2/vertex_buffer";
import { FIndexBuffer } from "../webgl2/index_buffer";
import type { TScalarType } from "../webgl2/utils/define";
import { extractPositions, extractPositionsFromGroup, loadMesh } from "@/runtime/public/utils/mesh";

export function ReadPolygon(polygonPath: string) {

}

export class FObjectPrimitiveProxy {
  private _context: WebGL2RenderingContext;
  
  private _vertexBuffer: FVertexBuffer;
  private _indexBuffer: FIndexBuffer;
  
  private _vertexDeclaration: FVertexDeclaration;

  private _program: WebGLProgram;

  /** Define getter method */
  public get context(): WebGL2RenderingContext { return this.context; }

  constructor(
    context: WebGL2RenderingContext,
    vertexDeclaration: FVertexDeclaration,
  ) {
    this._context = context;
    this._program = context.createProgram();

    this._vertexDeclaration = vertexDeclaration;

    this._vertexBuffer = new FVertexBuffer(context);
    this._indexBuffer = new FIndexBuffer(context);
  }

  public async CreateBufferByMesh(url: string) {
    const mesh: THREE.Group<THREE.Object3DEventMap> | null = await loadMesh(url);
    if ( !mesh ) {
      console.error(`Cannot loading mesh; Check mesh url: Given: ${url}`);
      return;
    }

    const meshPosition: Array<Float32Array | null> = extractPositionsFromGroup(mesh) as Array<Float32Array | null>;
    
  }

  public CreateRawBuffer(vertexBuffer: ArrayBuffer) {
    this._vertexBuffer.CreateVertexBuffer(vertexBuffer);
  }

  public CreateRawIndexBuffer(indexBuffer: ArrayBuffer, type: TScalarType) {
    this._indexBuffer.CreateIndexBuffer(indexBuffer, type);
  }

  public SetBuffer() {
    this._vertexBuffer.SetVertexBuffer(this._vertexDeclaration);
    this._indexBuffer.SetIndexBuffer(this._vertexBuffer.vertexArrayObject);
  }

  public Commit() {
    /** linkProgram은 나중에 World에서 수행할 예정 */
    {
      // this._context.linkProgram(this._program);
      
      // /** Check shaders linked successly at Progarm */
      // if ( !this._context.getProgramParameter(this._program, this._context.LINK_STATUS) ) {
      //   const shaderLog: string = this._context.getProgramInfoLog(this._program) as string;
      //   this._context.deleteProgram(this._program);
      
      //   console.error(`Program link failed. ERROR: ${shaderLog}`);
      // }
    }
  }

  public Present() {
    /** useProgram은 나중에 World에서 수행할 예정 */
    {  
      // this._context.useProgram(this._program);
    }

    // this._context.bindVertexArray(this._vertexArrayObjectRef);
    // this._context.drawArrays(this._context.TRIANGLES, 0, this._verticesCount);
    // this._context.bindVertexArray(null);
  }
}