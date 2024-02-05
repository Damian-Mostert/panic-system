import { useEffect, useState } from "react";
import { Popup, Button } from "../../../components";
import { logout, User } from "../../../modules";


import axios from "axios";

export default function PanicHistory({ tab, setTab }) {
    const user = User();

    const [tempData, setTempData] = useState();

    const loadCanceledPanics = () => {
        Popup.fire({
            icon: "loading",
            background: "blur"
        });

        axios.post(process.env.REACT_APP_API_URL + "/api/panic-history", {}, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
        }).then(async res => {
            if (res.statusText != "OK") {
                console.error("Error", res)
                return await Popup.fire({
                    icon: "warn",
                    text: "Fetching history failed",
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

                res.data.data.reverse();
                setTempData(res.data.data);
                setTab("canceled");
                Popup.close();
            }


        }).catch(e => {
            console.error(e);

            Popup.fire({
                icon: "unapproved",
                text: "Could not fetch history",
                background: "blur",
                timer: 5000,
                canClose: true
            });
        })
    };

    const closePanics = () => {
        setTempData(null);
        setTab("send");
    };

    const openCancelPanic = (index) => {

        Popup.fire({
            background: "blur",
            icon: "warn",
            text: "Are you sure you want to cancel this panic?",
            confirmButton: {
                label: "confirm",
                variant: "basic"
            },
            canClose: true,
        }).then(res => {
            if (res.confirmed) {
                const panicId = tempData[index].id;
                Popup.fire({
                    icon: "loading",
                    background: "blur"
                });
                axios.post(process.env.REACT_APP_API_URL + "/api/update-panic", { id: panicId, canceled: true }, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    }
                })
                    .then(response => {
                        // Handle the response, update UI, etc.

                        if (response.data.status == "success") {
                            loadPanics();
                        } else {
                            return Popup.fire({
                                icon: "unapproved",
                                text: "Failed to cancel panic",
                                background: "blur",
                                timer: 5000,
                                canClose: true
                            });
                        }
                    })
                    .catch(error => {
                        // Handle errors, log, or show user-friendly messages
                        console.error("Error during panic cancellation:", error.message);
                    });
            }
        });
    };

    const openUnCancelPanic = (index) => {
        Popup.fire({
            background: "blur",
            icon: "warn",
            text: "Are you sure you want to uncancel this panic?",
            confirmButton: {
                label: "confirm",
                variant: "basic"
            },
            canClose: true,
        }).then(res => {
            if (res.confirmed) {
                const panicId = tempData[index].id;
                Popup.fire({
                    icon: "loading",
                    background: "blur"
                });
                axios.post(process.env.REACT_APP_API_URL + "/api/update-panic", { id: panicId, canceled: false }, {
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    }
                }).then(response => {
                    // Handle the response, update UI, etc.

                    if (response.data.status == "success") {
                        loadCanceledPanics();
                    } else {
                        return Popup.fire({
                            icon: "unapproved",
                            text: "Failed to uncancel panic",
                            background: "blur",
                            timer: 5000,
                            canClose: true
                        });
                    }
                })
                    .catch(error => {
                        // Handle errors, log, or show user-friendly messages
                        console.error("Error during panic cancellation:", error.message);
                    });
            }
        });
    };

    const loadPanics = () => {
        Popup.fire({
            icon: "loading",
            background: "blur"
        });

        axios.post(process.env.REACT_APP_API_URL + "/api/panic-history", {}, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem("token")}`,
            }
        }).then(res => {

            if (res.data.status == "error") {

                Popup.fire({
                    icon: "unapproved",
                    text: res.data.message,
                    background: "blur",
                    timer: 5000,
                    canClose: true
                });

            } else {
                res.data.data.reverse();
                setTempData(res.data.data);
                setTab("history");
                Popup.close();

            }

        })
    };

    useEffect(() => {
        if (tab == 'history') loadPanics();
        else loadCanceledPanics();
    }, []);

    return <>
        <div className='flex flex-wrap w-[800px]'>
            <div className="flex relative items-center w-full bg-black p-4 shadow-md rounded-xl">
                <div className="absolute w-min left-0">
                    <Button label="back" onClick={closePanics} />
                </div>
                <h2 className="text-2xl w-full text-center">
                    {tab == "canceled" && <>CANCELED</>} PANICS
                </h2>
                <div className="absolute w-min right-0">
                    <Button label="logout" onClick={logout} />
                </div>
            </div>
            <div className='w-full mt-4 h-[400px] overflow-auto flex flex-wrap'>
                {tempData && tempData.map((item, key) => {
                    return <div key={`panic-item-${key}`} className='bg-for-table w-full flex-wrap p-4' >
                        <div className='py-1 flex flex-wrap w-full' style={{ borderBottom: "2px dotted yellow" }}>
                            <div className='w-1/2'>
                                Type
                            </div>
                            <div className='w-1/2'>
                                {item.type}
                            </div>
                        </div>
                        <div className='py-1 flex flex-wrap w-full' style={{ borderBottom: "2px dotted yellow" }}>
                            <div className='w-1/2'>
                                Details
                            </div>
                            <div className='w-1/2 mb-1'>
                                {item.details}
                            </div>
                        </div>
                        <div className='py-1 flex flex-wrap w-full' style={{ borderBottom: "2px dotted yellow" }}>
                            <div className='w-1/2'>
                                Longitude
                            </div>
                            <div className='w-1/2'>
                                {item.longitude}
                            </div>
                        </div>
                        <div className='py-1 flex flex-wrap w-full' style={{ borderBottom: "2px dotted yellow" }}>
                            <div className='w-1/2'>
                                Latitude
                            </div>
                            <div className='w-1/2'>
                                {item.latitude}
                            </div>
                        </div>
                        <div className='py-1 flex flex-wrap w-full' style={{ borderBottom: "2px dotted yellow" }}>
                            <div className='w-1/2'>
                                Created at
                            </div>
                            <div className='w-1/2'>
                                {item.created_at}
                            </div>
                        </div>
                        <div className='py-1 flex flex-wrap w-full' style={{ borderBottom: "2px dotted yellow" }}>
                            <div className='w-1/2'>
                                Updated at
                            </div>
                            <div className='w-1/2'>
                                {item.updated_at}
                            </div>
                        </div>
                        <div className='w-full flex justify-end mt-4'>
                            <Button onClick={() => tab == "canceled" ? openUnCancelPanic(key) : openCancelPanic(key)} variant='basic' label={tab == "canceled" ? "uncancel" : "cancel"} />
                        </div>
                    </div>
                })}
            </div>
        </div>
    </>;
}