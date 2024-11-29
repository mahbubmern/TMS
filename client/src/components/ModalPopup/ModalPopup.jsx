

const ModalPopup = ({target, children}) => {
  return (
    <>
      <div
        className="modal fade"
        id={target}
        aria-hidden="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Specialities</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
             {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalPopup;
