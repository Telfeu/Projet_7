import "../App.css";
import React, { useState, useContext } from "react";
import Axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";

import Login from "../components/login";
import Signup from "../components/signup";

import { useCookies, CookiesProvider } from "react-cookie";

export default function AuthPage(e) {
  // Valeurs login

  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

  const [displayLogin, setDisplayLogin] = useState(true);
  const [displaySignup, setDisplaySignup] = useState(false);

  const { setAuthState } = useContext(AuthContext);
  let location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="container-sm">
        <div className="login col-12 col-lg-8 my-4 mx-auto p-0 d-flex flex-wrap">
          <div className="loginPicture col-1"></div>
          <div className="col-11 my-4 mx-auto px-4 d-flex-column">
            {displayLogin ? (
              <>
                <CookiesProvider>
                  <Login />
                </CookiesProvider>
                <button
                  className="btn btn-primary m-0"
                  onClick={() => {
                    setDisplayLogin(false);
                    setDisplaySignup(true);
                  }}
                >
                  S'inscrire
                </button>
              </>
            ) : (
              ""
            )}
            {displaySignup ? (
              <>
                <CookiesProvider>
                  <Signup />
                </CookiesProvider>
                <button
                  className="btn btn-primary  m-0"
                  onClick={() => {
                    setDisplayLogin(true);
                    setDisplaySignup(false);
                  }}
                >
                  Se connecter
                </button>
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
