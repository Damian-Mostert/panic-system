"use server";

import axios from "axios";

export async function SendPanicService(status,type,details,longitude,latitude){

    const token = localStorage.getItem("token");

    if(!token||!status||!type||!details||!longitude||!latitude) return null;

    return axios.post(process.env.REACT_APP_API_URL + "/api/send-panic", {
        status,
        type,
        details,
        longitude,
        latitude,
    }, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
        }
    })
}