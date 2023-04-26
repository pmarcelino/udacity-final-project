import React from "react";
import AuthenticationButton from "./AuthenticationButton";

const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="https://www.google.com">
            Exercise App
          </a>
          <AuthenticationButton />
        </div>
      </nav>
    </header>
  );
};

export default Header;
