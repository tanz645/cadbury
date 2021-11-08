import React, { Component } from 'react';

export class Player extends Component {
  render() {
    return (
      <>
        <div className='cb-wrapper-app'>
          <div className='cb-content phone-layout'>
            <video className="cb-video-player" controls>
              <source src="https://www.youtube.com/watch?v=xs6lHOUrP0o&t=331s" type="video/mp4" />
            </video>
          </div>
        </div>
      </>
    );
  }
}

export default Player;
