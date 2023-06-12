import React, { useState, useRef } from "react";
import Axios from "axios";

function CreateNewForm(props) {
  const [Username, setUsername] = useState("");
  const [Pass, setPassword] = useState("");
  const [Role, setRole] = useState("");
  const [file, setFile] = useState("");
  const CreatePhotoField = useRef();
  const [modalIsOpen, setModalIsOpen] = useState(false);

  async function submitHandler(e) {
    e.preventDefault();
    const data = new FormData();
    data.append("photo", file);
    data.append("Username", Username);
    data.append("Pass", Pass);
    data.append("Role", Role);
    setUsername("");
    setPassword("");
    setRole("");
    setFile("");
    CreatePhotoField.current.value = "";
    const newPhoto = await Axios.post("/create-user", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    props.setUsers((prev) => prev.concat([newPhoto.data]));
    setModalIsOpen(false);
  }

  return (
    <>
        <form onSubmit={submitHandler}>
          <div>
            <input
              ref={CreatePhotoField}
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
            />
          </div>
          <div>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={Username}
              type="text"
              placeholder="User name"
            />
          </div>
          <div>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={Pass}
              type="password"
              placeholder="Password"
            />
          </div>
          <div>
            <select onChange={(e) => setRole(e.target.value)} value={Role}>
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          </div>

          <button type="submit">Create New User</button>
        </form>

        </>
  );
}

export default CreateNewForm;
