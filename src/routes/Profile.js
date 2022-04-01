import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  authService,
  updateProfile,
  dbService,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "fbase";
import Nweet from "components/Nweet";

const Profile = ({ user, refreshUser }) => {
  // console.log(user);
  const [myNweets, setMyNweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(user.displayName || "");

  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const getMyNweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    // console.log(q);
    const snapshot = await getDocs(q);
    // console.log(snapshot);

    setMyNweets(snapshot.docs.map((doc) => ({ ...doc.data(), docId: doc.id })));
  };
  // console.log(myNweets);
  const onChange = (event) => {
    setNewDisplayName(event.target.value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (newDisplayName === user.displayName) {
      return;
    }

    await updateProfile(authService.currentUser, { displayName: newDisplayName });
    refreshUser();
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Display name" value={newDisplayName} onChange={onChange} />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
      <ul>
        {myNweets.map((nweet) => (
          <Nweet key={nweet.docId} nweet={nweet} isOwner={true} />
        ))}
      </ul>
    </>
  );
};
export default Profile;
