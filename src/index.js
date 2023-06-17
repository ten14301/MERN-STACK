import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom";
import Axios from "axios";
import CreateNewForm from "./component/CreateNewForm";
import UserCard from "./component/UserCard";
import Popup from "./component/Popup";
import Button from "./component/ฺButton";
import Slidebar from "./component/Slidebar.js";
import Navbar from "./component/Navbar";
import { faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function App() {
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [buttonPopup, setButtonPopup] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await Axios.get("/api/users");
      setUsers(response.data);
      setUserCount(response.data.length); // Set user count
      setTeamCount(getTeamCount(response.data)); // Set team count
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getTeamCount = (data) => {
    // Count unique teams from the data array
    const teams = new Set(data.map((user) => user.Team));
    return teams.size;
  };

  return (
    <div className="app">
      <Slidebar />
      <div className="nav">
        <Navbar />
      </div>

      <div className="content">
        <h3 className="toppic">Manage User</h3>
        <div className="values">
          <div className="val-box">
            <i>
              <FontAwesomeIcon icon={faUser} />
            </i>
            <div>
              <h3>{userCount}</h3> {/* Display user count */}
              <span>Users</span>
            </div>
          </div>
          <div className="val-box">
            <i>
              <FontAwesomeIcon icon={faUsers} />
            </i>
            <div>
              <h3>{teamCount}</h3> {/* Display team count */}
              <span>Team</span>
            </div>
          </div>
        </div>
        <Button className="btn" onClick={() => setButtonPopup(true)}>
          + ADD NEW USER
        </Button>
        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <CreateNewForm setUsers={setUsers} />
        </Popup>

        <div className="user-grid">
          {users.map(function (user) {
            return (
              <UserCard
                key={user._id}
                Username={user.Username}
                Role={user.Role}
                Pass={user.Pass}
                Team={user.Team}
                photo={user.photo}
                id={user._id}
                setUsers={setUsers}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

const root = createRoot(document.querySelector("#app"));
root.render(<App />);
