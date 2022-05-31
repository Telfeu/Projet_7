import React, { Component, useContext } from "react";
import Axios from "axios";
import { Link, useNavigate, Redirect } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { useCookies } from "react-cookie";

function DisplayComment({ value, key }) {
  console.log(value);
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const deleteComment = (e, value) => {
    e.preventDefault();
    console.log("Commentaire supprimé");

    Axios.delete(
      `http://localhost:3001/posts/${value.PostId}/comments/${value.id}`,
      {
        headers: {
          accessToken: cookies.accessToken,
        },
      }
    ).then((res) => {
      console.log(res.data);
      window.location.reload(false);
    });
  };

  const { authState } = useContext(AuthContext);

  return (
    <div className="card">
      <div className="card-header">
        <Link to={`/profile/${value.UserId}`}> {value.User.username} </Link>
      </div>
      <div className="card-body d-flex">
        <p>{value.commentBody}</p>
      </div>

      <div className="footer">
        {value.UserId === authState.id ? (
          <>
            <button
              className="btn btn-primary m-2"
              value={value.id}
              onClick={(e) => deleteComment(e, e.target.value)}
            >
              Supprimer
            </button>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default DisplayComment;
