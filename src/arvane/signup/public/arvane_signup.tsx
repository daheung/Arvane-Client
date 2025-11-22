import { RArvaneLogo } from "@/components/logo";
import { TextField } from "@mui/material";
import { useState, type FC, type MouseEventHandler } from "react";
import { useNavigate } from "react-router-dom";

import "@/arvane/signup/private/arvane_signup.scss";

type TSignupPropType = {}
export const RSignup: FC<TSignupPropType> = (_: TSignupPropType) => {
  const navigate = useNavigate();
  
  const [userId, setUserId] = useState<string | null>(null);
  const [verifyId, setVerifyId] = useState<boolean | null>(null);
  const [userPassword, setUserPassword] = useState<string | null>(null);
  const [verifyPassword, setVerifyPassword] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [userPhone, setUserPhone] = useState<string | null>(null);

  const handleLogoClick: MouseEventHandler<HTMLDivElement> = (
    _: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    navigate("/main");
  };

  const checkUserInput = () => {
    const validId      : boolean = (userId       !== null) && !!verifyId;
    const validPassword: boolean = (userPassword !== null) && 
      (verifyPassword !== null) && 
      (userPassword   === verifyPassword);
    const validAddress : boolean = (userAddress  !== null);
    const validPhone   : boolean = (userPhone    !== null);

    return ( validId && validPassword && validAddress && validPhone );
  }

  const handleVerifyId:  MouseEventHandler<HTMLButtonElement> = (
    _: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    /** 아직까지는 아이디 확인하지 않음. 추수 기능 추가 예정 */
    setVerifyId(true);
  }

  return (
    <div className="signup">
      <div className="signup-header">
        <RArvaneLogo handleClick={handleLogoClick} />
      </div>
      <div className="signup-body">
        <div className="signup-container">
          <div className="signup-title">회원가입</div>

          {/** 아이디 입력 칸 */}
          <div className="user-id-container">
            <TextField 
              className="user-id-input-box input-box" 
              label="아이디" 
              value={userId ?? undefined} 
              onChange={(event) => { setUserId(event.target.value); }} 
            />
            <div className="check-duplication-container">
              <div className="check-text-box">이미 있는 아이디 입니다.</div>
              <button className="check-duplication" onClick={handleVerifyId}>중복확인</button>
            </div>
          </div>

          {/** 비밀번호 입력 칸 */}
          <TextField 
            className="user-password-input-box input-box" 
            label="비밀번호" 
            type="password"
            value={userPassword ?? undefined} 
            onChange={(event) => { setUserPassword(event.target.value); }} 
          />

          {/** 비밀번호 확인 입력 칸 */}
          <TextField 
            className="user-verify-password-input-box input-box" 
            label="비밀번호 확인" 
            type="password"
            value={verifyPassword ?? undefined} 
            onChange={(event) => { setVerifyPassword(event.target.value); }} 
          />

          {/** 주소 입력 칸 */}  
          <TextField 
            className="user-address-input-box input-box" 
            label="주소" 
            value={userAddress ?? undefined} 
            onChange={(event) => { setUserAddress(event.target.value); }} 
          />

          {/** 전화번호 입력 칸 */}
          <TextField 
            className="user-phone-input-box input-box" 
            label="전화번호" 
            value={userPhone ?? undefined} 
            onChange={(event) => { setUserPhone(event.target.value); }} 
          />

          {/** 회원가입 버튼 */}
          <button className="signup-submit" disabled={!checkUserInput()}>회원가입</button>
        </div>
      </div>
    </div>
  )
}