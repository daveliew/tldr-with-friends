import React, { useEffect, useContext } from "react";
import axiosInstance from "../axios";
import { useHistory } from "react-router-dom";
import { LoggedContext } from "../App.js";

export default function Logout() {
    const history = useHistory();
    const loggedContext = useContext(LoggedContext);

    useEffect(() => {
        axiosInstance.post("users/logout/blacklist", {
            refresh_token: localStorage.getItem("refresh_token"),
        });
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        axiosInstance.defaults.headers["Authorization"] = null;
        loggedContext.setLogState();
        history.push("/");
    });
    return <div>Logout</div>;
}
