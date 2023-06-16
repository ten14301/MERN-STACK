  import React, { useState, useEffect } from "react"
  import { createRoot } from "react-dom"
  import Axios from "axios"
  import CreateNewForm from "./component/CreateNewForm"
  import UserCard from "./component/UserCard"
  import Popup from "./component/Popup"
  import Button from "./component/ฺButton"
  import Slidebar from "./component/Slidebar.js"
  import Navbar from "./component/Navbar"
  import { faUser,faUsers } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

  function App() {
    const [users, setUsers] = useState([])
    const [buttonPopup, setButtonPopup] = useState(false)

    useEffect(() => {
      async function fetchData() {
        const response = await Axios.get("/api/users")
        setUsers(response.data)
      }
      fetchData()
    }, [])

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
            <i><FontAwesomeIcon icon={faUser} /></i>
            <div>
            <h3>22,2222</h3>
            <span>Users</span>
            </div>

          </div>
          <div className="val-box">
            <i><FontAwesomeIcon icon={faUsers} /></i>
            <div>
            <h3>22,2222</h3>
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
              )
            })}
          </div>
        </div>
      </div>

    )
  }

  const root = createRoot(document.querySelector("#app"))
  root.render(<App />)
