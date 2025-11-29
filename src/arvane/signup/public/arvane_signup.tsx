import {RArvaneLogo} from "@/components/logo";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

import "@/arvane/signup/private/arvane_signup.scss";
import type {SignInModal} from "@/models/UserModel.ts";
import {useLazyDuplicatedLoginIdQuery, useSignInMutation} from "@/stores/api/authApi.ts";
import {ObjText, SingleText} from "mui-fast-start";

export const RSignup = () => {
    const navigate = useNavigate();

    const [onVerifyId, {data: verifyId}] = useLazyDuplicatedLoginIdQuery();
    const [onSignIn] = useSignInMutation();

    const [verifyPassword, setVerifyPassword] = useState<string>('');
    const [signIn, setSignIn] = useState<SignInModal>({
        loginId: '',
        nickname: '',
        password: ''
    });

    const handleLogoClick = () => navigate("/main");

    const checkUserInput = () => {
        const validId: boolean = (signIn.loginId !== null) && !verifyId;
        const validPassword: boolean = (signIn.password !== null) &&
            (verifyPassword !== null) &&
            (signIn.password === verifyPassword);
        const validAddress: boolean = (signIn.address !== null);
        const validPhone: boolean = (signIn.phone !== null);

        return (validId && validPassword && validAddress && validPhone);
    }

    const handleSubmit = () => {
        signIn.nickname = signIn.loginId;
        onSignIn(signIn).unwrap().then(() => {
            navigate('/signin')
            // 회원가입 성공
        }).catch(() => {
            // 회원가입 실패
        });
    }

    return (
        <div className="signup">
            <div className="signup-header">
                <RArvaneLogo handleClick={handleLogoClick}/>
            </div>
            <div className="signup-body">
                <div className="signup-container">
                    <div className="signup-title">회원가입</div>

                    {/** 아이디 입력 칸 */}
                    <div className="user-id-container">
                        <ObjText
                            className="user-id-input-box input-box"
                            size='medium'
                            name="loginId" label="아이디"
                            get={signIn} set={setSignIn}
                        />
                        <div className="check-duplication-container">
                            {verifyId && (
                                <div className="check-text-box">이미 있는 아이디 입니다.</div>
                            )}
                            <button
                                className="check-duplication"
                                onClick={() => onVerifyId(signIn.loginId)}
                            >
                                중복확인
                            </button>
                        </div>
                    </div>

                    {/** 비밀번호 입력 칸 */}
                    <ObjText<SignInModal>
                        className="user-password-input-box input-box"
                        size='medium' type='password'
                        name='password' label="비밀번호"
                        get={signIn} set={setSignIn}
                    />

                    {/** 비밀번호 확인 입력 칸 */}
                    <SingleText
                        className="user-verify-password-input-box input-box"
                        size='medium' type='password'
                        label="비밀번호 확인"
                        get={verifyPassword} set={setVerifyPassword}
                    />

                    {/** 주소 입력 칸 */}
                    <ObjText<SignInModal>
                        className="user-address-input-box input-box"
                        size='medium'
                        name='address' label="주소"
                        get={signIn} set={setSignIn}
                    />

                    {/** 전화번호 입력 칸 */}
                    <ObjText
                        className="user-phone-input-box input-box"
                        size='medium'
                        name="phone" label="전화번호"
                        get={signIn} set={setSignIn}
                    />

                    {/** 회원가입 버튼 */}
                    <button
                        className="signup-submit"
                        disabled={!checkUserInput()}
                        onClick={handleSubmit}
                    >
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    )
}