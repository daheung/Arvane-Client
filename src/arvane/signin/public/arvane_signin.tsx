import {RArvaneLogo} from "@/components/logo";
import {type FC, type MouseEventHandler, useEffect, useState} from "react";
import TextField from '@mui/material/TextField';
import {useNavigate} from "react-router-dom";

import "@/arvane/signin/private/arvane_signin.scss"
import "@/styles/global.scss"
import {Checkbox} from "@mui/material";
import {useIsLoginQuery, useLoginMutation} from "@/stores/api/authApi.ts";

type TSigninPropType = {};
export const RSignin: FC<TSigninPropType> = (_: TSigninPropType) => {
    const navigate = useNavigate();

    const {data: isLogin} = useIsLoginQuery();
    const [onLogin] = useLoginMutation();

    const [userId, setUserId] = useState<string | null>(null);
    const [userPassword, setUserPassword] = useState<string | null>(null);
    const [isAutoLogin, SetIsAutoLogin] = useState<boolean | null>(null);

    // 로그인이 되었을 경우 메인페이지로 리다리렉트
    useEffect(() => {
        if (isLogin) navigate("/");
    }, [isLogin, navigate]);

    const handleLogoClick: MouseEventHandler<HTMLDivElement> = (): void => {
        navigate("/main");
    };

    const handleIdChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setUserId(event.target.value);
    };

    const handlePasswordChange= (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserPassword(event.target.value);
    };

    const handleAutoLoginChange: MouseEventHandler<HTMLDivElement> = () => {
        SetIsAutoLogin(!isAutoLogin);
    }

    const handleLogin = () => {
        onLogin({
            username: userId!,
            password: userPassword!
        }).unwrap().then(() => {
            navigate("/")
        }).catch(() => {
            // TODO : 로그인 실패
        });
    }

    return (
        <div className="signin">
            <div className="sign-header">
                <RArvaneLogo handleClick={handleLogoClick}/>
            </div>
            <div className="signin-container-outer">
                <div className="signin-container-inner">
                    {/** 로그인 제목 칸 */}
                    <div className="login-title">로그인</div>

                    {/** 아이디 입력 칸 */}
                    <TextField
                        className="user-id-input-box input-box"
                        label="아이디"
                        value={userId ?? undefined}
                        onChange={handleIdChange}
                    />

                    {/** 비밀번호 입력 칸 */}
                    <TextField
                        className="user-password-input-box input-box"
                        label="비밀번호"
                        value={userPassword ?? undefined}
                        onChange={handlePasswordChange}
                    />

                    {/** 로그인 상태 유지 칸 */}
                    <div className="auto-login-container-outer">
                        <div
                            className="auto-login-container-inner"
                            onClick={handleAutoLoginChange}
                        >
                            <Checkbox
                                className="auto-login-check-box"
                                checked={isAutoLogin ?? false}
                            />
                            <div className="auto-login-text">로그인 상태 유지</div>
                        </div>
                    </div>

                    <button
                        className="login-submit"
                        onClick={handleLogin}
                    >
                        로그인
                    </button>
                    <div className="no-id-text">아이디가 없으신가요?</div>
                    <button
                        className="signup"
                        onClick={() => navigate('/signup')}
                    >
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    )
}