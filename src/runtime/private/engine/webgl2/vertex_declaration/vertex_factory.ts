import { FVertexDeclaration, type TVertexElements } from "./vertex_declaration";

/**
 * @return FVertexDeclaration
 * Vertex attributes (interleaved: P3 C4N UV2, stride = 24 bytes)
 *  - Position: { index: 0, size: 3, type: GL.FLOAT         , normalized: false, stride: 24, offset: 0  }
 *  - Color   : { index: 1, size: 4, type: GL.UNSIGNED_BYTE , normalized: true , stride: 24, offset: 12 } // 0..255 → 0..1
 *  - UV      : { index: 2, size: 2, type: GL.FLOAT         , normalized: false, stride: 24, offset: 16 }
 *
 * Note: If you set Color.normalized = false, use vertexAttribIPointer and a `uvec4`/`ivec4` input in the shader.
 */
export function GetDefaultVertexDeclaration(context: WebGL2RenderingContext): FVertexDeclaration {
  const vertexDeclaration: TVertexElements = [
    { index: 0, size: 3, type: context.FLOAT        , normalized: false, stride: 24, offset: 0 },
    { index: 1, size: 4, type: context.UNSIGNED_BYTE, normalized: true , stride: 24, offset: 12 },
    { index: 2, size: 2, type: context.FLOAT        , normalized: false, stride: 24, offset: 16 },
  ];

  return new FVertexDeclaration(vertexDeclaration);
}

export class FVertexFactory {
  
}