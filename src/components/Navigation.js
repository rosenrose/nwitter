import { Link } from "react-router-dom";

const Navigation = ({ user }) => (
  <nav>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/profile">{user.displayName || user.email}'s Profile</Link>
      </li>
    </ul>
  </nav>
);
export default Navigation;
