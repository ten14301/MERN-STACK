import React, { useState, useRef } from "react";
import Modal from "react-modal";
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
  }

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Create New User"
      >
        <form className="p-3 bg-white shadow-sm rounded mb-5" onSubmit={submitHandler}>
          <div className="mb-2">
            <input
              ref={CreatePhotoField}
              onChange={(e) => setFile(e.target.files[0])}
              type="file"
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={Username}
              type="text"
              className="form-control"
              placeholder="User name"
            />
          </div>
          <div className="mb-2">
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={Pass}
              type="password"
              className="form-control"
              placeholder="Password"
            />
          </div>
          <div className="mb-2">
            <select
              onChange={(e) => setRole(e.target.value)}
              value={Role}
              className="form-control"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary">
            Create New User
          </button>
        </form>
      </Modal>

      <button
        className="btn btn-primary create-user-button"
        onClick={() => setModalIsOpen(true)}
      >
        Create New User
      </button>

      <style jsx>{`
        .create-user-button {
          position: fixed;
          bottom: 50px;
          right: 50px;
        }

        @media (max-width: 768px) {
          .create-user-button {
            position: static;
            margin-top: 20px;
          }
        }
      `}</style>
    </>
  );
}

export default CreateNewForm;
