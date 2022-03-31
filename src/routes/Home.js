import { useState, useEffect } from "react";
import { dbService, collection, addDoc, getDocs, onSnapshot } from "fbase";
import Nweet from "components/Nweet";

const Home = ({ user }) => {
  // console.log(user);
  const [nweet, setNweet] = useState("");
  const [nweetList, setNweetList] = useState([]);
  const [attachment, setAttachment] = useState();

  const onSubmit = async (event) => {
    event.preventDefault();

    await addDoc(collection(dbService, "nweets"), {
      text: nweet,
      createdAt: Date.now(),
      creatorId: user.uid,
    });
    setNweet("");
  };
  const onNweetChange = (event) => {
    setNweet(event.target.value);
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // const reader = new FileReader();
      // reader.addEventListener("load", (event) => {
      //   console.log(event);
      //   setAttachment(reader.result);
      // });
      // reader.readAsDataURL(file);
      setAttachment(URL.createObjectURL(file));
    }
  };
  const clearImage = () => {
    URL.revokeObjectURL(attachment);
    setAttachment("");
  };

  useEffect(() => {
    onSnapshot(collection(dbService, "nweets"), async (snapshot) => {
      // console.log(snapshot);
      setNweetList(snapshot.docs.map((doc) => ({ ...doc.data(), docId: doc.id })));
      // console.log(nweetList);
    });
  }, []);
  // const nweets = await getDocs(collection(dbService, "nweets"));
  // setNweetList(
  //   nweets.docs.map((doc) => ({ ...doc.data(), docId: doc.id }))
  // );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={nweet}
          placeholder="What's on your mind?"
          maxLength={140}
          onChange={onNweetChange}
        />
        <input type="file" accept=".jpg,.jpeg,.png,.webp,.avif" onChange={onFileChange} />
        {attachment && (
          <div>
            <img src={attachment} alt="" />
            <button onClick={clearImage}>Clear</button>
          </div>
        )}
        <input type="submit" value="Nweet" />
      </form>
      <ul>
        {nweetList.map((nweet) => (
          <Nweet key={nweet.docId} nweet={nweet} isOwner={user.uid === nweet.creatorId} />
        ))}
      </ul>
      <style jsx="true">
        {`
          img {
            width: 3rem;
            height: 3rem;
          }
        `}
      </style>
    </div>
  );
};
export default Home;
