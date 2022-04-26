import React, { useContext } from "react";
import Axios from "axios";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from "react-router-dom";

function Submit() {
  const [postText, setPostText] = useState("");
  const [title, setTitle] = useState("");
  let navigate = useNavigate();
  let location = useLocation();

  const submitPost = (e) => {
    console.log("Post posté");
    Axios.post(
      `http://localhost:3001/posts`,
      { title: title, postText: postText },
      {
        headers: {
          accessToken: document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            .split("=")[1],
        },
      }
    ).then((res) => {
      if (res.data.error) {
        console.log(res.data.error);
        <Navigate to="/" state={{ from: location }} replace />;
      }
    });
  };

  return (
    <div className="postComments">
      <div className="submitPost">
        <form onSubmit={submitPost}>
          <label>Créer un post</label>
          <input
            type="text"
            autoComplete="off"
            maxLength="100"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
          <textarea
            autoComplete="off"
            maxLength="1000"
            onChange={(event) => {
              setPostText(event.target.value);
            }}
          />
          <button>Poster</button>
        </form>
      </div>
    </div>
  );
}

export default Submit;
