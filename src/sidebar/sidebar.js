import "./sidebar.css";
import React from "react";

 const Sidebar = ({ width, height, children }) => {
  const [xPosition, setX] = React.useState(width);

  const toggleMenu = () => {
    if (xPosition < 0) {
      setX(0);
    } else {
      setX(-width);
    }
  };

  React.useEffect(() => {
    setX(-width);
  }, []);
  return (
    <React.Fragment>
      <div
        className="side-bar"
        style={{
          transform: `translatex(${xPosition}px)`,
          width: width,
          minHeight: height
        }}
      >
        <button
          onClick={() => toggleMenu()}
          className="toggle-menu"
          style={{
            transform: `translate(${width}px, 20vh)`
          }}
        ></button>
        <div className="content">{children}</div>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;