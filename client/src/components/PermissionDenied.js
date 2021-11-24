import React, { Component } from 'react';

export class PermissionDenied extends Component {
  render() {
    return (
      <>
        <div className="cb-wrapper-app">
        <div className="cb-content phone-layout">
            <div className="mastdead">
                <img className="mast-head-img" src="../images/Masthead-02.png" alt="Mast head image is missing" />
                <div className="cb-border-box-golden margin-auto">
                    <strong className="text-white text-center mb-4">
                        You have to allow ‘playnow.my’
                        <br />to access the Camera and Gyro
                        <br />to continue the
                        experience.
                    </strong>
                    <strong className="text-white text-center mb-4">
                        Please click on the <img className="cd-intext-icon" src="../images/Lock.png" alt="" /> or <img
                            className="cd-intext-icon" src="../images/No-Camera.png" alt="" /> icon on
                        <br />your browser search bar and
                        <br />follow these steps :-
                    </strong>
                    <ul className="text-white text-center list-group">
                        <li>1) Click on Permission</li>
                        <li>2) Click on allow Camera</li>
                        <li>3) Refresh webpage</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
      </>
    );
  }
}

export default PermissionDenied;
