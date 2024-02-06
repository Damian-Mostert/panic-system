import { Popup, Button } from "../../../components";
import { Location, logout ,User} from "../../../modules";

import { SendPanicService } from "../../../services";

export default function SendPanic({tab,setTab}){
    User();

    const location = Location();
    
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

        SendPanicService("active",panicType.value,panicDetails.value,location.longitude,location.latitude)
        .then(res => {
           console.log(res.data)
           if (res.status != 200) return Popup.fire({
               icon: "unapproved",
               text: "Request failed with status code " + res.status,
               background: "blur",
               timer: 5000,
               canClose: true
           });

           if (res.data.status == "error") {
               Popup.fire({
                   icon: "unapproved",
                   text: res.data.message,
                   background: "blur",
                   timer: 5000,
                   canClose: true
               });
           } else {
               panicType.value = "";
               panicDetails.value = "";
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
               text: "Request failed",
               background: "blur",
               timer: 5000,
               canClose: true
           });
       })
        
    };
    return <>
        <div className='flex flex-wrap w-[600px] '>
            <div className="flex relative items-center w-full bg-black  p-4 shadow-md rounded-xl">
                <div className="absolute w-min left-0">
                    <Button label="panics" onClick={()=>setTab("history")} />
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
                <Button label="view canceled" variant='basic' onClick={() => setTab("canceled")} />
            </div>
        </div>
    </>
}