import React, { useContext } from "react";
import Axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { useCookies } from "react-cookie";
import PostPage from "./post";

function Edit() {
  const navigate = useNavigate();
  const postId = useParams();
  const [postEdit, setPostEdit] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const [title, setTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState();

  const editPost = (e) => {
    e.preventDefault();
    console.log("Post posté");
    Axios.put(
      `http://localhost:3001/posts/${postId.id}`,
      { title: title, postText: postText },
      {
        headers: {
          accessToken: cookies.accessToken,
        },
      }
    ).then((res) => {
      if (res.data.error) {
        console.log(res.data.error);
      } else {
        navigate("/");
      }
    });
  };

  const editPicturePost = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("postPicture", postImage);
    formData.append("title", title);
    console.log(formData);

    Axios.put(`http://localhost:3001/posts/${postId.id}`, formData, {
      headers: {
        accessToken: cookies.accessToken,
      },
    }).then((res) => {
      if (res.data.error) {
        console.log(res.data.error);
      } else {
        navigate("/");
      }
    });
  };

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();

    console.log("Récupération");
    Axios.get(`http://localhost:3001/posts/${postId.id}`, {
      headers: {
        accessToken: cookies.accessToken,
      },
    })
      .then((res) => {
        if (!unmounted) {
          setPostEdit(res.data);
          console.log(res.data);
          console.log(postEdit.title);
          setLoading(false);
        }
      })
      .catch(function (e) {
        if (!unmounted) {
          if (Axios.isCancel(e)) {
            console.log(`request cancelled:${e.message}`);
          } else {
            console.log("another error happened:" + e.message);
          }
        }
      });
    return function () {
      unmounted = true;
      source.cancel("Cancelling in cleanup");
    };
  }, []);

  if (isLoading === true) {
    return <div>Chargement</div>;
  }
  if (isLoading === false) {
    return (
      <div className="container d-flex flex-column submitPost card mx-auto p-0">
        <div className="container d-flex flex-row m-0 p-4">
          <div className="col-5 m-2 submitPost__Text flex-fill">
            <form onSubmit={editPost} className="d-flex flex-column">
              <label>Titre du post</label>
              <input
                type="text"
                className="form-control my-2"
                autoComplete="off"
                maxLength="100"
                value={postEdit.title}
                onChange={(event) => {
                  setTitle(event.target.value);
                }}
              />
              {postEdit.postText !== null ? (
                <>
                  <label>Contenu du post</label>
                  <textarea
                    autoComplete="off"
                    className="form-control my-2"
                    maxLength="1000"
                    onChange={(event) => {
                      setPostText(event.target.value);
                    }}
                  />
                </>
              ) : (
                <>
                  <input
                    type="file"
                    className="form-control my-2"
                    id="formFile"
                    name="picture"
                    onChange={(e) => {
                      setPostImage(e.target.files[0]);
                    }}
                  />
                </>
              )}
              <button className="btn btn-primary">Modifier</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Edit;
