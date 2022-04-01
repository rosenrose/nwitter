import { authService, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons";
import "css/SocialLinks.css";

const SocialLinks = () => {
  const onSocialClick = async (event) => {
    const name = event.target.name;
    let provider;

    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }

    const data = await signInWithPopup(authService, provider);
    // console.log(data);
  };
  return (
    <div className="authBtns">
      <button name="google" onClick={onSocialClick} className="authBtn">
        Continue with Google <FontAwesomeIcon icon={faGoogle} />
      </button>
      <button name="github" onClick={onSocialClick} className="authBtn">
        Continue with Github <FontAwesomeIcon icon={faGithub} />
      </button>
    </div>
  );
};
export default SocialLinks;
