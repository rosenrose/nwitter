import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

const AppRouter = ({ isLoggedIn }) => (
  <Router>
    {isLoggedIn && <Navigation />}
    <Routes>
      {isLoggedIn ? (
        <>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/profile" element={<Profile />} />
        </>
      ) : (
        <Route exact path="/" element={<Auth />} />
      )}
      <Route path="/*" element={<Navigate to="/" replace={true} />} />
    </Routes>
  </Router>
);
export default AppRouter;
