import React, { Component } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Configs from '../config';
export class Permission extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    };
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
            <footer className="text-center text-white text-small">
                <p className="mt-4">© 2021 Mondelēz International. All Rights Reserved.</p>
            </footer>
          </div>
        </div>
      </>
    );
  }
}

export default function (props) {
  const navigation = useNavigate();

  return <Permission {...props} navigation={navigation} />;
}

