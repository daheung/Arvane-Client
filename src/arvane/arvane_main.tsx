import type { FC } from "react";
import RMainHeader from "@/arvane/main/public/arvane_header";

import "@/styles/global.scss"
import "@/arvane/main/private/arvane_main.scss"

import { RMainNavigation } from "./main/public/arvane_navigation";
import { RMainCarousel } from "./main/public/arvane_carousel";
import { RMainRecommandation } from "./main/public/arvane_recommandation";

type TMainPropType = {

}

export const RMain: FC<TMainPropType> = (_: TMainPropType) => {
  return (
    <div className="arvane-main">
      <RMainHeader></RMainHeader>
      <RMainNavigation></RMainNavigation>
      <RMainCarousel></RMainCarousel>
      <RMainRecommandation></RMainRecommandation>
    </div>
  )
}