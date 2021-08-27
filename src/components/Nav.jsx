import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { LoggedContext } from "../App.js";
import "./Nav.css";

function Nav(props) {
    const loggedContext = useContext(LoggedContext);

    if (!loggedContext.logState) {
        return (
            <>
                <div className="nav">
                    <div className="navLeft">
                        <Link to="/">Home</Link>
                    </div>
                    <div className="navRight">
                        <Link to="/login">Login</Link>
                    </div>
                    <div className="navRight">
                        <Link to="/signup">Sign Up</Link>
                    </div>
                </div>
                <div>{props.children}</div>
            </>
        );
    } else {
        return (
            <>
                <div className="nav">
                    <div className="navLeft">
                        <Link to="/">Home</Link>
                    </div>
                    {loggedContext && (
                        <div className="navLeft-welcome">
                            Hello, {loggedContext?.logState?.first_name}
                        </div>
                    )}
                    <div className="navRight">
                        <Link to="/logout">Logout</Link>
                    </div>
                    <div className="navRight">
                        <Link to="/vault">Vault</Link>
                    </div>
                    {/* <div className="navRight">
            <Link to="/dashboard">Dashboard</Link>
          </div> */}
                </div>
                <div>{props.children}</div>
            </>
        );
    }
}

export default Nav;
