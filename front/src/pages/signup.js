import { useRef, useState, useEffect } from "react";
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
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Axios from "axios";

const userRegex = /^[A-z][A-z0-9-_]{3,23}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export default function Signup() {
  const userRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();

  // Valeurs inscription
  const [username, setUsername] = useState("");
  const [validName, setvalidName] = useState("false");
  const [userFocus, setuserFocus] = useState("false");

  const [email, setEmail] = useState("");
  const [validMail, setvalidMail] = useState("false");
  const [mailFocus, setmailFocus] = useState("false");

  const [matchEmail, setmatchEmail] = useState("");
  const [validMatchMail, setvalidMatchMail] = useState("false");
  const [matchMailFocus, setmatchFocusMail] = useState("false");

  const [password, setPassword] = useState("");
  const [validPassword, setvalidPassword] = useState("false");
  const [passwordFocus, setpasswordFocus] = useState("false");

  const [matchPassword, setmatchPassword] = useState("");
  const [validMatch, setvalidMatch] = useState("false");
  const [matchFocus, setmatchFocus] = useState("false");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSucces] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setvalidName(userRegex.test(username));
  }, [username]);

  useEffect(() => {
    setvalidMail(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    setvalidPassword(passwordRegex.test(password));
    setvalidMatch(password === matchPassword);
  }, [password, matchPassword]);

  useEffect(() => {
    setvalidMail(emailRegex.test(email));
    setvalidMatchMail(email === matchEmail);
  }, [email, matchEmail]);

  useEffect(() => {
    setErrMsg("");
  }, [username, password, matchPassword]);

  const signUp = async (e) => {
    e.preventDefault();
    console.log(username, email, password);
    Axios.post("http://localhost:3001/auth/signup", {
      username: username,
      email: email,
      password: password,
    }).then(() => {
      console.log("Enregistré");
      navigate("/login");
    });
  };

  return (
    <div className="App">
      <section className="signup container-sm">
        <div className="login col-8 my-4 mx-auto p-0 d-flex">
          <div className="loginPicture col-sm-1"></div>
          <form className="d-flex-column col-sm-10 px-4 my-4">
            <label>
              <FontAwesomeIcon
                icon={faCheck}
                className={validName ? "valid" : "hide"}
              />
              <FontAwesomeIcon
                icon={faTimes}
                className={validName || !username ? "hide" : "invalid"}
              />
              Pseudo
            </label>
            <input
              type="text"
              className="form-control"
              ref={userRef}
              autoComplete="off"
              onChange={(event) => {
                setUsername(event.target.value);
              }}
            />
            <p
              id="uidnote"
              className={
                userFocus && username && !validName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Entre 4 et 24 caractères.
              <br />
              Doit commencer par une lettre.
            </p>
            <label>Email</label>
            <input
              type="text"
              className="form-control"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
            />
            <p
              id="uidnote"
              className={
                mailFocus && email && !validMail ? "instructions" : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Email non valide
            </p>
            <label>Confirmer votre email</label>
            <input
              type="text"
              className="form-control"
              onChange={(event) => {
                setmatchEmail(event.target.value);
              }}
            />
            <p
              id="uidnote"
              className={
                matchMailFocus && matchEmail && !validMatchMail
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              La confirmation de l'email ne correspond pas
            </p>
            <label>Mot de passe</label>
            <input
              type="password"
              className="form-control"
              id="password"
              onChange={(event) => {
                setPassword(event.target.value);
              }}
            />
            <p
              id="uidnote"
              className={
                passwordFocus && password && !validPassword
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Le mot de passe doit comporter au moins une majuscule et un
              chiffre
            </p>

            <label htmlFor="confirm_pwd">Confirmer votre mot de passe</label>
            <input
              type="password"
              className="form-control"
              id="confirm_pwd"
              onChange={(event) => setmatchPassword(event.target.value)}
              required
            />
            <p
              id="uidnote"
              className={
                matchFocus && matchPassword && !validMatch
                  ? "instructions"
                  : "offscreen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              Les mots de passes ne correspondent pas
            </p>
            <button
              className="btn btn-primary my-4"
              disabled={
                !validName ||
                !validPassword ||
                !validMatch ||
                !validMail ||
                !validMatchMail
                  ? true
                  : false
              }
              onClick={signUp}
            >
              S'inscrire
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
