export type TWebGL2InputElementDescription = {
  index: number;
  size: number;
  type: number;
  normalized?: boolean;
  stride: number;
  offset: number;
}

export type TVertexElements = Array<TWebGL2InputElementDescription>;

export class FVertexDeclaration {
  private _vertexElements: TVertexElements = new Array<TWebGL2InputElementDescription>();
  constructor(vertexElements: TVertexElements) {
    this._vertexElements = vertexElements;
  }

  public get vertexElements(): TVertexElements {
    return this._vertexElements;
  }
}