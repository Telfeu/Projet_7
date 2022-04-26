import * as React from "react";
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
import "./App.css";
import Axios from "axios";

import { AuthContext } from "./helpers/AuthContext";

import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Post from "./pages/post";
import Profile from "./pages/profile";
import Submit from "./pages/submit";

function App() {
  const [authState, setAuthState] = React.useState({
    username: "",
    id: 0,
    status: false,
    role: false,
  });

  console.log(authState);

  React.useEffect(() => {
    if (document.cookie) {
      Axios.get("http://localhost:3001/auth/", {
        headers: {
          accessToken: document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            .split("=")[1],
        },
      }).then((res) => {
        if (res.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          console.log(res.data);
          setAuthState({
            username: res.data.username,
            id: res.data.id,
            status: true,
            role: res.data.role,
          });
        }
      });
    }
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    console.log("Déconnexion");
    setAuthState({ ...authState, status: false });
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.reload(false);
  };

  function RequireAuth({ children }: { children: JSX.Element }) {
    let location = useLocation();
    if (document.cookie) {
      Axios.get("http://localhost:3001/auth/", {
        headers: {
          accessToken: document.cookie
            .split("; ")
            .find((row) => row.startsWith("accessToken="))
            .split("=")[1],
        },
      }).then((res) => {
        if (res.data.error) {
          setAuthState({ ...authState, status: false });
          return <Navigate to="/login" state={{ from: location }} replace />;
        }
      });
    } else {
      console.log(authState.status);
      if (authState.status === false) {
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
    }
    console.log(children);
    return children;
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <BrowserRouter>
          <div className="navbar">
            <div className="links">
              {!authState.status ? (
                <>
                  <Link to="/signup">S'inscrire</Link>
                  <Link to="/login"> Se connecter </Link>
                </>
              ) : (
                <>
                  <Link to="/">Accueil</Link>
                  <Link to={`/profile/${authState.id}`}> Profil</Link>
                  <button onClick={logout}>Logout</button>
                </>
              )}
            </div>
            <div className="profileContainer">
              <h1>{authState.username}</h1>
            </div>
          </div>
          <Routes>
            <Route path="/login" exact element={<Login />} />
            <Route path="/signup" exact element={<Signup />} />
            <Route
              path="/"
              exact
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="/post/:id"
              exact
              element={
                <RequireAuth>
                  <Post />
                </RequireAuth>
              }
            />
            <Route
              path="/submit"
              exact
              element={
                <RequireAuth>
                  <Submit />
                </RequireAuth>
              }
            />
            <Route
              path="/profile/:id"
              exact
              element={
                <RequireAuth>
                  <Profile />
                </RequireAuth>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
