import React, { useState } from "react";
import Axios from "axios";

function EditUser(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftUsername, setDraftUsername] = useState("");
  const [draftTeam, setDraftTeam] = useState("");
  const [file, setFile] = useState();
  const [draftRole, setDraftRole] = useState("");
  const [draftPass, setDraftPass] = useState(props.Pass || "");

  async function submitHandler(e) {
    e.preventDefault();
    setIsEditing(false);
    props.setUsers((prev) =>
      prev.map(function (user) {
        if (user._id === props.id) {
          return { ...user, Username: draftUsername, Role: draftRole, Team: draftTeam, Pass: draftPass };
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
    data.append("Team", draftTeam);
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
    <div className="popup">
      <div className="popup-content">
        <div className="popup-inner">
          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label>Username:</label>
              <input autoFocus className="form-control" onChange={(e) => setDraftUsername(e.target.value)} type="text" value={draftUsername} />
            </div>
            <div className="form-group">
              <label>Role:</label>
              <input className="form-control" onChange={(e) => setDraftRole(e.target.value)} type="text" value={draftRole} />
            </div>
            <div className="form-group">
              <label>Team:</label>
              <input className="form-control" onChange={(e) => setDraftTeam(e.target.value)} type="text" value={draftTeam} />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input className="form-control" onChange={(e) => setDraftPass(e.target.value)} type="password" value={draftPass} />
            </div>
            <div className="form-group">
              <button type="submit">Save</button>{" "}
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditUser;
