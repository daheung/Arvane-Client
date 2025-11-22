
import type { FC, MouseEventHandler } from "react";
import { RArvaneLogo } from "@/components/logo";

import "@/styles/global.scss"
import "@/arvane/main/private/arvane_header.scss"
import { useNavigate } from "react-router-dom";

type TMainHeaderPropType = {

}

const RMainHeader: FC<TMainHeaderPropType> = (_: TMainHeaderPropType) => {
  const navigate = useNavigate()

  const handleLogoClick: MouseEventHandler<HTMLDivElement> = (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    navigate('/')
  }
  
  const handleSigninClick: MouseEventHandler<HTMLDivElement> = (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    navigate("/signin")
  }

  const handleSignupClick: MouseEventHandler<HTMLDivElement> = (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    navigate("/signup")
  }

  return (
    <div className="main-header">
      <RArvaneLogo handleClick={handleLogoClick} />
      <div className="header-user-menu">
        <div onClick={handleSigninClick}>로그인</div> <span>|</span>
        <div onClick={handleSignupClick}>회원가입</div>
      </div>
    </div>
  )
}

export default RMainHeader;