import React, { Component } from 'react';
import { Link } from "react-router-dom";
export class Permission extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.askPermission = this.askPermission.bind(this);
  }

  askPermission() {
    alert(JSON.stringify(navigator))
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
        window.localStream = stream;
        window.localAudio.srcObject = stream;
        window.localAudio.autoplay = true;
      }).catch(err => {
        console.log("u got an error:" + err)
      });
    }
  }

  render() {
    return (
      <>
        <div className='cb-wrapper-app'>
          <div className='cb-content phone-layout'>
            <div className=''>
              <img
                className='mast-head-img'
                src='../images/Masthead-02.png'
                alt='Mast head image is missing'
              />
              <div className='cb-border-box-golden margin-auto'>
                <img
                  className='cam-image img-center cd-img-stamp margin-auto'
                  src='../images/Gold-Camera.png'
                  alt='Family image is missing!'
                />
                <div>
                  <p className='text-center text-white'>
                    'playnow.com' would like <br />
                    to access the Camera and Gyro.
                  </p>
                </div>
              </div>
              <div className="mb-3">
                <Link to="/creation"><button className='btn btn-primary margin-auto mt-3'>OKAY</button></Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Permission;
