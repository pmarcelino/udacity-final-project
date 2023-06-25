import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();
  const returnLink = process.env.REACT_APP_AUTH0_LOGOUT_REDIRECT_URL;

  return (
    <button
      className="btn btn-danger btn-block"
      onClick={() =>
        logout({
          returnTo: returnLink,
        })
      }
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
