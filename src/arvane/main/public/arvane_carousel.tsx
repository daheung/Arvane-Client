import { useMemo, useRef, useState, type FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "@/arvane/main/private/arvane_carousel.scss"
import bannerSwiperBtn from "@/assets/carousel/bannerSwiperBtn.png"

const slidesContent = [
  { id: 1, src: "/images/hero1.jpg", alt: "신제품 컬렉션" },
  { id: 2, src: "/images/hero2.jpg", alt: "거실 가구 세트" },
  { id: 3, src: "/images/hero3.jpg", alt: "홈오피스 제안" },
]

type TMainCarouselType = {

}

export const RMainCarousel: FC<TMainCarouselType> = (_: TMainCarouselType) => {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  const bannerContent = useMemo(() => slidesContent, slidesContent)
  const bannerCurMax = bannerContent.length
  const [bannerCurNum, setBannerCurNum] = useState<number>(0)

  const handleBannerPrevBtnClick: React.MouseEventHandler<HTMLButtonElement> = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    // Swiper가 처리하기 전에 내 콜백 실행
    swiperRef.current?.slidePrev();
  }

  const handleBannerNextBtnClick: React.MouseEventHandler<HTMLButtonElement> = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void => {
    // Swiper가 처리하기 전에 내 콜백 실행
    swiperRef.current?.slideNext();
  }

  return ( 
    <div className="main-banner main-carousel">
      <div className="banner-container">
        { /* 커스텀 Prev 버튼 */ }
        <div className="banner-button-prev-outer">
          <button
            ref={prevRef}
            aria-label="Previous slide"
            className="banner-button-prev"
            onClick={handleBannerPrevBtnClick}
            style={{ background: bannerSwiperBtn }}
          ></button>
        </div>
        
        <div className="banner-content-list">
            {bannerCurNum}<span className="saparater">/</span>{bannerCurMax}
        </div>

        {/* 커스텀 Next 버튼 */}
        <div className="banner-button-next-outer">
          <button
            ref={nextRef}
            aria-label="Next slide"
            className="banner-button-next"
            onClick={handleBannerNextBtnClick}
            style={{ background: bannerSwiperBtn }}
            ></button>
        </div>
      </div>

      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        loop
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={{ enabled: true }}
        style={{ 
          width: "90%",
          height: "100%",
          opacity: 1,
          borderRadius: 25,
          backgroundColor: "#D9D9D9"
        }}
        onSlideChange={(swiper) => {
            setBannerCurNum(swiper.realIndex + 1);
        }}
        onBeforeInit={(swiper) => {
          // 커스텀 버튼을 네비게이션으로 사용
          // (nextEl/prevEl은 초기화 전에 주입)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          swiper.params.navigation.prevEl = prevRef.current;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          swiper.params.navigation.nextEl = nextRef.current;
        }}
      >
        {slidesContent.map((value) => (
          <SwiperSlide key={value.id}>
            <div className="banner-content" style={{ background: value.src }} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}