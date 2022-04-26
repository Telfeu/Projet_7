import React, { useContext } from "react";
import Axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

import Post from "../components/post";

import FilesUploadComponent from "../components/fileUpload";

function Profile() {
  const [Profile, setProfile] = useState([]);
  const profileId = useParams();
  const { authState } = useContext(AuthContext);

  const [isLoading, setLoading] = useState(true);

  console.log(profileId.id);
  console.log(authState.id);

  useEffect(() => {
    let unmounted = false;
    const controller = new AbortController();
    console.log("Récupération");
    Axios.get(`http://localhost:3001/auth/profile/${profileId.id}`, {
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
      <div className="profile">
        <div className="profilepicture">
          <img src={Profile.userPicture} />
        </div>
        {profileId.id == authState.id ? (
          <>
            <FilesUploadComponent />
          </>
        ) : (
          ""
        )}
        <div className="username">{Profile.username}</div>
        <div className="email">{Profile.email}</div>

        <div className="postList">
          {Profile.Posts.reverse().map((value, key) => {
            return (
              <div className="post" key={key}>
                <Post value={value} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Profile;
