import { useState, useEffect } from "react";
import { dbService, collection, addDoc, getDocs } from "fbase";
import { doc } from "firebase/firestore";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweetList, setNweetList] = useState([]);

  const onSubmit = async (event) => {
    event.preventDefault();

    await addDoc(collection(dbService, "nweets"), {
      nweet,
      createdAt: Date.now(),
    });
    setNweet("");
  };
  const onChange = (event) => {
    setNweet(event.target.value);
  };

  useEffect(() => {
    (async () => {
      const nweets = await getDocs(collection(dbService, "nweets"));
      setNweetList(
        [...nweets.docs].map((doc) => {
          return { ...doc.data(), id: doc.id };
        })
      );
    })();
  }, []);
  console.log(nweetList);

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
          <li key={nweet.id}>
            <h4>{nweet.nweet}</h4>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Home;
