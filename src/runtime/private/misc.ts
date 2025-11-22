import { createElement } from "react";

export const EObjectType = {
  
} as const;

export const RObjectRule = {

} as const;

export class EBufferType {
  private static _webGL2RenderContext: WebGL2RenderingContext | null = null;

  constructor() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext("webgl2");
    if ( !context ) {
      console.error('Cannot get webgl2 context.');
      return;
    }

    EBufferType._webGL2RenderContext = context;
  }

  public static IsInt(target: number): boolean {
    if ( !EBufferType._webGL2RenderContext ) {
      console.error(`Cannot check ${target} is Integer Type due to WebGL2RenderingContext is not initialized.`);
      return false;
    }

    return (
      target === EBufferType._webGL2RenderContext.BYTE      || target === EBufferType._webGL2RenderContext.BYTE  + 1 ||
      target === EBufferType._webGL2RenderContext.SHORT     || target === EBufferType._webGL2RenderContext.SHORT + 1 || 
      target === EBufferType._webGL2RenderContext.INT       || target === EBufferType._webGL2RenderContext.INT   + 1
    )
  }

  public static IsFloat(target: number): boolean {
    if ( !EBufferType._webGL2RenderContext ) {
      console.error(`Cannot check ${target} is Integer Type due to WebGL2RenderingContext is not initialized.`);
      return false;
    }

    return (
      target === EBufferType._webGL2RenderContext.HALF_FLOAT ||
      target === EBufferType._webGL2RenderContext.FLOAT
    )
  }
}