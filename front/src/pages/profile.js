import React, { useContext } from "react";
import Axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { useCookies } from "react-cookie";

import Post from "../components/post";

import FilesUploadComponent from "../components/profilePictureUpload";

function Profile() {
  let unmounted = false;
  const [Profile, setProfile] = useState([]);
  const profileId = useParams();
  const { id } = useParams();
  const { authState } = useContext(AuthContext);
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(true);

  const deleteAccount = (e) => {
    e.preventDefault();
    Axios.delete(`http://localhost:3001/auth/delete`, {
      headers: {
        accessToken: cookies.accessToken,
      },
    }).then((res) => {
      console.log(res.data);
      removeCookie("accessToken", { path: "/" });
      window.location.reload();
    });
  };

  useEffect(() => {
    let unmounted = false;
    const controller = new AbortController();
    console.log("Récupération");
    Axios.get(`http://localhost:3001/auth/profile/${parseInt(id)}`, {
      headers: {
        accessToken: cookies.accessToken,
      },
    })
      .then((res) => {
        if (!unmounted) {
          console.log(res.data);
          setProfile(res.data);
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
      controller.abort();
    };
  }, []);

  if (isLoading === true) {
    return <div>Chargement</div>;
  }
  if (isLoading === false) {
    return (
      <div className="profile container-sm d-flex flex-row-reverse">
        <div className="sidebar col-sm-4 my-4">
          <img src={Profile.userPicture} className="pfp img-thumbnail my-2" />
          {Profile.id == authState.id ? (
            <>
              <FilesUploadComponent />
            </>
          ) : (
            ""
          )}
          <div className="username">{Profile.username}</div>
          <div className="email">{Profile.email}</div>

          {Profile.id == authState.id ? (
            <>
              <button
                className="btn-danger"
                onClick={(e) => {
                  if (
                    window.confirm(
                      "Voulez vous vraiment supprimer votre compte ?"
                    )
                  )
                    deleteAccount(e);
                }}
              >
                Supprimer son compte
              </button>
            </>
          ) : (
            ""
          )}
        </div>

        <div className="postList col-sm-6 m-auto">
          {Profile.Posts.map((value, key) => {
            return <Post value={value} key={key} />;
          })}
        </div>
      </div>
    );
  }
}

export default Profile;
