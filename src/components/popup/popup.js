"use client";
import { useState } from "react";

//styles
import "./popup.scss";

//imports
import Modal from "./modals/modals";
import { Button } from "../";
function Icons({ icon }) {
  switch (icon) {
    case "approved":
      return (
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
          viewBox="0 0 512 512" width="50px" height="50px" fill="currentColor">
          <g>
            <g>
              <path d="M256,0C114.833,0,0,114.833,0,256s114.833,256,256,256s256-114.853,256-256S397.167,0,256,0z M256,472.341
			c-119.275,0-216.341-97.046-216.341-216.341S136.725,39.659,256,39.659c119.295,0,216.341,97.046,216.341,216.341
			S375.275,472.341,256,472.341z"/>
            </g>
          </g>
          <g>
            <g>
              <path d="M373.451,166.965c-8.071-7.337-20.623-6.762-27.999,1.348L224.491,301.509l-58.438-59.409
			c-7.714-7.813-20.246-7.932-28.039-0.238c-7.813,7.674-7.932,20.226-0.238,28.039l73.151,74.361
			c3.748,3.807,8.824,5.929,14.138,5.929c0.119,0,0.258,0,0.377,0.02c5.473-0.119,10.629-2.459,14.297-6.504l135.059-148.722
			C382.156,186.854,381.561,174.322,373.451,166.965z"/>
            </g>
          </g>
        </svg>
      );
    case "warn":
      return (
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
          viewBox="0 0 512 512" width="50px" height="50px" fill="currentColor">
          <g>
            <g>
              <path d="M256,0C114.497,0,0,114.507,0,256c0,141.503,114.507,256,256,256c141.503,0,256-114.507,256-256
			C512,114.497,397.493,0,256,0z M256,472c-119.393,0-216-96.615-216-216c0-119.393,96.615-216,216-216
			c119.393,0,216,96.615,216,216C472,375.393,375.385,472,256,472z"/>
            </g>
          </g>
          <g>
            <g>
              <path d="M256,128.877c-11.046,0-20,8.954-20,20V277.67c0,11.046,8.954,20,20,20s20-8.954,20-20V148.877
			C276,137.831,267.046,128.877,256,128.877z"/>
            </g>
          </g>
          <g>
            <g>
              <circle cx="256" cy="349.16" r="27" />
            </g>
          </g>
        </svg>
      );
    case "unapproved":
      return (
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
          viewBox="0 0 512 512" width="50px" height="50px" fill="currentColor">
          <g>
            <g>
              <path d="M256,0C114.508,0,0,114.497,0,256c0,141.493,114.497,256,256,256c141.492,0,256-114.497,256-256
			C512,114.507,397.503,0,256,0z M256,472c-119.384,0-216-96.607-216-216c0-119.385,96.607-216,216-216
			c119.384,0,216,96.607,216,216C472,375.385,375.393,472,256,472z"/>
            </g>
          </g>
          <g>
            <g>
              <path d="M343.586,315.302L284.284,256l59.302-59.302c7.81-7.81,7.811-20.473,0.001-28.284c-7.812-7.811-20.475-7.81-28.284,0
			L256,227.716l-59.303-59.302c-7.809-7.811-20.474-7.811-28.284,0c-7.81,7.811-7.81,20.474,0.001,28.284L227.716,256
			l-59.302,59.302c-7.811,7.811-7.812,20.474-0.001,28.284c7.813,7.812,20.476,7.809,28.284,0L256,284.284l59.303,59.302
			c7.808,7.81,20.473,7.811,28.284,0C351.398,335.775,351.397,323.112,343.586,315.302z"/>
            </g>
          </g>
        </svg>


      );
    case "loading":
      
      return <img src="/batman.png" className="h-[50px] w-[50px] object-contain animate-pulse"/>
    default:
      throw new Error("invalid icon {" + icon + ") for popup.");
  }
}
//default popup box
function PopupBox({
  icon,
  title,
  text,
  cancelButton,
  confirmButton,
  Resolve,
  PopUpID,
}) {
  return (
    <div
      className={"popup " + (!text ? "popup-no-text" : "")}
      id={PopUpID}
    >
      {icon && (
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Icons icon={icon} />
        </div>
      )}
      {title && (
        <div
          style={{
            width: "100%",
            textAlign: "center",
            paddingTop: icon ? "1rem" : "",
          }}
        >
          <span style={{ fontSize: "2.5rem" }}>{title}</span>
        </div>
      )}
      {text && (
        <div
          className="px-4 w-full text-center"
          style={{
            paddingTop: title || icon ? "1rem" : "",
          }}
        >
          <span style={{ fontSize: "1rem" }}>{text}</span>
        </div>
      )}
      {(cancelButton || confirmButton) && (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              paddingTop: text || title || icon ? "1rem" : "",
            }}
          >
            {cancelButton && (
              <>
                <div style={{ margin: "auto" }}>
                  <Button
                    onClick={() => {
                      Resolve({ canceled: true });
                    }}
                    label={cancelButton.label || "Cancel"}
                    variant={cancelButton.variant}
                  />
                </div>
              </>
            )}
            {confirmButton && (
              <>
                <div style={{ margin: "auto" }}>
                  <Button
                    onClick={() => {
                      Resolve({ confirmed: true });
                    }}
                    variant={confirmButton.variant}
                    label={confirmButton.label || "Confirm"}
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
//container and contents
function Contents({
  modal,
  Resolve,
  icon,
  title,
  text,
  cancelButton,
  confirmButton,
}) {
  if (modal) {
    return <Modal modalData={modal} Resolve={Resolve} />;
  }
  return (
    <PopupBox
      icon={icon}
      title={title}
      text={text}
      cancelButton={cancelButton}
      confirmButton={confirmButton}
      Resolve={Resolve}
    />
  );
}
function Container({ data, Resolve, Id }) {
  return (
    <>
      {data && (
        <div style={{ position: "fixed", zIndex: "20000", top: "0px", left: "0px" }}>
          {data.background && (
            <>
              <div
                style={{
                  position: "fixed",
                  top: "0px",
                  left: "0px",
                  width: "100vw",
                  height: "100vh",
                  display: "flex",
                }}
              >
                <div
                  id={Id + "-background"}
                  className={"popup-background popup-background-" + data.background}
                  style={{ width: "100vw", height: "100vh", position: "fixed" }}
                />
                {data.canClose && (
                  <>
                    <div
                      onClick={() => {
                        Resolve({ close: true });
                      }}
                      style={{
                        position: "fixed",
                        top: "0px",
                        left: "0px",
                        width: "100vw",
                        height: "100vh",
                      }}
                    />
                  </>
                )}
                <div className="popup-open" style={{ margin: "auto", transition: " 0.5s", zIndex: "1" }} id={Id}>
                  <Contents {...data} Resolve={Resolve} />
                </div>
              </div>
            </>
          )}
          {!data.background && (
            <>
              <div
                style={{
                  position: "fixed",
                  top: "50vh",
                  left: "50vw",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {data.canClose && (
                  <>
                    <div
                      onClick={() => {
                        Resolve({ close: true });
                      }}
                      style={{
                        position: "fixed",
                        top: "0px",
                        left: "0px",
                        width: "100vw",
                        height: "100vh",
                      }}
                    />
                  </>
                )}
                <div className="popup-open" style={{ position: "absolute", transition: " 0.5s" }} id={Id}>
                  <Contents {...data} Resolve={Resolve} />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export function Popup() {
  //state
  const [data, setData] = useState([]);
  //resolvers
  const newResolve = (z) => async (Output, resolve) => {
    data[z]?.timer && clearTimeout(data.timer);
    const target = document.getElementById("Popup-" + z);
    const targetBg = document.getElementById("Popup-" + z + "-background");
    if (target) target.style.scale = "0";
    if (targetBg) targetBg.style.opacity = "0";
    await new Promise(Resolve => setTimeout(function () {
      if (target) target.style.scale = "1";
      if (targetBg) targetBg.style.opacity = "1";
      data[z] && data[z].resolve(Output);
      let newArray = [];
      for (let i = 0; i < data.length; i++)if (i != z) newArray.push(data[i]);
      setData(newArray);
      resolve && resolve(Output);
      Resolve(Output);
    }, 500));
  };
  //fire
  Popup.fire = async (inputData = {}) => await new Promise(resolve => {
    if (typeof inputData.z == "undefined") inputData.z = 0;
    let NData = [...data];
    NData[inputData.z] = {
      ...inputData,
      resolve,
      timer: inputData.timer ? setTimeout(() => {
        newResolve(inputData.z)({ timedOut: true }, resolve);
      }, inputData.timer) : null,
    }
    setData([...NData]);
  });
  //close
  Popup.close = async (zIndex = 0) => await newResolve(zIndex)({ closed: true });
  //containers
  return <>
    {data && data.map((_, index) => <Container Id={"Popup-" + index} key={'popup-' + index} data={data[index]} Resolve={newResolve(index)} />)}
  </>;
};
