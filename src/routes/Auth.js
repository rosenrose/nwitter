import { useState } from "react";
import { authService, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "fbase";
import AuthForm from "components/AuthForm";

const Auth = () => {
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
      <AuthForm />
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
