"use server";

import axios from "axios";

export async function LoginService(email, password) {
    return axios.post(process.env.REACT_APP_API_URL + "/api/login", {
        email,
        password,
    }, {
        "Content-Type": "application/json",
    })
}

export async function GetUser() {
    return axios.post(process.env.REACT_APP_API_URL + "/api/get-user", {}, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    })
}