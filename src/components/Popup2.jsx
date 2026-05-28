import React from 'react'

const Popup2 = (props) => {
    return (
      <div className="popup-box2">
        <div className="box2">
          <span className="close-icon" onClick={props.handleClose}>
            x
          </span>
          {props.content}
        </div>
      </div>
    );
  };

export default Popup2