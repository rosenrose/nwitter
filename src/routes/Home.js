import { useState, useEffect } from "react";
import {
  dbService,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  storageService,
  ref,
  uploadBytes,
  uploadString,
  getDownloadURL,
} from "fbase";
import Nweet from "components/Nweet";
import { v4 as uuid } from "uuid";

const Home = ({ user }) => {
  // console.log(user);
  const [nweetText, setNweetText] = useState("");
  const [nweetList, setNweetList] = useState([]);
  const [attachment, setAttachment] = useState();

  const onSubmit = async (event) => {
    event.preventDefault();

    let attachmentUrl = "";
    if (attachment) {
      const attachmentRef = ref(storageService, `${user.uid}/${uuid()}`);
      // console.log(attachmentRef);

      // const response = await uploadString(attachmentRef, attachment, "data_url");
      const response = await uploadBytes(attachmentRef, await (await fetch(attachment)).blob());
      // console.log(response);

      attachmentUrl = await getDownloadURL(response.ref);
      // console.log(attachmentUrl);
      setAttachment(null);
    }

    await addDoc(collection(dbService, "nweets"), {
      text: nweetText,
      createdAt: Date.now(),
      creatorId: user.uid,
      attachmentUrl,
    });
    setNweetText("");
  };
  const onNweetChange = (event) => {
    setNweetText(event.target.value);
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    // console.log(file);

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
    setAttachment(null);
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
          value={nweetText}
          placeholder="What's on your mind?"
          maxLength={140}
          onChange={onNweetChange}
        />
        <input type="file" accept=".jpg,.jpeg,.png,.webp,.avif" onChange={onFileChange} />
        {attachment && (
          <div>
            <img src={attachment} alt="" id="preview" />
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
    </div>
  );
};
export default Home;
