import { type TWebGL2InputElementDescription } from "@/runtime/private/engine/webgl2/vertex_declaration/vertex_declaration";
import { extractPositionsFromGroup, loadGLB, loadOBJ, vertexCountPerObject } from "@/runtime/public/utils/mesh";
import * as THREE from "three";

export const EObjectStaticMeshType = {
  MeshType_Not_Set: 0x00,

  MeshType_FILE_Glb: 0x01,
  MeshType_FILE_Obj: 0x02,

  MeshType_ARRAY_Buffer: 0x04,

  MeshType_Unknown: 0xFF,
} as const;

export type TObjectBufferLayout = TWebGL2InputElementDescription;
export type TObjectStaticMeshType = typeof EObjectStaticMeshType[keyof typeof EObjectStaticMeshType];

export class FObjectStaticMesh {
  private _meshType: TObjectStaticMeshType = EObjectStaticMeshType.MeshType_Not_Set;
  private _mesh: THREE.Group<THREE.Object3DEventMap> | null = null;
  private _rawBuffer: Float32Array | null = null;
  
  public get meshType(): TObjectStaticMeshType { return this._meshType; }
  public get isLoaded(): boolean { return !!this._mesh || !!this._rawBuffer; }

  public async SetMesh(url: string, meshType: TObjectStaticMeshType) {
    this._meshType = meshType;
    this._rawBuffer = null; // 모드 상호 배타성 보장

    if ( meshType === EObjectStaticMeshType.MeshType_FILE_Obj ) {
      this._mesh = await loadOBJ(url);
    }
    else if ( meshType === EObjectStaticMeshType.MeshType_FILE_Glb ) {
      this._mesh = await loadGLB(url);
    }
    else {
      console.error("Extract mesh data failed. Check input path.");
    }
  }

  public SetRawMesh(buffer: Float32Array, layout?: TObjectBufferLayout) {
    this._meshType = EObjectStaticMeshType.MeshType_ARRAY_Buffer;
    this._mesh = null; // 모드 상호 배타성 보장
    this._rawBuffer = buffer;
  }

  // === Legacy-style getters (하위 호환) ===
  public get position(): THREE.Vector3 | null { return this.Internal_GetPosition(); }
  public get normalMatrix(): THREE.Matrix3 | null { return this.Internal_GetNormal(); }
  public get scale(): THREE.Vector3 | null { return this.Internal_GetScale(); }
  public get bufferPosition(): Array<Float32Array | null> | null { return this.Internal_GetBufferPosition(); }
  public get bufferPositionCount(): Array<number> | null { return this.Internal_GetBufferPositionCount(); }

  private Internal_GetPosition(): THREE.Vector3 | null {
    if ( this._meshType === EObjectStaticMeshType.MeshType_ARRAY_Buffer ) {
      return new THREE.Vector3(0, 0, 0);
    }
    else if ( 
      this._meshType === EObjectStaticMeshType.MeshType_FILE_Obj ||
      this._meshType === EObjectStaticMeshType.MeshType_FILE_Glb
    ) {
      if ( !this._mesh ) {
        return null;
      }

      return this._mesh.position.clone() ?? null;
    }

    return null;
  }

  private Internal_GetNormal(): THREE.Matrix3 | null {
    if ( 
        this._meshType === EObjectStaticMeshType.MeshType_FILE_Obj ||
        this._meshType === EObjectStaticMeshType.MeshType_FILE_Glb
    ) {
      if ( !this._mesh ) {
        return null;
      }

      return this._mesh.normalMatrix.clone() ?? null;
    }

    return null;
  }

  private Internal_GetScale(): THREE.Vector3 | null {
    if ( this._meshType === EObjectStaticMeshType.MeshType_ARRAY_Buffer ) {
      return new THREE.Vector3(1, 1, 1);
    }
    else if ( 
      this._meshType === EObjectStaticMeshType.MeshType_FILE_Obj ||
      this._meshType === EObjectStaticMeshType.MeshType_FILE_Glb
    ) {
      if ( !this._mesh ) {
        return null;
      }

      return this._mesh.scale.clone() ?? null;
    }

    return null;
  }

  private Internal_GetBufferPosition(): Array<Float32Array | null> | null {
    if ( this._meshType === EObjectStaticMeshType.MeshType_ARRAY_Buffer ) {
      if ( !this._rawBuffer ) {
        return null;
      }

      return new Array( new Float32Array( this._rawBuffer ));
    } 
    else if ( 
      this._meshType === EObjectStaticMeshType.MeshType_FILE_Obj ||
      this._meshType === EObjectStaticMeshType.MeshType_FILE_Glb
    ) {
      if ( !this._mesh ) {
        return null;
      }

      return extractPositionsFromGroup(this._mesh);
    }

    return null;
  }

  public Internal_GetBufferPositionCount(): Array<number> | null {
    if ( this._meshType === EObjectStaticMeshType.MeshType_ARRAY_Buffer ) {
      if ( !this._rawBuffer ) {
        return null;
      }

      return [ this._rawBuffer.length ];
    }
    else if ( 
      this._meshType === EObjectStaticMeshType.MeshType_FILE_Obj ||
      this._meshType === EObjectStaticMeshType.MeshType_FILE_Glb
    ) {
      if ( !this._mesh ) {
        return null;
      }

      const objectDescription: Array<{
        object: THREE.Object3D<THREE.Object3DEventMap>;
        uniqueVertices: number;
        renderedVertices: number;
      }> = vertexCountPerObject(this._mesh);

      const objectVertexCount: Array<number> = objectDescription.map((value: typeof objectDescription[typeof index], index: number) => {
        return value.object.position.length();
      });

      return objectVertexCount;
    }

    return null;
  }
}