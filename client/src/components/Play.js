import React, { Component } from 'react';

export class Play extends Component {
  render() {
    return (
      <>
        <div className='cb-wrapper-app'>
          <div className='cb-content phone-layout'>
            <img
              className='mast-head-img'
              src='../images/Masthead-01.png'
              alt='Mast head image is missing'
            />
            <h2 className='cd-text-primary cd-text-capitalize text-center cd-text-3x'>You have a message from someone special</h2>
            <div class='page-navigation'>
              <button className='btn btn-primary margin-auto'>Play Now</button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Play;
