import React, { useContext } from "react";
import Axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";

import { useCookies } from "react-cookie";

import Post from "../components/post";

function Home() {
  library.add(fab, faCirclePlus);
  const [listOfPosts, setListOfPosts] = useState([]);

  const [cookies] = useCookies(["accessToken"]);

  useEffect(() => {
    let unmounted = false;
    const controller = new AbortController();

    Axios.get("http://localhost:3001/posts/", {
      headers: {
        accessToken: cookies.accessToken,
      },
    })
      .then((res) => {
        if (!unmounted) {
          setListOfPosts(res.data);
        }
      })
      .catch(function (e) {
        if (!unmounted) {
          if (Axios.isCancel(e)) {
            window.alert("Recharger la page");
          } else {
            window.alert("Une erreur est survenue, rechargez la page");
          }
        }
      });

    return function () {
      unmounted = true;
      controller.abort();
    };
  }, []);
  return (
    <div className="container-sm  postList d-flex flex-column align-items-center">
      <div className="postList  col-12 col-lg-10 m-auto">
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
