import React, { useState } from "react";
import Axios from "axios";

function UserCard(props) {
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

  const showPopup = () => {
    return (
      <div className="popup">
        <div className="popup-content">
          <div className="popup-inner">
            <form onSubmit={submitHandler}>
              <div className="form-group-horizontal">
                <div className="form-group">
                  <label>Username:</label>
                  <input autoFocus className="form-control" onChange={(e) => setDraftUsername(e.target.value)} type="text" value={draftUsername} />
                </div>
                <div className="form-group">
                  <label>Role:</label>
                  <input className="form-control" onChange={(e) => setDraftRole(e.target.value)} type="text" value={draftRole} />
                </div>
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
                <button type="submit" >Save</button>{" "}
                <button  onClick={() => setIsEditing(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };


  return (
    <table className="board" width={"100%"}>
             <thead>
        <tr>
          <td>Img</td>
          <td>Role</td>
          <td>Team</td>
          <td>Action</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="people">
            <img src={props.photo ? `/upload-img/${props.photo}` : "/no-image.jpg"} className="card-img-top" alt={`${props.Role} named ${props.Username}`} />
              <div className="people-de">
              <h5>{props.Username}</h5>
              </div>
          </td>
          <td className="Role">
            <p>{props.Role}</p>
          </td>
          <td className="peple-team">
            <p>{props.Team}</p>
          </td>
          {!props.readOnly && (
            <td className="action">
              <button className="edit"
                onClick={() => {
                  setIsEditing(true);
                  setDraftUsername(props.Username);
                  setDraftRole(props.Role);
                  setDraftTeam(props.Team);
                  setDraftPass(props.Pass || "");
                  setFile("");
                }}
              >
                Edit
              </button>{" "}
              <button className="delete"
                onClick={async () => {
                  const test = await Axios.delete(`/user/${props.id}`);
                  props.setUsers((prev) => {
                    return prev.filter((user) => {
                      return user._id !== props.id;
                    });
                  });
                }}
              >
                Delete
              </button>
            </td>
          )}
        </tr>
        {isEditing && (
          showPopup()
        )}
      </tbody>
    </table>
  );
}

export default UserCard;
