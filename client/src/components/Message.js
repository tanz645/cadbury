import React, { Component } from 'react';

export class Message extends Component {
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
            <img src="../images/Special.gif" alt="Special message" className="margin-auto img-fluid" />
            <div class='page-navigation'>
              <button className='btn btn-primary margin-auto'>Play Now</button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Message;
