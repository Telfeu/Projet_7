import React, { Component, useContext } from "react";
import Axios from "axios";
import { Link, useNavigate, Redirect } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

function DisplayPost({ value, key }) {
  const editPost = (e, value) => {
    e.preventDefault();
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
      </div>
    </div>
  );
}

export default DisplayPost;
