import React, { Component } from 'react';

export class Cangyr extends Component {
  render() {
    return (
      <>
        <div className='cb-wrapper-app'>
          <div className='cb-content phone-layout'>
            <div className='mastdead'>
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
                    to access the Ccamera and Goro.
                  </p>
                </div>
              </div>
              <button className='btn btn-primary margin-auto mt-3'>OKAY</button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Cangyr;
