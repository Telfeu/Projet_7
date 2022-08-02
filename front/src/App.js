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
import { Navbar, Nav, Button, NavDropdown } from "react-bootstrap";
import "./App.css";

import Axios from "axios";

import { useCookies } from "react-cookie";
import { CookiesProvider } from "react-cookie";

import { AuthContext } from "./helpers/AuthContext";

import Auth from "./pages/auth";
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

    setAuthState({ username: "", id: 0, status: false, role: false });

    removeCookie("accessToken", {
      path: "/",
    });

    window.location.reload(false);
  };

  function RequireAuth({ children }: { children: JSX.Element }) {
    let location = useLocation();

    if (cookies.accessToken && cookies.accessToken !== "undefined") {
      Axios.get("http://localhost:3001/auth/", {
        headers: {
          accessToken: cookies.accessToken,
        },
      }).then((res) => {
        if (res.data.error) {
          setAuthState({ ...authState, status: false });
          return <Navigate to="/auth" />;
        }
      });
    } else {
      if (authState.status === false) {
        return <Navigate to="/auth" />;
      }
    }

    return children;
  }

  return (
    <CookiesProvider>
      <div className="App">
        <AuthContext.Provider value={{ authState, setAuthState }}>
          <BrowserRouter>
            <header>
              <Navbar
                collapseOnSelect
                expand="lg"
                bg="dark"
                variant="dark"
                className="px-2"
              >
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <div className="navbar__logo navbar-brand"></div>
                <Navbar.Collapse id="responsive-navbar-nav ">
                  <Nav className="mr-auto d-flex align-items-center text-center">
                    {!authState.status ? (
                      <></>
                    ) : (
                      <>
                        <Link to="/" className="nav-item nav-link m-2">
                          Accueil
                        </Link>
                        <Link
                          to={`/profile/${authState.id}`}
                          className="nav-item nav-link m-2"
                        >
                          {" "}
                          {authState.username}
                        </Link>
                        <NavDropdown.Item className="px-0">
                          <button
                            className="btn btn-danger nav-item"
                            onClick={logout}
                          >
                            Se déconnecter
                          </button>
                        </NavDropdown.Item>
                      </>
                    )}
                  </Nav>
                </Navbar.Collapse>
              </Navbar>
            </header>
            <Routes>
              <Route path="/auth" exact element={<Auth />} />
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
