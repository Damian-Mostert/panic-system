import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import { Popup, Button } from "./components";

const backEndUrl = "http://127.0.0.1:8000";

function Main() {

  const [tab, setTab] = React.useState("login");
  const [user, setUser] = React.useState(null);
  const [tempData,setTempData] = React.useState(null);


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
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
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
        localStorage.setItem("user",JSON.stringify(res.data));
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

  const loadPanics = () =>{
    Popup.fire({
      icon: "loading",
      background: "blur"
    });
    fetch(backEndUrl + "/api/panic-history", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
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
        
        console.info("loaded panics",res.data);

        setTempData(res.data);
        setTab("history");
        Popup.close();

      }

    })
  };

  const closePanics = () => {
    setTempData(null);
    setTab("send");
  };

  const openPanic = () => {

  };

  const closePanic = () => {

  };

  const sendPanic = async () => {

  };

  const cancelPanic = async () => {

  };

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    user && setUser(JSON.parse(user))
  }, []);

  React.useEffect(()=>{user && setTab("send")},[user]);

  return <div className="bg-gray-200 rounded-3xl shadow-2xl p-4 flex flex-wrap">
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
          return <div className='flex flex-wrap w-[800px]'>
            <div className="flex relative items-center w-full">
              <div className="absolute w-min left-0">
                <Button label="history" onClick={loadPanics} />
              </div>
              <h2 className="text-2xl w-full text-center">
                SEND PANIC
              </h2>
              <div className="absolute w-min right-0">
                <Button label="logout" onClick={logout}/>
              </div>
            </div>
            <div className='w-full my-4'>
            
            </div>
            <div className='m-auto'>
              <Button label="send" variant='basic' onClick={logout} />
            </div>
          </div>
        case "history":
          return <div className='flex flex-wrap w-[800px]'>
            <div className="flex relative items-center w-full">
              <div className="absolute w-min left-0">
                <Button label="back" onClick={closePanics} />
              </div>
              <h2 className="text-2xl w-full text-center">
                PANIC HISTORY
              </h2>
              <div className="absolute w-min right-0">
                <Button label="logout" onClick={logout} />
              </div>
            </div>
            <div className='w-full mt-4'>

            </div>
          </div>
        case "cancel":
          return <div className='flex flex-wrap w-[800px]'>
            <div className="flex relative items-center w-full">
              <div className="absolute w-min left-0">
                <Button label="back" onClick={closePanics} />
              </div>
              <h2 className="text-2xl w-full text-center">
                CANCEL PANIC
              </h2>
              <div className="absolute w-min right-0">
                <Button label="logout" onClick={logout} />
              </div>
            </div>
            <div className='w-full my-4'>

            </div>
            <div className='m-auto'>
              <Button label="send" variant='basic' onClick={logout} />
            </div>
          </div>
        default:
          return <></>
      }
    })()}
  </div>
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><Main /><Popup /></React.StrictMode>);
