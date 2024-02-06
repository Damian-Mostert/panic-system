
import { useEffect, useState } from "react"
import { GetUser } from "./services";

export function User(){

    const [user,setUser] = useState();

    const loadUser = async () =>{
        try{
            const res = await GetUser();
            if (res.status == 200)
                setUser(res.data.data);
            else if(user)setUser(null);
        }catch(e){}
    }

    useEffect(()=>{
        loadUser();
        let interval = setInterval(loadUser, 15000)
        return ()=>{
            clearInterval(interval)
        }
    },[]);
    
    return user;
}