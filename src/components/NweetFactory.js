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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import "css/NweetFactory.css";

const NweetFactory = ({ user }) => {
  const [nweetText, setNweetText] = useState("");
  const [attachment, setAttachment] = useState();

  const onSubmit = async (event) => {
    event.preventDefault();

    let attachmentUrl = "";
    if (attachment) {
      const attachmentRef = ref(storageService, `${user.uid}/attachments/${uuid()}`);
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
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          type="text"
          value={nweetText}
          placeholder="What's on your mind?"
          required
          maxLength={140}
          onChange={onNweetChange}
          className="factoryInput__input"
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.avif"
        onChange={onFileChange}
        hidden={true}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img src={attachment} alt="" className="preview" />
          <div onClick={clearImage} className="factoryForm__clear">
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};
export default NweetFactory;
