import type { FC, MouseEventHandler } from "react";

import "@/components/private/logo.scss"

export type TArvaneLogoType = {
  className?: string;
  handleClick?: MouseEventHandler<HTMLDivElement>;
}

export const RArvaneLogo: FC<TArvaneLogoType> = (prop: TArvaneLogoType) => {
  const haneleClick: MouseEventHandler<HTMLDivElement> = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (prop.handleClick) {
      prop.handleClick(event)
    }
  }

  return (
    <div className="main-header-logo" onClick={haneleClick}>ARVANE</div>
  )
}