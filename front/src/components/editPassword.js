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

import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function EditPasswordForm({ value, key }) {
  const navigate = useNavigate();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,24}$/;
  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [validPassword, setvalidPassword] = useState("false");
  const [passwordFocus, setpasswordFocus] = useState("false");

  const [matchPassword, setmatchPassword] = useState("");
  const [validMatch, setvalidMatch] = useState("false");
  const [matchFocus, setmatchFocus] = useState("false");

  useEffect(() => {
    setvalidPassword(passwordRegex.test(newpassword));
    setvalidMatch(newpassword === matchPassword);
  }, [newpassword, matchPassword]);

  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

  const editPassword = (e, value) => {
    e.preventDefault();
    Axios.put(
      `http://localhost:3001/auth/changepassword`,
      { oldPassword: oldpassword, newPassword: newpassword },
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
    <div id="password__edit__form">
      <form className="d-flex-column col-sm-10 px-4 my-4">
        <label htmlFor="oldpassword">Ancien mot de passe</label>
        <input
          type="password"
          className="form-control"
          id="oldpassword"
          onChange={(event) => {
            setOldPassword(event.target.value);
          }}
        />
        <label htmlFor="newpassword">Nouveau mot de passe</label>
        <input
          type="password"
          className="form-control"
          id="newpassword"
          onChange={(event) => {
            setNewPassword(event.target.value);
          }}
        />
        <p
          id="uidnote"
          className={
            passwordFocus && newpassword && !validPassword
              ? "instructions"
              : "offscreen"
          }
        >
          <FontAwesomeIcon icon={faInfoCircle} />
          Le mot de passe doit comporter au moins une majuscule et un chiffre
        </p>

        <label htmlFor="confirm_pwd">
          Confirmer votre nouveau mot de passe
        </label>
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
          disabled={!validPassword || !validMatch ? true : false}
          onClick={editPassword}
        >
          Modifier le mot de passe
        </button>
      </form>
    </div>
  );
}

export default EditPasswordForm;
