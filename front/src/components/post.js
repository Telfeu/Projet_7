import React, { Component, useContext } from "react";
import Axios from "axios";
import { Link, useNavigate, Redirect } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { useCookies } from "react-cookie";

function DisplayPost({ value, key }) {
  const commentsNumber = value.Comments.length;
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const deletePost = (e, value) => {
    e.preventDefault();
    Axios.delete(`http://localhost:3001/posts/${value}`, {
      headers: {
        accessToken: cookies.accessToken,
      },
    }).then((res) => {
      console.log(res.data);
      window.location.reload(false);
    });
  };

  const { authState } = useContext(AuthContext);
  console.log(value.User);
  console.log(authState);

  return (
    <div className="card" key={key}>
      <div className="card-header d-flex">
        {" "}
        <Link className="card-title flex-fill" to={`/post/${value.id}`}>
          {" "}
          {value.title}
        </Link>
        <h6 className="align-self-end">
          {" "}
          Posté par{" "}
          <img
            src={value.User.userPicture}
            className="profilePicture__mini"
          />{" "}
          <Link to={`/profile/${value.UserId}`}>{value.User.username}</Link>
        </h6>
      </div>
      <div className="card-body d-flex justify-content-center">
        <Link
          className="post__link d-flex justify-content-center"
          to={`/post/${value.id}`}
        >
          {value.postText !== null ? (
            <>
              <p className="card-text">{value.postText}</p>
            </>
          ) : (
            <>
              <img src={value.postPicture} className="post__Picture" />
            </>
          )}
        </Link>
      </div>
      <div className="text-muted d-flex flex-row align-items-center">
        {value.UserId === authState.id || authState.role === true ? (
          <>
            <button
              className="btn btn-primary m-2"
              value={value.id}
              onClick={(e) => deletePost(e, e.target.value)}
            >
              Supprimer
            </button>
            <Link to={`/edit/${value.id}`}>
              <button className="btn btn-primary m-2" value={value.id}>
                Modifier
              </button>
            </Link>
          </>
        ) : (
          ""
        )}

        {value.Comments !== null ? (
          <>
            <p className="p2 m2 flex-fill text-end">
              Nombre de commentaire : {value.Comments.length}
            </p>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default DisplayPost;
