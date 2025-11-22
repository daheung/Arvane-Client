import type { FC } from "react"

import { RMainRecommandationObject, type TMainRecommandationObjectType } from "../private/arvane_recommandation_object"

import "@/arvane/main/private/arvane_recommandation.scss"

import chairImage from "@/assets/carousel/banner/6c04d789f78aad42b67cee946c8c219b34a6e6e9.jpg"
import tableImage from "@/assets/carousel/banner/dc2d540bb079bd13380398b7a14b09e8eba516d3.png"
import cabinetImage from "@/assets/carousel/banner/38972b3d0a8226d8fc4acd847c6c95ad6e150e71.png"
import sofaImage from "@/assets/carousel/banner/50c0b5bc7eb0801d095923f7ebc5f5fe59d43042.png"

type TMainRecommandationType = {

}

const objectDescriptions: Array<TMainRecommandationObjectType> = [
  { image: chairImage, title: "의자", price: 250000 },
  { image: tableImage, title: "책상", price: 450000 },
  { image: cabinetImage, title: "수납장", price: 380000 },
  { image: sofaImage, title: "소파", price: 1250000 },
]

export const RMainRecommandation: FC<TMainRecommandationType> = (_: TMainRecommandationType) => {
  return (
    <div className="main-recommandation">
      <div className="title-container">
        <div className="title">추천 가구</div>
      </div>
      <div className="content">
        {
          objectDescriptions.map((value: TMainRecommandationObjectType, index: number) => 
            <RMainRecommandationObject key={index} image={value.image} price={value.price} title={value.title} /> )
        }
      </div>
    </div>
  )
}