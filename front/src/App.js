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
import "./css/bootstrap.min.css";
import "./App.css";

import Axios from "axios";

import { useCookies } from "react-cookie";
import { CookiesProvider } from "react-cookie";

import { AuthContext } from "./helpers/AuthContext";

import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import Post from "./pages/post";
import Profile from "./pages/profile";
import Submit from "./pages/submit";
import Edit from "./pages/edit";

function App() {
  const [authState, setAuthState] = React.useState({
    username: "",
    id: 0,
    status: false,
    role: false,
  });

  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);

  console.log(authState);

  console.log(authState);

  React.useEffect(() => {
    if (cookies.accessToken) {
      Axios.get("http://localhost:3001/auth/", {
        headers: {
          accessToken: cookies.accessToken,
        },
      }).then((res) => {
        if (res.data.error) {
          setAuthState({ username: "", id: 0, status: false, role: false });
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

  const logout = (e) => {
    e.preventDefault();
    console.log("Déconnexion");
    setAuthState({ username: "", id: 0, status: false, role: false });
    console.log(authState);
    console.log(cookies.accessToken);
    removeCookie("accessToken", {
      path: "/",
    });
    console.log(authState);
    console.log(cookies.accessToken);
    console.log("Déconnexion fini");
    window.location.reload(false);
  };

  function RequireAuth({ children }: { children: JSX.Element }) {
    let location = useLocation();
    console.log(cookies.accessToken);
    if (cookies.accessToken && cookies.accessToken !== "undefined") {
      Axios.get("http://localhost:3001/auth/", {
        headers: {
          accessToken: cookies.accessToken,
        },
      }).then((res) => {
        if (res.data.error) {
          setAuthState({ ...authState, status: false });
          return <Navigate to="/login" />;
        }
      });
    } else {
      console.log(authState.status);
      if (authState.status === false) {
        return <Navigate to="/login" />;
      }
    }
    console.log(children);
    return children;
  }

  return (
    <CookiesProvider>
      <div className="App">
        <AuthContext.Provider value={{ authState, setAuthState }}>
          <BrowserRouter>
            <header>
              <div className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-sm">
                  <div className="navbar-nav d-flex align-items-center">
                    <img
                      src={
                        process.env.PUBLIC_URL +
                        "/icon-left-font-monochrome-white.png"
                      }
                      className="navbar__logo navbar-brand flex-fill"
                    />
                    {!authState.status ? (
                      <>
                        <Link to="/signup" className="nav-link">
                          S'inscrire
                        </Link>
                        <Link to="/login" className="nav-link">
                          {" "}
                          Se connecter{" "}
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link to="/" className="nav-link">
                          Accueil
                        </Link>
                        <Link
                          to={`/profile/${authState.id}`}
                          className="nav-link"
                        >
                          {" "}
                          {authState.username}
                        </Link>
                        <button className="btn btn-danger" onClick={logout}>
                          Se déconnecter
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </header>
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
                path="/edit/:id"
                exact
                element={
                  <RequireAuth>
                    <Edit />
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
    </CookiesProvider>
  );
}

export default App;
