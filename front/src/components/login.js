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

import { useCookies, CookiesProvider } from "react-cookie";

function Login(e) {
  // Valeurs login

  const [usernameLogin, setUsernameLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const [errormessage, setErrorMessage] = useState("");

  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

  const [displayLogin, setDisplayLogin] = useState(true);
  const [displaySignup, setDisplaySignup] = useState(false);

  const { setAuthState } = useContext(AuthContext);
  let location = useLocation();
  const navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();
    let expires = new Date();

    Axios.post("http://localhost:3001/auth/login", {
      username: usernameLogin,
      password: passwordLogin,
    }).then((response) => {
      if (response.data.error) {
        setErrorMessage(response.data.error);
      } else {
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
    <div className="col-12  my-4 mx-auto p-0 d-flex">
      <form className="d-flex-column col-12  p-0 " onSubmit={login}>
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
          type="password"
          onChange={(event) => {
            setPasswordLogin(event.target.value);
          }}
        />
        <button className="btn btn-primary my-4">Se connecter</button>
        <p>{errormessage}</p>
      </form>
    </div>
  );
}
export default Login;
