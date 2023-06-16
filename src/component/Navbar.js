import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass,faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  return (
    <div className="interface">
      <div className="navigation">
        <div className="n1">
          <div className="profile">
            <div className="s">
             <i className="manify"> <FontAwesomeIcon icon={faMagnifyingGlass} /></i>
              <input type="text" placeholder="...search"/>
            </div>
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
