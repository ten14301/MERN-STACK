import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function Search() {
  const [searchResult, setSearchResult] = useState([]);
  const [key, setKey] = useState("");

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
        console.log(res);
        setSearchResult(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    search();
  }, [key]);

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
              </div>
            </div>
          ))}
        </div>
      )}
    </form>
  );
}
