interface LoginModal {
    username: string;
    password: string;
}

interface SignInModal {
    loginId: string;
    nickname: string;
    password: string;
    address?: string;
    phone?: string;
}

export type {
    LoginModal,
    SignInModal
}