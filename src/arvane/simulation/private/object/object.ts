import { DefaultColorVector, DefaultRotateVector, DefaultScaleVector, DefaultTransformVector } from "@/runtime/public/utils/math";
import * as THREE from "three";
import { Vector3, Vector4 } from "three";
import type { Vector } from "three/examples/jsm/Addons.js";
import { FObjectPrimitiveProxy } from "./object_primitive";
import { GetDefaultVertexDeclaration } from "@/runtime/private/engine/webgl2/vertex_declaration/vertex_factory";
import type { FVertexDeclaration } from "@/runtime/private/engine/webgl2/vertex_declaration/vertex_declaration";

export class FObjectComponent {
  private _context: WebGL2RenderingContext;

  private _scale    : Vector3 = DefaultScaleVector();
  private _rotate   : Vector3 = DefaultRotateVector();
  private _transform: Vector4 = DefaultTransformVector();
  private _color: Vector4 = DefaultColorVector();

  private _objectPrimitive: FObjectPrimitiveProxy;
  
  constructor(context: WebGL2RenderingContext) { 
    this._context = context;

    const vertexDeclaration: FVertexDeclaration = GetDefaultVertexDeclaration(context);
    this._objectPrimitive = new FObjectPrimitiveProxy(context, vertexDeclaration);
  }

  public SetPolygon(url: string) {

  }

  public SetRawBuffer(buffer: ArrayBuffer) {

  }
}