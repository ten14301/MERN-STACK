import React, { useState, useEffect } from "react"
import { createRoot } from "react-dom"
import Axios from "axios"
import CreateNewForm from "./component/CreateNewForm"
import UserCard from "./component/UserCard"
import Popup from "./component/Popup"
import Button from "./component/ฺButton"
import Navbar from "./component/Navbar"

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
      <Navbar />
      <div className="content">
        <Button className="btn" onClick={() => setButtonPopup(true)}>
          +
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
