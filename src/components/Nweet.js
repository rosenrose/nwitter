import { useState } from "react";
import { dbService, doc, deleteDoc, updateDoc } from "fbase";

const Nweet = ({ nweet, isOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(nweet.text);

  const deleteNweet = () => {
    if (window.confirm("Sure to delete?")) {
      deleteDoc(doc(dbService, "nweets", nweet.docId));
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
    <li>
      {isEditing ? (
        <>
          <form onSubmit={updateNweet}>
            <input type="text" value={newText} required onChange={editNweet} />
            <input type="submit" value="Update" />
          </form>
          <button onClick={toggleEditing}>Canel</button>
        </>
      ) : (
        <>
          <h4>{nweet.text}</h4>
          {isOwner && (
            <>
              <button onClick={deleteNweet}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </li>
  );
};
export default Nweet;
