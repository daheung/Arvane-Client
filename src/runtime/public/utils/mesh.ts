import { EObjectStaticMeshType, type TObjectStaticMeshType } from "@/arvane/simulation/private/mesh/static_mesh";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export function extractMeshType(url: string): TObjectStaticMeshType | null {
  const extensionPath: string = url.split(".").at(-1) as string;
  if ( !extensionPath ) {
    return null;
  }

  let meshType: TObjectStaticMeshType | null = null;
  if ( extensionPath.includes("glb") ) {
    meshType = EObjectStaticMeshType.MeshType_FILE_Glb;
  }
  else if ( extensionPath.includes("obj") ) {
    meshType = EObjectStaticMeshType.MeshType_FILE_Obj;
  }

  return meshType;
}

export async function loadMesh(url: string): Promise<THREE.Group<THREE.Object3DEventMap> | null> {
  const meshType: TObjectStaticMeshType = extractMeshType(url) as TObjectStaticMeshType;
  
  let mesh: THREE.Group<THREE.Object3DEventMap> | null = null;
  if ( meshType === EObjectStaticMeshType.MeshType_FILE_Glb ) {
    mesh = await loadGLB(url);
  }
  else if ( meshType === EObjectStaticMeshType.MeshType_FILE_Obj ) {
    mesh = await loadOBJ(url);
  }

  return mesh;
}

export async function loadGLB(url: string) {
  const loader = new GLTFLoader();
  const gltf = await loader.loadAsync(url);
  return gltf.scene;
}

export async function loadOBJ(url: string) {
  const loader: OBJLoader = new OBJLoader();
  const obj = await loader.loadAsync(url);
  return obj;
}

export function extractPositions(mesh: THREE.Mesh): Float32Array | null {
  if ( !mesh ) {
    return null;
  }

  const g = mesh.geometry as THREE.BufferGeometry;
  const pos = g.getAttribute("position") as THREE.BufferAttribute;
  return pos.array as Float32Array;
}

export function extractPositionsFromGroup(group: THREE.Group): Array<Float32Array | null> | null {
  if ( !group ) {
    return null;
  }

  const out: (Float32Array | null)[] = [];
  group.traverse(o => {
    if ((o as any).isMesh) {
      out.push(extractPositions(o as THREE.Mesh));
    }
  });

  return out as Array<Float32Array<ArrayBufferLike> | null>;
}

export function vertexCountPerObject(root: THREE.Object3D): Array<{ object: THREE.Object3D; uniqueVertices: number; renderedVertices: number }> {
  const out: Array<{ object: THREE.Object3D; uniqueVertices: number; renderedVertices: number }> = [];
  root.traverse((obj) => {
    const geom = (obj as any).geometry as THREE.BufferGeometry | undefined;
    if (!geom) return;
    const pos = geom.getAttribute("position");
    if (!pos) return;

    const unique = pos.count;
    const rendered = obj instanceof THREE.InstancedMesh ? unique * obj.count : unique;
    out.push({ object: obj, uniqueVertices: unique, renderedVertices: rendered });
  });
  return out;
}