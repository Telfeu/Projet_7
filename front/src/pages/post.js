import React, { useContext } from "react";
import Axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

import PostBody from "../components/post";
import CommentBody from "../components/comment";

function PostPage() {
  const [Post, setPost] = useState({});
  const postId = useParams();
  const [commentText, setCommentText] = useState("");
  const { authState } = useContext(AuthContext);

  const [isLoading, setLoading] = useState(true);
  console.log(Post);
  console.log(postId.id);
  let navigate = useNavigate();

  useEffect(() => {
    let unmounted = false;
    let source = Axios.CancelToken.source();

    console.log("Récupération");
    Axios.get(`http://localhost:3001/posts/${postId.id}`, {
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

          setPost(res.data);
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

  const submitComment = (e) => {
    e.preventDefault();
    Axios.post(
      `http://localhost:3001/posts/${postId.id}/comments`,
      { commentBody: commentText },
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
      }
      window.location.reload(false);
    });
  };

  const deletePost = (e) => {
    Axios.delete(`http://localhost:3001/posts/${postId.id}`, {
      headers: {
        accessToken: document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          .split("=")[1],
      },
    }).then((res) => {
      console.log(res.data);
    });
    e.preventDefault();
    console.log("Post supprimé");
  };

  if (isLoading === true) {
    return <div>Chargement</div>;
  }
  if (isLoading === false) {
    return (
      <div className="postComments">
        <div className="post">
          <PostBody value={Post} />
        </div>
        <div className="submitComment">
          <form onSubmit={submitComment}>
            <label>Commenter</label>
            <input
              type="textarea"
              onChange={(event) => {
                setCommentText(event.target.value);
              }}
            />
            <button>Commenter</button>
          </form>
        </div>

        {Post.Comments ? (
          <>
            {Post.Comments.map((value, key) => {
              return (
                <div key={key} className="comment">
                  <CommentBody value={value} />
                </div>
              );
            })}
          </>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default PostPage;
