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
  storageService,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "fbase";
import Nweet from "components/Nweet";
import "css/Profile.css";
import "css/Home.css";
import "css/NweetFactory.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes, faMinus } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";

const Profile = ({ user, refreshUser }) => {
  // console.log(user);
  const [myNweets, setMyNweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState(user.displayName || "");
  const [attachment, setAttachment] = useState();

  const navigate = useNavigate();
  const onLogOutClick = async () => {
    await authService.signOut();
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
  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAttachment(URL.createObjectURL(file));
    }
  };
  const clearImage = () => {
    URL.revokeObjectURL(attachment);
    setAttachment(null);
  };
  const onSubmit = async (event) => {
    event.preventDefault();

    if (newDisplayName !== user.displayName) {
      await updateProfile(authService.currentUser, { displayName: newDisplayName });
    }

    if (attachment) {
      const attachmentRef = ref(storageService, `${user.uid}/profile_photo/${uuid()}`);
      const response = await uploadBytes(attachmentRef, await (await fetch(attachment)).blob());
      const attachmentUrl = await getDownloadURL(response.ref);

      if (user.photoURL) {
        await deleteObject(ref(storageService, user.photoURL));
      }
      await updateProfile(authService.currentUser, { photoURL: attachmentUrl });
      setAttachment(null);
    }

    refreshUser();
  };
  const deleteProfilePhoto = async () => {
    try {
      await deleteObject(ref(storageService, user.photoURL));
    } catch (e) {
      console.log(e);
    } finally {
      await updateProfile(authService.currentUser, { photoURL: "" });
    }
    refreshUser();
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          placeholder="Display name"
          value={newDisplayName}
          onChange={onChange}
          autoFocus
          className="formInput"
        />
        <label htmlFor="attach-file" className="factoryInput__label">
          <span>{user.photoURL ? "Change" : "Add"} Profile Photo</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          id="attach-file"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.avif"
          onChange={onFileChange}
          hidden={true}
        />
        {user.photoURL && (
          <label className="factoryInput__label" onClick={deleteProfilePhoto}>
            <span>Delete Profile Photo</span>
            <FontAwesomeIcon icon={faMinus} />
          </label>
        )}
        {attachment && (
          <div className="factoryForm__attachment">
            <img src={attachment} alt="" className="preview" />
            <div onClick={clearImage} className="factoryForm__clear">
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
        <input type="submit" value="Update Profile" className="formBtn displayNameSubmit" />
      </form>
      <span onClick={onLogOutClick} className="formBtn cancelBtn logOut">
        Log Out
      </span>
      <h5>My Nweets</h5>
      <ul className="nweetUl">
        {myNweets.map((nweet) => (
          <Nweet key={nweet.docId} nweet={nweet} isOwner={true} />
        ))}
      </ul>
    </div>
  );
};
export default Profile;
