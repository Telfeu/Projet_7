import React, { Component, useContext } from "react";
import Axios from "axios";
import { Link, useNavigate, Redirect } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function DisplayComment({ value, key }) {
  console.log(value);
  const deleteComment = (e, value) => {
    e.preventDefault();
    console.log("Commentaire supprimé");

    Axios.delete(
      `http://localhost:3001/posts/${value.PostId}/comments/${value.id}`,
      {
        headers: {
          accessToken: document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            .split("=")[1],
        },
      }
    ).then((res) => {
      console.log(res.data);
      window.location.reload(false);
    });
  };

  const { authState } = useContext(AuthContext);

  return (
    <div className="commentBody">
      {value.commentBody}
      <div className="footer">
        <div className="username">
          <Link to={`/profile/${value.UserId}`}> {value.User.username} </Link>
        </div>
        {value.UserId === authState.id ? (
          <>
            <button
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
