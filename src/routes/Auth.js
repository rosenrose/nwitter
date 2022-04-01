import AuthForm from "components/AuthForm";
import SocialLinks from "components/SocialLinks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import "css/Auth.css";

const Auth = () => {
  return (
    <div className="authContainer">
      <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="3x" style={{ marginBottom: 30 }} />
      <AuthForm />
      <SocialLinks />
    </div>
  );
};
export default Auth;
