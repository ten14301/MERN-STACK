import React, { useState } from "react"
import Axios from "axios"

function UserCard(props) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftUsername, setDraftUsername] = useState("")
  const [file, setFile] = useState()
  const [draftRole, setDraftRole] = useState("")
  const [draftPass, setDraftPass] = useState(props.Pass || "")

  async function submitHandler(e) {
    e.preventDefault()
    setIsEditing(false)
    props.setUsers(prev =>
      prev.map(function (user) {
        if (user._id === props.id) {
          return { ...user, Username: draftUsername, Role: draftRole, Pass: draftPass }
        }
        return user
      })
    )
    const data = new FormData()
    if (file) {
      data.append("photo", file)
    }
    data.append("_id", props.id)
    data.append("Username", draftUsername)
    data.append("Role", draftRole)
    data.append("Pass", draftPass)
    const newPhoto = await Axios.post("/update-user", data, { headers: { "Content-Type": "multipart/form-data" } })
    if (newPhoto.data) {
      props.setUsers(prev => {
        return prev.map(function (user) {
          if (user._id === props.id) {
            return { ...user, photo: newPhoto.data }
          }
          return user
        })
      })
    }
  }

  return (
    <div className="card">
      <div className="our-card-top">
        {isEditing && (
          <div className="our-custom-input">
            <div className="our-custom-input-interior">
              <input onChange={e => setFile(e.target.files[0])} className="form-control form-control-sm" type="file" />
            </div>
          </div>
        )}
        <img src={props.photo ? `/upload-img/${props.photo}` : "/no-image.jpg"} className="card-img-top" alt={`${props.Role} named ${props.Username}`} />
      </div>
      <div className="card-body">
        {!isEditing && (
          <>
            <h4>{props.Username}</h4>
            <p className="text-muted small">{props.Role}</p>
            {!props.readOnly && (
              <>
                <button
                  onClick={() => {
                    setIsEditing(true)
                    setDraftUsername(props.Username)
                    setDraftRole(props.Role)
                    setDraftPass(props.Pass || "") // แก้ไขตรงนี้
                    setFile("")
                  }}
                  className="btn btn-sm btn-primary"
                >
                  Edit
                </button>{" "}
                <button
                  onClick={async () => {
                    const test = Axios.delete(`/user/${props.id}`)
                    props.setUsers(prev => {
                      return prev.filter(user => {
                        return user._id !== props.id
                      })
                    })
                  }}
                  className="btn btn-sm btn-outline-danger"
                >
                  Delete
                </button>
              </>
            )}
          </>
        )}
        {isEditing && (
          <form onSubmit={submitHandler}>
            <div className="mb-1">
              <input
                autoFocus
                onChange={e => setDraftUsername(e.target.value)}
                type="text"
                className="form-control form-control-sm"
                value={draftUsername}
              />
            </div>
            <div className="mb-2">
              <input
                onChange={e => setDraftRole(e.target.value)}
                type="text"
                className="form-control form-control-sm"
                value={draftRole}
              />
            </div>
            <div className="mb-2">
              <input
                onChange={e => setDraftPass(e.target.value)}
                type="text"
                className="form-control form-control-sm"
                value={draftPass}
              />
            </div>
            <button className="btn btn-sm btn-success">Save</button>{" "}
            <button onClick={() => setIsEditing(false)} className="btn btn-sm btn-outline-secondary">
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default UserCard
