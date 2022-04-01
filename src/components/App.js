import { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
  const [isInit, setIsInit] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      // console.log(user);
      if (user) {
        setUser({
          displayName: user.displayName,
          photoURL: user.photoURL,
          uid: user.uid,
        });
      } else {
        setUser(null);
      }
      setIsInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    setUser({
      displayName: user.displayName,
      photoURL: user.photoURL,
      uid: user.uid,
    });
  };

  return (
    <>
      {isInit ? <AppRouter user={user} refreshUser={refreshUser} /> : "Initializing..."}
      <footer>&copy; Nwitter {new Date().getFullYear()}</footer>
      <style jsx="true">
        {`
          img#preview {
            width: 3rem;
            height: 3rem;
          }
          img.attachment {
            width: 4rem;
            height: 4rem;
          }
        `}
      </style>
    </>
  );
}

export default App;
