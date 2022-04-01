import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import "css/Navigation.css";

const Navigation = ({ user }) => (
  <nav>
    <ul className="navUl">
      <li>
        <Link to="/" className="homeLink">
          <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="2x" />
        </Link>
      </li>
      <li>
        <Link to="/profile" className="profileLink">
          <FontAwesomeIcon icon={faUser} color={"#04AAFF"} size="2x" />
          <span className="displayName">{user.displayName || user.email}'s Profile</span>
        </Link>
      </li>
    </ul>
  </nav>
);
export default Navigation;
