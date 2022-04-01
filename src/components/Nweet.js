import { useState } from "react";
import { dbService, doc, deleteDoc, updateDoc, storageService, ref, deleteObject } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import "css/Nweet.css";

const Nweet = ({ nweet, isOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(nweet.text);

  const deleteNweet = () => {
    if (window.confirm("Sure to delete?")) {
      deleteDoc(doc(dbService, "nweets", nweet.docId));

      if (nweet.attachmentUrl) {
        deleteObject(ref(storageService, nweet.attachmentUrl));
      }
    }
  };
  const toggleEditing = () => {
    setIsEditing((prev) => !prev);
  };
  const editNweet = (event) => {
    setNewText(event.target.value);
  };
  const updateNweet = async (event) => {
    event.preventDefault();

    await updateDoc(doc(dbService, "nweets", nweet.docId), {
      text: newText,
    });
    setIsEditing(false);
  };

  return (
    <li className="nweet">
      {isEditing && isOwner ? (
        <>
          <form onSubmit={updateNweet} className="container nweetEdit">
            <input
              type="text"
              value={newText}
              required
              autoFocus
              onChange={editNweet}
              className="formInput"
            />
            <input type="submit" value="Update" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            Canel
          </span>
        </>
      ) : (
        <>
          <h4>{nweet.text}</h4>
          {nweet.attachmentUrl && <img src={nweet.attachmentUrl} alt="" className="attachment" />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={deleteNweet}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </li>
  );
};
export default Nweet;
