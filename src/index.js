import React, { useState, useEffect } from "react"
import {createRoot} from "react-dom"
import Axios from "axios"

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
        <div>
            <h1>Hello</h1>
            <p>Hey, This is from react</p>
            {users.map(function(user){
                return <AnimalCard Username={user.Username} Role={user.Role}/>
            })}
        </div>
    )
}

function AnimalCard(props){
    return <p>This is {props.Username} and I am {props.Role}</p>
}

const root = createRoot(document.querySelector('#app'))
root.render(<App />)