import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import EditUser from "./EditUser";

export default function Search() {
  const [searchResult, setSearchResult] = useState([]);
  const [key, setKey] = useState("");
  const [editingUserId, setEditingUserId] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const search = async () => {
      try {
        if (!key.trim()) {
          setSearchResult([]);
          return;
        }
        const res = await axios.get("http://localhost:3000/api/users", {
          params: { key: key, limit: 5 },
        });
        setSearchResult(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    search();
  }, [key]);

  const handleEdit = (userId) => {
    setEditingUserId(userId);
    setShowPopup(true);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/user/${userId}`);
      setSearchResult((prevResult) => prevResult.filter((user) => user._id !== userId));
    } catch (err) {
      console.log(err);
    }
  };

  const closePopup = () => {
    setEditingUserId("");
    setShowPopup(false);
  };

  return (
    <form>
      <div className="s">
        <i className="manify">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </i>
        <input
          type="text"
          placeholder="...search"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </div>
      {searchResult && searchResult.length > 0 && (
        <div className="search-result">
          {searchResult.map((user) => (
            <div className="result-item" key={user._id}>
              <div className="user-info">
                <p className="name">{user.Username}</p>
                {!editingUserId || editingUserId !== user._id ? (
                  <>
                    <button onClick={() => handleEdit(user._id)}>Edit</button>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                  </>
                ) : (
                  <>
                    <button disabled>Edit</button>
                    <button disabled>Delete</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {showPopup && (
        <EditUser
          id={editingUserId}
          setUsers={setSearchResult}
          setIsEditing={setShowPopup}
        />
      )}
    </form>
  );
}
