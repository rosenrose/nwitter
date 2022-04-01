import { useState } from "react";
import {
  dbService,
  collection,
  addDoc,
  storageService,
  ref,
  uploadBytes,
  uploadString,
  getDownloadURL,
} from "fbase";
import { v4 as uuid } from "uuid";

const NweetFactory = ({ user }) => {
  const [nweetText, setNweetText] = useState("");
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

  return (
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
  );
};
export default NweetFactory;
