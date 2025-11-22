export const EScalarType =  {
  TF_Byte: WebGL2RenderingContext['BYTE'],
  TF_UByte: WebGL2RenderingContext['UNSIGNED_BYTE'],
  TF_Short: WebGL2RenderingContext['SHORT'],
  TF_UShort: WebGL2RenderingContext['UNSIGNED_SHORT'],
  TF_Int: WebGL2RenderingContext['INT'],
  TF_UInt: WebGL2RenderingContext['UNSIGNED_INT'],
  TF_HalfFloat: WebGL2RenderingContext['HALF_FLOAT'],
  TF_Float: WebGL2RenderingContext['FLOAT'],
}
export type TScalarType = typeof EScalarType[keyof typeof EScalarType];