import React, { useState } from "react";
import Axios from "axios";

function UserCard(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftUsername, setDraftUsername] = useState("");
  const [file, setFile] = useState();
  const [draftRole, setDraftRole] = useState("");
  const [draftPass, setDraftPass] = useState(props.Pass || "");

  async function submitHandler(e) {
    e.preventDefault();
    setIsEditing(false);
    props.setUsers((prev) =>
      prev.map(function (user) {
        if (user._id === props.id) {
          return { ...user, Username: draftUsername, Role: draftRole, Pass: draftPass };
        }
        return user;
      })
    );
    const data = new FormData();
    if (file) {
      data.append("photo", file);
    }
    data.append("_id", props.id);
    data.append("Username", draftUsername);
    data.append("Role", draftRole);
    data.append("Pass", draftPass);
    const newPhoto = await Axios.post("/update-user", data, { headers: { "Content-Type": "multipart/form-data" } });
    if (newPhoto.data) {
      props.setUsers((prev) => {
        return prev.map(function (user) {
          if (user._id === props.id) {
            return { ...user, photo: newPhoto.data };
          }
          return user;
        });
      });
    }
  }

  return (
    <div className="card">
      {isEditing && (
        <div>
          <div>
            <input onChange={(e) => setFile(e.target.files[0])} className="form-control form-control-sm" type="file" />
          </div>
        </div>
      )}
      <img src={props.photo ? `/upload-img/${props.photo}` : "/no-image.jpg"} className="card-img-top" alt={`${props.Role} named ${props.Username}`} />
      <div>
        {!isEditing && (
          <>
            <p>{props.Username}</p>
            <p>{props.Role}</p>
            {!props.readOnly && (
              <div>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setDraftUsername(props.Username);
                    setDraftRole(props.Role);
                    setDraftPass(props.Pass || "");
                    setFile("");
                  }}
            
                >
                  Edit
                </button>{" "}
                <button
                  onClick={async () => {
                    const test = Axios.delete(`/user/${props.id}`);
                    props.setUsers((prev) => {
                      return prev.filter((user) => {
                        return user._id !== props.id;
                      });
                    });
                  }}
              
                >
                  Delete
                </button>
              </div>
            )}
          </>
        )}
        {isEditing && (
          <form onSubmit={submitHandler}>
            <div>
              <input
                autoFocus
                onChange={(e) => setDraftUsername(e.target.value)}
                type="text"
                value={draftUsername}
              />
            </div>
            <div>
              <input onChange={(e) => setDraftRole(e.target.value)} type="text"  value={draftRole} />
            </div>
            <div>
              <input
                onChange={(e) => setDraftPass(e.target.value)}
                type="text"
                value={draftPass}
              />
            </div>
            <div>
              <button>
                Save
              </button>{" "}
              <button onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserCard;
