import axios from 'axios';
import { useEffect, useState } from "react"

export function User(){
    const [user,setUser] = useState();
    useEffect(()=>{
        axios.post(process.env.REACT_APP_API_URL + "/api/get-user", {
            id: localStorage.getItem("id"),
        }, {
            headers:{
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
        }).then(res => {
            if(res.status == 200)
                setUser(res.data);
        }).catch(e=>{})
    },[]);
    return user;
}