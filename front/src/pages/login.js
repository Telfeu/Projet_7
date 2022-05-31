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

import { useCookies } from "react-cookie";

export default function Login(e) {
  // Valeurs login

  const [usernameLogin, setUsernameLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  const [success, setSuccess] = useState(false);

  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

  const { setAuthState } = useContext(AuthContext);
  let location = useLocation();
  const navigate = useNavigate();
  console.log(location);

  const login = (e) => {
    e.preventDefault();
    let expires = new Date();

    Axios.post("http://localhost:3001/auth/login", {
      username: usernameLogin,
      password: passwordLogin,
    }).then((response) => {
      if (response.data.message) {
        console.log(response.data.message);
        setLoginStatus(response.data.message);
      } else {
        console.log(response.data);
        setLoginStatus(response.data);
        setSuccess(true);
        console.log(response.data.token);
        setCookie("accessToken", response.data.token, {
          path: "/",
        });
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
          role: response.data.role,
        });
        navigate("/");
      }
    });
  };

  return (
    <div className="App">
      <div className="container-sm">
        <div className="login col-8 my-4 mx-auto p-0 d-flex">
          <div className="loginPicture col-sm-1"></div>
          <form className="d-flex-column col-sm-10 px-4 my-4" onSubmit={login}>
            <label>Nom d'utilisateur</label>
            <input
              className="form-control"
              type="text"
              onChange={(event) => {
                setUsernameLogin(event.target.value);
              }}
            />
            <label>Mot de passe</label>
            <input
              className="form-control"
              type="text"
              onChange={(event) => {
                setPasswordLogin(event.target.value);
              }}
            />
            <button className="btn btn-primary my-4">Se connecter</button>
          </form>
        </div>
      </div>
    </div>
  );
}
