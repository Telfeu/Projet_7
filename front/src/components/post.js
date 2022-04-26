import React, { Component, useContext } from "react";
import Axios from "axios";
import { Link, useNavigate, Redirect } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function DisplayPost({ value, key }) {
  const deletePost = (e, value) => {
    e.preventDefault();
    Axios.delete(`http://localhost:3001/posts/${value}`, {
      headers: {
        accessToken: document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          .split("=")[1],
      },
    }).then((res) => {
      console.log(res.data);
      window.location.reload(false);
    });
  };

  const { authState } = useContext(AuthContext);
  console.log(value.User);

  return (
    <div className="postBody">
      <div className="title">
        {" "}
        <Link to={`/post/${value.id}`}>{value.title}</Link>
      </div>
      <div className="body">{value.postText}</div>
      <div className="footer">
        <div className="username">
          <Link to={`/profile/${value.UserId}`}>{value.User.username}</Link>
        </div>
        {value.UserId === authState.id || authState.role === true ? (
          <>
            <button
              value={value.id}
              onClick={(e) => deletePost(e, e.target.value)}
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

export default DisplayPost;
