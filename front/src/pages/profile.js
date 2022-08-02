import React, { useContext } from "react";
import Axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { useCookies, CookiesProvider } from "react-cookie";
import Post from "../components/post";
import EditPassword from "../components/editPassword";
import EditMail from "../components/editMail";

import FilesUploadComponent from "../components/profilePictureUpload";

function Profile() {
  let unmounted = false;
  const [Profile, setProfile] = useState([]);
  const [LikedPosts, setLikedPosts] = useState([]);

  const { id } = useParams();
  const { authState } = useContext(AuthContext);
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  const navigate = useNavigate();
  const [displayEdit, setDisplayEdit] = useState(false);

  const [displayPasswordEdit, setDisplayPasswordEdit] = useState(false);
  const [displayEmailEdit, setDisplayEmailEdit] = useState(false);

  const [displayUserPosts, setDisplayUserPosts] = useState(true);
  const [displayUserLikedPosts, setDisplayUserLikedPosts] = useState(false);

  const [isLoading, setLoading] = useState(true);

  const deleteAccount = (e) => {
    e.preventDefault();
    Axios.delete(`http://localhost:3001/auth/delete`, {
      headers: {
        accessToken: cookies.accessToken,
      },
    }).then((res) => {
      removeCookie("accessToken", { path: "/" });
      window.location.reload();
    });
  };

  const loadProfile = () => {
    let unmounted = false;

    Axios.get(`http://localhost:3001/auth/profile/${parseInt(id)}`, {
      headers: {
        accessToken: cookies.accessToken,
      },
    })
      .then((res) => {
        if (!unmounted) {
          setProfile(res.data);
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
  };

  const loadLikes = () => {
    let unmounted = false;

    Axios.get(`http://localhost:3001/auth/profile/${parseInt(id)}/likes`, {
      headers: {
        accessToken: cookies.accessToken,
      },
    })
      .then((res) => {
        setLikedPosts(res.data);
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
  };

  useEffect(() => {
    let unmounted = false;
    const controller = new AbortController();

    loadProfile();

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
      <div className="profile my-4">
        <div className={`blocker ${displayEdit ? "" : "d-none"}`}>
          <div
            className={`card edit_profile col-10 col-lg-4 position-absolute start-50 translate-middle `}
            id="edit_form"
          >
            {displayEmailEdit ? (
              <CookiesProvider>
                <EditMail />
              </CookiesProvider>
            ) : (
              ""
            )}
            {displayPasswordEdit ? (
              <CookiesProvider>
                <EditPassword />
              </CookiesProvider>
            ) : (
              ""
            )}
            <button
              className="btn btn-primary  m-2"
              onClick={() => {
                setDisplayEdit(false);
                setDisplayEmailEdit(false);
                setDisplayPasswordEdit(false);
                document.body.style.overflow = "visible";
              }}
            >
              Annuler
            </button>
          </div>
        </div>
        <div className="container-fluid d-flex flex-lg-row-reverse flex-column col-12 col-lg-10">
          <div className="card sidebar col-12 col-lg-4 p-0 mx-auto my-0">
            <div className="card-header d-flex align-items-center py-4">
              <div className="profilePicture__block  d-flex me-4">
                {Profile.id == authState.id ? (
                  <>
                    <div className="d-flex profilePicture__changebutton align-items-center justify-content-center">
                      <CookiesProvider>
                        <FilesUploadComponent />
                      </CookiesProvider>
                    </div>
                  </>
                ) : (
                  ""
                )}
                <img src={Profile.userPicture} className="profilePicture" />
              </div>
              <p className="username m-0 p-0">{Profile.username}</p>
            </div>
            <div className="card-body">
              <div className="email text-dark">{Profile.email}</div>

              {Profile.id == authState.id ? (
                <>
                  <button
                    className="btn btn-primary  m-2"
                    onClick={() => {
                      setDisplayEdit(true);
                      setDisplayEmailEdit(false);
                      setDisplayPasswordEdit(true);

                      document.body.style.overflow = "hidden";
                    }}
                  >
                    Modifier le mot de passe
                  </button>
                  <button
                    className="btn btn-primary  m-2"
                    onClick={() => {
                      setDisplayEdit(true);
                      setDisplayEmailEdit(true);
                      setDisplayPasswordEdit(false);

                      document.body.style.overflow = "hidden";
                    }}
                  >
                    Modifier l'adresse mail
                  </button>
                  <button
                    className="btn-danger m-2"
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
          </div>
          <div className="postList container-fluid  d-flex flex-column col-12 col-lg-6 mx-auto ">
            <div className=" d-flex flex-row flex-grow-0 m-0 p-0 ">
              <p
                className={`btn btn-light flex-fill border  m-0 px-0 py-2 ${
                  displayUserPosts ? "btn__active" : "btn__inactive"
                }`}
                onClick={() => {
                  loadProfile();
                  setDisplayUserPosts(true);
                  setDisplayUserLikedPosts(false);
                }}
              >
                Posts créés
              </p>
              <p
                className={`btn btn-light flex-fill border  m-0 px-0 py-2 ${
                  displayUserLikedPosts ? "btn__active" : "btn__inactive"
                }`}
                onClick={() => {
                  loadLikes();
                  setDisplayUserLikedPosts(true);
                  setDisplayUserPosts(false);
                }}
              >
                Posts likés
              </p>
            </div>
            <div className=" d-flex  flex-fill m-0 p-0 flex-column">
              {displayUserPosts ? (
                <>
                  {Profile.Posts.map((value, key) => {
                    return <Post value={value} key={key} />;
                  })}
                </>
              ) : null}
              {displayUserLikedPosts ? (
                <>
                  {LikedPosts.map((value, key) => {
                    return <Post value={value} key={key} />;
                  })}
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
