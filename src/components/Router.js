import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

const AppRouter = ({ user }) => (
  <Router>
    {user && <Navigation />}
    <Routes>
      {user ? (
        <>
          <Route exact path="/" element={<Home user={user} />} />
          <Route exact path="/profile" element={<Profile user={user} />} />
        </>
      ) : (
        <Route exact path="/" element={<Auth />} />
      )}
      <Route path="/*" element={<Navigate to="/" replace={true} />} />
    </Routes>
  </Router>
);
export default AppRouter;
