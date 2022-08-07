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
  const [newtitle, setNewTitle] = useState("");
  const [newpostText, setNewPostText] = useState("");
  const [newpostImage, setNewPostImage] = useState();

  const editPost = (e) => {
    e.preventDefault();
    if (newpostText) {
      Axios.put(
        `http://localhost:3001/posts/${postId.id}`,
        { title: newtitle, postText: newpostText },
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
    }
    if (!newpostText) {
      console.log(newtitle);
      const formData = new FormData();
      formData.append("postPicture", newpostImage);
      formData.append("title", newtitle);

      Axios.put(`http://localhost:3001/posts/${postId.id}`, formData, {
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
    }
  };

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();

    Axios.get(`http://localhost:3001/posts/${postId.id}`, {
      headers: {
        accessToken: cookies.accessToken,
      },
    })
      .then((res) => {
        if (!unmounted) {
          setPostEdit(res.data);
          if (postEdit.postText) {
            setNewPostText(postEdit.postText);
          }

          setLoading(false);
        }
      })
      .catch(function (e) {
        if (!unmounted) {
          if (Axios.isCancel(e)) {
            window.alert("Rechargez la page");
          } else {
            window.alert("Rechargez la page");
          }
        }
      });
    return function () {
      unmounted = true;
      source.cancel("Cancelling in cleanup");
    };
  }, []);

  useEffect(() => {
    setNewTitle(postEdit.title);
    console.log(postEdit.title);
  }, [postEdit]);

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
                defaultValue={postEdit.title}
                onChange={(event) => {
                  setNewTitle(event.target.value);
                }}
              />
              {postEdit.postText !== null ? (
                <>
                  <label>Contenu du post</label>
                  <textarea
                    autoComplete="off"
                    className="form-control my-2"
                    maxLength="1000"
                    required
                    defaultValue={postEdit.postText}
                    onChange={(event) => {
                      setNewPostText(event.target.value);
                    }}
                  />
                </>
              ) : (
                <>
                  <img src={postEdit.postPicture} className="post__Picture" />
                  <input
                    type="file"
                    className="form-control my-2"
                    id="formFile"
                    name="picture"
                    onChange={(e) => {
                      setNewPostImage(e.target.files[0]);
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
