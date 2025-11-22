import { type FC } from 'react'
import { Routes, Route, Navigate } from "react-router-dom";

import { RMain } from "@/arvane/arvane_main"
import { RSignin } from './arvane/signin/public/arvane_signin';

import "@/styles/global.scss"
import './App.css'
import { RSignup } from './arvane/signup/public/arvane_signup';
import { RObjectSimulation } from './arvane/simulation/public/arvane_simulation';
import { RRegisterFurniture } from './arvane/navigations/public/register_furniture';
import { RDebugMain } from './arvane/debug/public/debug_main';

type TRouteDescription = {
  path: string,
  element: FC<any>
}

const routeDescriptions: Array<TRouteDescription> = [
  { path: "/main"      , element: RMain             },
  { path: "/signin"    , element: RSignin           },
  { path: "/signup"    , element: RSignup           },
  { path: "/simulation", element: RObjectSimulation },
  { path: "/register_furniture", element: RRegisterFurniture },

  // Only debug
  { path: "/debug/main", element: RDebugMain }
]

function App() {
  return (
    <>
      <Routes>
        { 
          routeDescriptions.map((value: TRouteDescription, index: number) => {
            return <Route key={index} path={value.path} element={ <value.element /> } />
          }) 
        }

        { /* 어떤 경로에도 매칭 안 되면 / 로 이동 */ }
        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>
    </>
  )
}

export default App
