import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

const Router = ({ user, refreshUser }) => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    {user && <Navigation user={user} />}
    <Routes>
      {user ? (
        <>
          <Route exact path="/" element={<Home user={user} />} />
          <Route
            exact
            path="/profile"
            element={<Profile user={user} refreshUser={refreshUser} />}
          />
        </>
      ) : (
        <Route exact path="/" element={<Auth />} />
      )}
      <Route path="/*" element={<Navigate to="/" replace={true} />} />
    </Routes>
  </BrowserRouter>
);
export default Router;
