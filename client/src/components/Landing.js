import React, { Component } from 'react';

export class Landing extends Component {
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
              <img
                className='cd-img-small margin-auto'
                src='../images/Family.png'
                alt='Family image is missing!'
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Landing;
