import { type FC } from "react"

import "@/arvane/main/private/arvane_recommandation_object.scss"
import { insertStr } from "@/arvane/utils"

export type TMainRecommandationObjectType = {
    title: string,
    price: number,
    image: string,
}

export const RMainRecommandationObject: FC<TMainRecommandationObjectType> = (prop: TMainRecommandationObjectType) => {
  const price = insertStr(String(prop.price), ",", 3, 0, "end");

  return (
    <div className="object-recommandation-object">
      <img className="object-image" src={prop.image} alt={prop.title} />
      <div className="object-content">
        <div className="object-title">{prop.title}</div>
        <div className="object-price">{price}</div>
      </div>
    </div>
  )
}