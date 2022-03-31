import { useState, useEffect } from "react";
import { dbService, collection, addDoc, getDocs, onSnapshot } from "fbase";
import Nweet from "components/Nweet";

const Home = ({ userObj }) => {
  // console.log(userObj);
  const [nweet, setNweet] = useState("");
  const [nweetList, setNweetList] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();

    await addDoc(collection(dbService, "nweets"), {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setNweet("");
  };
  const onChange = (event) => {
    setNweet(event.target.value);
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
          onChange={onChange}
        />
        <input type="submit" value="Nweet" />
      </form>
      <ul>
        {nweetList.map((nweet) => (
          <Nweet key={nweet.docId} nweet={nweet} isOwner={userObj.uid === nweet.creatorId} />
        ))}
      </ul>
    </div>
  );
};
export default Home;
