import React, { useEffect } from 'react'
import axiosInstance from "../axios";
import Nav from "./Nav"

function Dashboard() {

    useEffect(() => {
        axiosInstance.get(`summaries`)
        .then((res) => {
            console.log(res)
        })
    }, [])

    return (
        <Nav>
            
        </Nav>
    )
}

export default Dashboard
