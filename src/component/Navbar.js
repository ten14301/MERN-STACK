import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass,faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Search from "./Search";

function Navbar() {
  
  return (
    <div className="interface">
      <div className="navigation">
        <div className="n1">
          <div className="profile">
            <Search />
            <div>
            <img src="/no-image.jpg" />
            <a href="/"><FontAwesomeIcon icon={faRightFromBracket} /></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
