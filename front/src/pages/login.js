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

export default function Login(e) {
  // Valeurs login

  const [usernameLogin, setUsernameLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  const [success, setSuccess] = useState(false);

  const { setAuthState } = useContext(AuthContext);
  let location = useLocation();
  console.log(location);

  const login = (e) => {
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
        document.cookie = "accessToken=" + response.data.token;
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        return <Navigate to="/" replace />;
      }
    });
  };

  return (
    <div className="App">
      <div className="login">
        <form onSubmit={login}>
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            onChange={(event) => {
              setUsernameLogin(event.target.value);
            }}
          />
          <label>Mot de passe</label>
          <input
            type="text"
            onChange={(event) => {
              setPasswordLogin(event.target.value);
            }}
          />
          <button>Se connecter</button>
        </form>
      </div>
    </div>
  );
}
