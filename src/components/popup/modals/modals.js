import "./modals.scss";


export default function Modal({ modalData, Resolve }) {
  return (
    <div className={"modals-" + modalData.variant}>
      {(() => {
        switch (modalData.variant) {

          default:
            throw new Error(
              "invalid variant {" + modalData.variant + "} for popup modal"
            );
        }
      })()}
    </div>
  );
}
