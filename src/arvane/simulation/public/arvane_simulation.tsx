import React, { useRef, useState, type FC } from "react";
import { FSimulWorld } from "@/arvane/simulation/public/object/world"
import { RArvaneLogo } from "@/components/logo";

type TObjectSimulationPropType = {};
export const RObjectSimulation: FC<TObjectSimulationPropType> = (_: TObjectSimulationPropType) => {
  const [world, setWorld] = useState<FSimulWorld>(new FSimulWorld());
  const canvasRef: React.RefObject<HTMLCanvasElement | null> = useRef<HTMLCanvasElement | null>(null);

  return (
    <div>
      <div className="arvane-header">
        <RArvaneLogo></RArvaneLogo>
      </div>
      <div className="arvane-body">
        <canvas ref={canvasRef} className="arvane-canvas"></canvas>
      </div>
    </div>
  );
}