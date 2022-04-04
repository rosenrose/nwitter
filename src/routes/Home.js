import { useState, useEffect } from "react";
import { dbService, collection, onSnapshot } from "fbase";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import "css/Home.css";

const Home = ({ user }) => {
  // console.log(user);
  const [nweetList, setNweetList] = useState([]);

  useEffect(() => {
    onSnapshot(collection(dbService, "nweets"), (snapshot) => {
      setNweetList(
        snapshot.docs
          .map((doc) => ({ ...doc.data(), docId: doc.id }))
          .sort((a, b) => b.createdAt - a.createdAt)
      );
      // console.log(nweetList);
    });
  }, []);
  // const nweets = await getDocs(collection(dbService, "nweets"));
  // setNweetList(
  //   nweets.docs.map((doc) => ({ ...doc.data(), docId: doc.id }))
  // );

  return (
    <div className="container">
      <NweetFactory user={user} />
      <ul className="nweetUl">
        {nweetList.map((nweet) => (
          <Nweet key={nweet.docId} nweet={nweet} isOwner={user.uid === nweet.creatorId} />
        ))}
      </ul>
    </div>
  );
};
export default Home;
