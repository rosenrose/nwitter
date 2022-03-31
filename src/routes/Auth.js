import { useState } from "react";
import {
  authService,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
} from "fbase";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewAccount, setIsNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;

    (name === "email" ? setEmail : setPassword)(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      let data;
      if (isNewAccount) {
        data = await createUserWithEmailAndPassword(authService, email, password);
      } else {
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      // console.log(data);
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
  };

  const toggleAccount = () => {
    setIsNewAccount((prev) => !prev);
  };
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
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          // value={email}
          onChange={onChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          // value={password}
          onChange={onChange}
          minLength="6"
        />
        <input type="submit" value={isNewAccount ? "Create Account" : "Log In"} />
      </form>
      <span onClick={toggleAccount}>{isNewAccount ? "Log In" : "Create Account"}</span>
      <div>
        <button name="google" onClick={onSocialClick}>
          Continue with Google
        </button>
        <button name="github" onClick={onSocialClick}>
          Continue with Github
        </button>
      </div>
    </div>
  );
};
export default Auth;
