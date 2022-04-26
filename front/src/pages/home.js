import React, { useContext } from "react";
import Axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, Redirect } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

import Post from "../components/post";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  let navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  console.log(authState);

  useEffect(() => {
    let unmounted = false;
    const controller = new AbortController();

    console.log("Récupération");
    Axios.get("http://localhost:3001/posts/", {
      headers: {
        accessToken: document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          .split("=")[1],
      },
    })
      .then((res) => {
        if (!unmounted) {
          console.log(res.data);
          setListOfPosts(res.data);
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
      controller.abort();
    };
  }, []);

  const deletePost = (e, value) => {
    console.log(value);
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

  return (
    <div className="postList">
      {listOfPosts.reverse().map((value, key) => {
        return (
          <div className="post" key={key}>
            <Post value={value} />
          </div>
        );
      })}
      <div className="submit__button">
        <Link to={`/submit`}> Créer un post</Link>
      </div>
    </div>
  );
}

export default Home;
