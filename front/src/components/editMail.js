import React, {
  Component,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";
import Axios from "axios";
import { Link, useNavigate, Redirect } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { useCookies } from "react-cookie";
import {
  faCheck,
  faTimes,
  faInfoCircle,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function EditMailForm() {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [validMail, setvalidMail] = useState("false");
  const [mailFocus, setmailFocus] = useState("false");

  const [matchEmail, setmatchEmail] = useState("");
  const [validMatchMail, setvalidMatchMail] = useState("false");
  const [matchMailFocus, setmatchFocusMail] = useState("false");

  useEffect(() => {
    setvalidMail(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    setvalidMail(emailRegex.test(email));
    setvalidMatchMail(email === matchEmail);
  }, [email, matchEmail]);

  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

  const editEmail = (e, value) => {
    e.preventDefault();
    Axios.put(
      `http://localhost:3001/auth/changeemail`,
      { newEmail: email },
      {
        headers: {
          accessToken: cookies.accessToken,
        },
      }
    ).then((res) => {
      if (res.data.error) {
        window.alert(res.data.error);
      } else {
        window.location.reload(false);
      }
    });
  };

  const { authState } = useContext(AuthContext);

  return (
    <div>
      <form className="d-flex-column col-sm-10 px-4 my-4">
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
        <button
          className="btn btn-primary my-4"
          disabled={!validMail || !validMatchMail ? true : false}
          onClick={editEmail}
        >
          Modifier l'email
        </button>
      </form>
    </div>
  );
}

export default EditMailForm;
