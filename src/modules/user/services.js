"use server";

import axios from 'axios';

export async function GetUser(){
    const id = localStorage.getItem("id");

    console.log(id);
    
    return axios.post(process.env.REACT_APP_API_URL + "/api/get-user", {
        id,
    }, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
        }
    })
}