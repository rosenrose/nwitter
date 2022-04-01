import { useState } from "react";
import { authService, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "fbase";

const AuthForm = () => {
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

  return (
    <>
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
    </>
  );
};
export default AuthForm;
