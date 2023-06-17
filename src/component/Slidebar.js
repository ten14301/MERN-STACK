import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie,faListCheck,faUser,faBell } from "@fortawesome/free-solid-svg-icons";

function Slidebar() {

    const [activeMenu, setActiveMenu] = useState(null);

    const handleMenuClick = (menuIndex) => {
      setActiveMenu(menuIndex);
    };
  return (
    <div id="menu">
      <div className="logo">
        <img src="./img/logo.png" alt="" />
        <h2>DB Manage</h2>
      </div>
      <div className="item">
        <a>
            <li className={activeMenu === 0 ? "active" : ""}
            onClick={() => handleMenuClick(0)}>
            <FontAwesomeIcon icon={faChartPie} className="icon"/><a href="#" >DashBoard Chart</a>
            </li>
            <li className={activeMenu === 1 ? "active" : ""}
            onClick={() => handleMenuClick(1)}>
            <FontAwesomeIcon icon={faUser} className="icon" /> <a href="#">Manage User</a>
            </li >
            <li className={activeMenu === 2 ? "active" : ""}
            onClick={() => handleMenuClick(2)} >
            <FontAwesomeIcon icon={faListCheck}  className="icon" /><a href="#">Task</a>
            </li>
            <li className={activeMenu === 3 ? "active" : ""}
            onClick={() => handleMenuClick(3)} >
            <FontAwesomeIcon icon={faBell}  className="icon" /> <a href="#">Notifications</a>
            </li>
        </a>
      </div>
    </div>
  );
}

export default Slidebar;
