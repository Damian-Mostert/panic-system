"use client";


import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import { Popup, Button } from "./components";
import { Location } from './modules';


const backEndUrl = "https://panic-backend-express.vercel.app";

function Main() {

  const [tab, setTab] = useState("login");
  const [user, setUser] = useState(null);
  const [tempData, setTempData] = useState(null);

  useEffect(() => {
    console.log(tempData)
  }, [tempData]) 

  const location = Location();

  const logout = () => {

    setTab("login");
    localStorage.removeItem("user");

  }

  const login = () => {

    Popup.fire({
      icon: "loading",
      background: "blur"
    });

    fetch(backEndUrl + "/api/login", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
      }),
    }).then(res => res.json()).then(res => {

      if (res.status == "error") {

        Popup.fire({
          icon: "unapproved",
          text: res.message,
          background: "blur",
          timer: 5000,
          canClose: true
        });

      } else {

        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        setTab("send");

        Popup.fire({
          icon: "approved",
          text: res.message,
          background: "blur",
          timer: 5000,
          canClose: true
        });

      }

    })
  };

  const loadPanics = () => {
    Popup.fire({
      icon: "loading",
      background: "blur"
    });

    fetch(backEndUrl + "/api/panic-history", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({}),
    }).then(res => res.json()).then(res => {

      if (res.status == "error") {

        Popup.fire({
          icon: "unapproved",
          text: res.message,
          background: "blur",
          timer: 5000,
          canClose: true
        });

      } else {

        let newTempData = [];

        for (let item of res.data) {
          let Data = JSON.parse(item.data);
          if (!item.canceled) {
            newTempData.push({
              ...Data,
              ...item,
            });
          }
        }
        newTempData.reverse();
        setTempData(newTempData);
        setTab("history");
        Popup.close();

      }

    })
  };

  const loadCanceledPanics = () => {
    Popup.fire({
      icon: "loading",
      background: "blur"
    });

    fetch(backEndUrl + "/api/panic-history", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({}),
    }).then(res => res.json()).then(res => {

      if (res.status == "error") {

        Popup.fire({
          icon: "unapproved",
          text: res.message,
          background: "blur",
          timer: 5000,
          canClose: true
        });

      } else {

        console.log(res.data)

        let newTempData = [];

        for (let item of res.data) {
          let Data = JSON.parse(item.data);
          if (item.canceled) {
            newTempData.push({
              ...Data,
              ...item,
            });
          }
        }
        newTempData.reverse();
        setTempData(newTempData);
        setTab("canceled");
        Popup.close();

      }

    })
  };

  const closePanics = () => {
    setTempData(null);
    setTab("send");
  };

  const sendPanic = async () => {
    const panicType = document.getElementById("panic-type");
    const panicDetails = document.getElementById("panic-details");

    if (!panicType.value || !panicDetails.value) {
      return Popup.fire({
        icon: "unapproved",
        text: "Please select a type and insert details",
        background: "blur",
        timer: 5000,
        canClose: true
      });
    }

    if (!location.latitude || !location.longitude) {
      return Popup.fire({
        icon: "unapproved",
        text: "Please enable location services",
        background: "blur",
        timer: 5000,
        canClose: true
      });
    }

    Popup.fire({
      icon: "loading",
      background: "blur"
    });
    fetch(backEndUrl + "/api/send-panic", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        status: "active",
        type: panicType.value,
        details: panicDetails.value,
        longitude: location.longitude,
        latitude: location.latitude,
        created_by: {
          id_num: user.id_num,
          email: user.email,
          name: user.name,
        }
      }),
    }).then(res => res.json()).then(res => {

      if (res.status == "error") {

        Popup.fire({
          icon: "unapproved",
          text: res.message,
          background: "blur",
          timer: 5000,
          canClose: true
        });

      } else {

        panicType.value = "";
        panicDetails.value = "";

        Popup.fire({
          icon: "approved",
          text: res.message,
          background: "blur",
          timer: 5000,
          canClose: true
        });

      }
    })

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
        console.log(tempData[index]);
        Popup.fire({
          icon: "loading",
          background: "blur"
        });
        fetch(backEndUrl + "/api/update-panic", {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify({ id: panicId, canceled: true }),
        })
          .then(res => res.json())
          .then(response => {
            // Handle the response, update UI, etc.

            if (response.status == "success") {
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
        fetch(backEndUrl + "/api/update-panic", {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
          referrerPolicy: "no-referrer",
          body: JSON.stringify({ id: panicId, canceled: false }),
        })
          .then(res => res.json())
          .then(response => {
            // Handle the response, update UI, etc.

            if (response.status == "success") {
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




  useEffect(() => {
    const user = localStorage.getItem("user");
    user && setUser(JSON.parse(user))
  }, []);

  useEffect(() => { user && setTab("send") }, [user]);

  return <>
    <img src="/batman.png" className='fixed bottom-4 right-4 w-[100px] h-auto' />
    <div style={{ letterSpacing: "2px", background: "#222" }} className="rounded-3xl shadow-2xl p-4 flex flex-wrap text-yellow-400">
      {(() => {
        switch (tab) {
          case "login":
            return <>
              <div className="w-[300px] flex flex-wrap">
                <h2 className="text-2xl w-full text-center">
                  LOGIN
                </h2>
                <label className="pt-4 ml-1">Email</label>
                <input type="email" id="email" placeholder='Enter email' className="w-full text-center rounded-xl p-1" />
                <label className="pt-4 ml-1">Password</label>
                <input type="password" id="password" placeholder='Enter password' className="w-full text-center mb-4 rounded-xl p-1" />
                <Button className="m-auto" variant='basic' onClick={login} label="Login" />
              </div>
            </>

          case "send":
            return <div className='flex flex-wrap w-[600px] '>
              <div className="flex relative items-center w-full bg-black  p-4 shadow-md rounded-xl">
                <div className="absolute w-min left-0">
                  <Button label="panics" onClick={loadPanics} />
                </div>
                <h2 className="text-2xl w-full text-center">
                  SEND PANIC
                </h2>
                <div className="absolute w-min right-0">
                  <Button label="logout" onClick={logout} />
                </div>
              </div>
              <div className='w-full my-4 flex flex-wrap'>
                <div className='flex flex-wrap w-full pt-4'>
                  <span className='mr-4 mb-1'>Type</span>
                  <select defaultValue={null} id="panic-type" className='text-center w-full bg-black p-2 rounded-md'>
                    <option value="">please select an option</option>
                    <option value="Bank Robery">Bank Robery</option>
                    <option value="Hitman On The Loose">Hitman On The Loose</option>
                  </select>
                </div>
                <div className='flex flex-wrap w-full pt-4'>
                  <span className='mr-4 mb-1'>Details</span>
                  <textarea id="panic-details" placeholder='enter details' className='text-center w-full p-2 rounded-md focus:outline-none bg-black' type="text" style={{ resize: "none" }} />
                </div>
              </div>
              <div className='m-auto'>
                <Button label="send" variant='basic' onClick={sendPanic} />
              </div>
              <div className='m-auto'>
                <Button label="view canceled" variant='basic' onClick={loadCanceledPanics} />
              </div>
            </div>
          case "history": case "canceled":
            return <div className='flex flex-wrap w-[800px]'>
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
          default:
            return <></>
        }
      })()}
    </div>
  </>
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><Main /><Popup /></React.StrictMode>);
