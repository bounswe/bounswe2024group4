import React from "react";
import SignUp from "../pages/SignUp.js";
import SignIn from "../pages/SignIn.js";
import ErrorPage from "../pages/GeneralError.js";
import SignUpPrompt from "../pages/SignUpPrompt.js";
import Feed from "../pages/Feed.js";
import Team from "../pages/Team.js";
import Player from "../pages/Player.js";
import Profile from "../pages/Profile.js";
import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import { Provider } from "../globalContext/globalContext.js";
import { isAuthorized } from "../components/Auth.js";
import CreatePost from "../pages/CreatePost.js";
import SearchResult from "../pages/SearchResult.js";
import Bookmarks from "../pages/Bookmarks.js";
import PostFocus from "../pages/PostFocus.js";

function Router() {
  const PrivateRoutes = () => {
    console.log(isAuthorized());
    return isAuthorized() ? <Outlet /> : <Navigate to="/sign-in" />;
  };

  return (
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Feed />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
          </Route>
          <Route path="/team/:id" element={<Team />} />
          <Route path="/player/:id" element={<Player />} />
          <Route path="/user/:username" element={<Profile />} />
          <Route path="/post/:id" element={<PostFocus />} />
          <Route path="/search/:query" element={<SearchResult />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-up-prompt" element={<SignUpPrompt />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default Router;
