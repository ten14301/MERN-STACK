import Axios from "axios"
import React, { useState, useRef } from "react"

function CreateNewForm(props) {
  const [Username, setUsername] = useState("")
  const [Role, setRole] = useState("")
  const [file, setFile] = useState("")
  const CreatePhotoField = useRef()

  async function submitHandler(e) {
    e.preventDefault()
    const data = new FormData()
    data.append("photo", file)
    data.append("Username", Username)
    data.append("Role", Role)
    setUsername("")
    setRole("")
    setFile("")
    CreatePhotoField.current.value = ""
    const newPhoto = await Axios.post("/create-user", data, { headers: { "Content-Type": "multipart/form-data" } })
    props.setUsers(prev => prev.concat([newPhoto.data]))
  }

  return (
    <form className="p-3 bg-success bg-opacity-25 mb-5" onSubmit={submitHandler}>
      <div className="mb-2">
        <input ref={CreatePhotoField} onChange={e => setFile(e.target.files[0])} type="file" className="form-control" />
      </div>
      <div className="mb-2">
        <input onChange={e => setUsername(e.target.value)} value={name} type="text" className="form-control" placeholder="User name" />
      </div>
      <div className="mb-2">
        <input onChange={e => setRole(e.target.value)} value={species} type="text" className="form-control" placeholder="Role" />
      </div>

      <button className="btn btn-success">Create New User</button>
    </form>
  )
}

export default CreateNewForm