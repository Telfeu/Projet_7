import { useRef, useState, useEffect } from "react";
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
    });
  };

  return (
    <div className="App">
      <section className="signup">
        <form>
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
            ref={userRef}
            autoComplete="off"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <p
            id="uidnote"
            className={
              userFocus && username && !validName ? "instructions" : "offscreen"
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
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <label>Confirmer votre email</label>
          <input
            type="text"
            onChange={(event) => {
              setmatchEmail(event.target.value);
            }}
          />
          <label>Mot de passe</label>
          <input
            type="password"
            id="password"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
          />

          <label htmlFor="confirm_pwd">Confirmer votre mot de passe</label>
          <input
            type="password"
            id="confirm_pwd"
            onChange={(event) => setmatchPassword(event.target.value)}
            required
          />
          <button
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
      </section>
    </div>
  );
}
