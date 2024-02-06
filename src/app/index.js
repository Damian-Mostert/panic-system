import '../styles/index.csss';

import { Popup} from "../components";
import { Login,SendPanic, PanicHistory} from './components';
import { useEffect, useState } from "react";
import { User } from '../modules';

export default function App() {
    const user = User();
    const [tab, setTab] = useState("login");
    return <>
        <img src="/batman.png" className='fixed bottom-4 right-4 w-[100px] h-auto' />
        {user && <div className='text-yellow-300 w-full flex justify-start'>
            <div className='pl-4 mb-4'>
                Loged in as {user.name}
                <br/>
                {user.email}
            </div>

        </div>}
        <div style={{ letterSpacing: "2px", background: "#222" }} className="rounded-3xl shadow-2xl p-4 flex flex-wrap text-yellow-400">
            {(() => {
                switch (tab) {
                    case "login":
                        return <Login tab={tab} setTab={setTab} />
                    case "send":
                        return <SendPanic tab={tab} setTab={setTab} />
                    case "history": case "canceled":
                        return <PanicHistory tab={tab} setTab={setTab} />
                    default:
                        return <></>
                }
            })()}
        </div>
        <Popup/>
    </>
}