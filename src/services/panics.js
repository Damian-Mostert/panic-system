"use server";

import axios from "axios"

export async function GetHistory() {

    const token = localStorage.getItem("token");

    return axios.post(process.env.REACT_APP_API_URL + "/api/panic-history", {}, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
        }
    })
}

export async function UpdatePanic(panicId, NewData) {
    const token = localStorage.getItem("token");

    if (!token || !panicId || !NewData) return null;
    NewData.id = panicId;

    return axios.post(process.env.REACT_APP_API_URL + "/api/update-panic", NewData, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
        }
    })
}

export async function SendPanicService(status, type, details, longitude, latitude) {

    const token = localStorage.getItem("token");

    if (!token || !status || !type || !details || !longitude || !latitude) return null;

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