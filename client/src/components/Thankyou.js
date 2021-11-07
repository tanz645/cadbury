import React, { Component } from 'react';

export class Thankyou extends Component {
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
            {/* <h2 className='cd-text-primary text-center cd-text-3x'>Thank you</h2> */}
            <img className="cb-img-thank" src="../images/Thank-You.gif" alt="Thank you" />
            <h4 className='cd-text-primary text-center'>
              We have recieved <br />
              your meaningful creation
            </h4>
            <p className='text-center text-white'>
              <strong>winner will be connected shortly</strong>
            </p>
            <div>
              <h2 className='text-center text-white'>
                We will have a little gift shortly!
              </h2>
              <p className='text-center text-white cb-text-small'>
                We will send you gift you through whatsApp link / contact you.
              </p>
              <img
                className='cd-img-stamp margin-auto'
                src='../images/Grab.png'
                alt='Grab image'
              />
              <div class='page-navigation'>
                <button className='btn btn-primary margin-auto'>Share</button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Thankyou;
