import React, { useState, useEffect } from "react"
import {createRoot} from "react-dom"
import Axios from "axios"
import CreateNewForm from "./component/CreateNewForm"
import UserCard from "./component/UserCard"

function App(){
    const [users, setUsers] = useState([])

    useEffect(() => {
        async function go(){
            const response = await Axios.get("/api/users")
            setUsers(response.data)
        }
        go()
    }, [])
    return(
        <div className="container">
            <p><a href="/">&laquo; Back to public homepage</a></p>
            <CreateNewForm setUsers={setUsers}/>
            <div className="user-grid">
            {users.map(function(user){
                return <UserCard key={user._id} Username={user.Username} Role={user.Role} photo={user.photo} id={user._id} setUsers={setUsers}/>
            })}
            </div>
        </div>
    )
}


const root = createRoot(document.querySelector('#app'))
root.render(<App />)