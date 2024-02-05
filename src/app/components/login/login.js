import styles from "./login.module.scss";

import { Popup, Button } from "../../../components";
import axios from "axios";
import { User } from "../../../modules";
import { useEffect } from "react";

export default function Login({ tab, setTab }) {
    const user = User();

    useEffect(() => {
        if (user) {
            console.log(user)
            setTab("send");
        }
    }, [user])

    const login = () => {

        Popup.fire({
            icon: "loading",
            background: "blur"
        });

        axios.post(process.env.REACT_APP_API_URL + "/api/login", {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
        }, {
            "Content-Type": "application/json",
        }).then(async res => {
            if (res.status != 200) {
                console.error("Error", res)
                return await Popup.fire({
                    icon: "warn",
                    text: "Login failed",
                    background: "blur",
                    timer: 5000,
                    canClose: true
                });
            }
            if (res.data.status == "error") {

                Popup.fire({
                    icon: "unapproved",
                    text: res.data.message,
                    background: "blur",
                    timer: 5000,
                    canClose: true
                });

            } else {

                localStorage.setItem("id", res.data.data.id)
                localStorage.setItem("token", res.data.data.token);
                setTab("send");

                Popup.fire({
                    icon: "approved",
                    text: res.data.message,
                    background: "blur",
                    timer: 5000,
                    canClose: true
                });

            }
        }).catch(e => {
            console.error(e);

            Popup.fire({
                icon: "unapproved",
                text: "There was an error logging in, please try again later",
                background: "blur",
                timer: 5000,
                canClose: true
            });
        })
    };

    return <>
        <div className={styles.container}>
            <h2 className={styles.heading}>
                LOGIN
            </h2>
            <label className={styles.label}>Email</label>
            <input type="email" id="email" placeholder='Enter email' className={styles.email} />
            <label className={styles.label}>Password</label>
            <input type="password" id="password" placeholder='Enter password' className={styles.password} />
            <Button className="m-auto" variant='basic' onClick={login} label="Login" />
        </div>
    </>
}