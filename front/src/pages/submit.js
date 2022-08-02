import React from "react";
import Axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCookies } from "react-cookie";

function Submit() {
  const [postText, setPostText] = useState("");
  const [title, setTitle] = useState("");
  const [titleImage, setTitleImage] = useState("");
  const [postImage, setPostImage] = useState();
  const navigate = useNavigate();
  const [cookies] = useCookies(["accessToken"]);
  const [displayTextPost, setDisplayTextPost] = useState(true);
  const [displayPicPost, setDisplayPicPost] = useState(false);

  const submitTextPost = (e) => {
    e.preventDefault();
    Axios.post(
      `http://localhost:3001/posts`,
      { title: title, postText: postText },
      {
        headers: {
          accessToken: cookies.accessToken,
        },
      }
    ).then((res) => {
      if (res.data.error) {
        window.alert(res.data.error);
      } else {
        navigate("/");
      }
    });
  };

  const submitPicturePost = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("postPicture", postImage);
    formData.append("title", titleImage);

    Axios.post(`http://localhost:3001/posts`, formData, {
      headers: {
        accessToken: cookies.accessToken,
      },
    }).then((res) => {
      if (res.data.error) {
        window.alert(res.data.error);
      } else {
        navigate("/");
      }
    });
  };

  return (
    <div className="container d-flex flex-column submitPost card mx-auto p-0">
      <div className="container d-flex flex-row m-0 p-0">
        <p
          className={`btn btn-light flex-fill border  m-0 px-0 py-2 ${
            displayTextPost ? "btn__active" : "btn__inactive"
          }`}
          onClick={() => {
            setDisplayTextPost(true);
            setDisplayPicPost(false);
          }}
        >
          Créer un post texte
        </p>
        <p
          className={`btn btn-light flex-fill border  m-0 px-0 py-2 ${
            displayPicPost ? "btn__active" : "btn__inactive"
          }`}
          onClick={() => {
            setDisplayPicPost(true);
            setDisplayTextPost(false);
          }}
        >
          Créer un post avec image
        </p>
      </div>
      <div className="container d-flex flex-row m-0 p-4">
        {displayTextPost ? (
          <div className="col-5 m-2 submitPost__Text flex-fill">
            <form onSubmit={submitTextPost} className="d-flex flex-column">
              <label>Titre du post</label>
              <input
                type="text"
                className="form-control my-2"
                autoComplete="off"
                maxLength="100"
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
              />
              <label>Contenu du post</label>
              <textarea
                autoComplete="off"
                className="form-control my-2"
                maxLength="1000"
                onChange={(event) => {
                  setPostText(event.target.value);
                }}
              />
              <button
                className="btn btn-primary"
                disabled={!title || !postText ? true : false}
              >
                Poster
              </button>
            </form>
          </div>
        ) : null}
        {displayPicPost ? (
          <div className="col-5 m-2 submitPost__Image flex-fill">
            <form onSubmit={submitPicturePost} className="d-flex flex-column">
              <label>Titre du post</label>
              <input
                type="text"
                className="form-control my-2"
                autoComplete="off"
                maxLength="100"
                onChange={(event) => {
                  setTitleImage(event.target.value);
                }}
              />
              <input
                type="file"
                className="form-control my-2"
                id="formFile"
                name="picture"
                onChange={(e) => {
                  setPostImage(e.target.files[0]);
                }}
              />
              <button
                className="btn btn-primary"
                disabled={!titleImage || !postImage ? true : false}
              >
                Poster
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Submit;
