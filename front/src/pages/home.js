import React, { useContext } from "react";
import Axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../helpers/AuthContext";

import { useCookies } from "react-cookie";

import Post from "../components/post";

function Home() {
  library.add(fab, faCirclePlus);
  const [listOfPosts, setListOfPosts] = useState([]);
  let navigate = useNavigate();
  const { authState } = useContext(AuthContext);
  console.log(authState);
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

  useEffect(() => {
    let unmounted = false;
    const controller = new AbortController();

    console.log("Récupération");
    Axios.get("http://localhost:3001/posts/", {
      headers: {
        accessToken: cookies.accessToken,
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
        accessToken: cookies.accessToken,
      },
    }).then((res) => {
      console.log(res.data);
      window.location.reload(false);
    });
  };

  return (
    <div className="container-sm  postList d-flex flex-column align-items-center">
      <div className="postList col-sm-10 m-auto">
        {listOfPosts.map((value, key) => {
          return <Post value={value} key={key} />;
        })}
        <div className="submit">
          <Link to={`/submit`}>
            {" "}
            <FontAwesomeIcon icon={faCirclePlus} className="submit__button" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
