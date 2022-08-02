import React, { Component, useContext, useState, useEffect } from "react";
import Axios from "axios";

import { Link, useNavigate, Redirect } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { useCookies } from "react-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import {
  faCirclePlus,
  faCommentDots,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

function DisplayPost({ value, postnumber }) {
  const { authState } = useContext(AuthContext);
  library.add(faCommentDots, faHeart);
  const commentsNumber = value.Comments.length;
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [isLiked, setisLiked] = useState(false);
  const [numberLike, setnumberLike] = useState(value.Likes.length);

  useEffect(() => {
    if (value.Likes.length >= 1 && value.Likes[0].UserId === authState.id) {
      setisLiked(true);
    }
  }, []);

  const deletePost = (e, value) => {
    e.preventDefault();
    Axios.delete(`http://localhost:3001/posts/${value}`, {
      headers: {
        accessToken: cookies.accessToken,
      },
    }).then((res) => {
      window.alert("Post supprimé");
      window.location.reload(false);
    });
  };

  const likePost = (e, value) => {
    e.preventDefault();
    if (isLiked == false) {
      setisLiked(true);
    }
    if (isLiked == true) {
      setisLiked(false);
    }

    Axios.post(
      `http://localhost:3001/posts/like`,
      { userId: authState.id, postId: value },
      {
        headers: {
          accessToken: cookies.accessToken,
        },
      }
    ).then((res) => {
      setnumberLike(res.data);
    });
  };

  return (
    <div className="card" key={postnumber}>
      <div className="card-header d-flex flex-wrap flex-sm-nowrap">
        {" "}
        <Link
          className="card-title flex-fill word-wrap"
          to={`/post/${value.id}`}
        >
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
      <div className="text-muted d-flex flex-row align-items-center flex-wrap flex-sm-nowrap">
        {value.UserId === authState.id || authState.role === true ? (
          <>
            <div className="d-flex p-2 m-2 flex-row align-items-center  flex-fill flex-wrap flex-sm-nowrap">
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
            </div>
          </>
        ) : (
          ""
        )}
        <div className="d-flex p-2 m-2 flex-row align-items-center justify-content-end flex-fill flex-wrap flex-sm-nowrap">
          <p className="p-2 m-0">{numberLike}</p>
          <button
            className={`heartButton ${isLiked ? "is-active" : ""}`}
            value={value.id}
            onClick={(e) => likePost(e, e.currentTarget.value)}
          >
            <FontAwesomeIcon icon="fa-solid fa-heart " className="heart" />
          </button>
        </div>

        {value.Comments !== null ? (
          <>
            <p className="p-2 m-2  text-end flex-wrap">
              <FontAwesomeIcon
                icon="fa-solid fa-comment-dots"
                className="post__commentsNumber"
              />{" "}
              : {value.Comments.length}
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
