import React, { useEffect, useRef, useState, type FC } from "react";
import type { IFWebGL2CommandExecutor } from "../../../../runtime/private/engine/command_executor";
import { FObjectPrimitiveProxy } from "@/arvane/simulation/private/object/object_primitive";
import { GetDefaultVertexDeclaration } from "@/runtime/private/engine/webgl2/vertex_declaration/vertex_declaration";

type TObjectPropType = {
  owner: IFWebGL2CommandExecutor;
  polygonPath: string;
};

export const FObject: FC<TObjectPropType> = (prop: TObjectPropType) => {
  const polygonPath: React.RefObject<string> = useRef<string>(prop.polygonPath);

  const [objectPrimitiveComponent, _] = useState<FObjectPrimitiveProxy>(new FObjectPrimitiveProxy(
    prop.owner.context, 
    GetDefaultVertexDeclaration(prop.owner.context)
  ));

  useEffect(() => {

  }, []);

  return null;
}