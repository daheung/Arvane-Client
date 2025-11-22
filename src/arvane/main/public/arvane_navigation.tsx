import type { FC } from "react";

import "@/arvane/main/private/arvane_navigation.scss"
import { useNavigate } from "react-router-dom";

type TMainNavigationType = {};
export const RMainNavigation: FC<TMainNavigationType> = (_: TMainNavigationType) => {
  const navigation = useNavigate();

  const handleRegisterClick: React.MouseEventHandler<HTMLDivElement> = (_) => {
    navigation("/register_furniture");
  }

  return (
    <>
      <div className="main-navigation">
        <div className="main-content">
          <div className="content">가구 검색</div>
          <div className="content">가구 배치</div>
          <div className="content">찜 목록</div>
          <div className="content">구매하기</div>
          <div className="content">의자</div>
          <div className="content">소파</div>
          <div className="content">책상</div>
          <div className="content">수납장</div>
          <div className="content" onClick={handleRegisterClick}>가구 등록</div>
        </div>
        <div className="main-support">
          서비스 및 지원
        </div>
      </div>
      <div className="navigation-line">
        <div className="horizontal-line"></div>
      </div>
    </>
  )
}