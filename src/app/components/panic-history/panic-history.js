import { useEffect, useState } from "react";
import { Popup, Button } from "../../../components";
import { logout, User } from "../../../modules";


import axios from "axios";
import { GetHistory, UpdatePanic } from "./services";

export default function PanicHistory({ tab, setTab }) {
    User();

    const [tempData, setTempData] = useState();


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
                UpdatePanic(panicId,{ canceled: true }).then(response => {
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
                
                UpdatePanic(panicId, { canceled: false }).then(response => {
                    // Handle the response, update UI, etc.

                    if (response.data.status == "success") {
                        loadPanics("canceled");
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

    const loadPanics = (tab) => {
        console.info("loading panic history...")
        Popup.fire({
            icon: "loading",
            background: "blur"
        });

        GetHistory().then(res => {
            
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

                let output = [];
                for (let item of res.data.data) 
                    tab == "canceled" ? item.canceled && output.push(item) : !item.canceled && output.push(item);

                setTempData(output);
                setTab(tab?"canceled":"history");
                Popup.close();
            }

        })
    };

    useEffect(() => {
        if (tab == 'history') loadPanics();
        else loadPanics("canceled");
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