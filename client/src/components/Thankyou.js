import React, { Component } from 'react';

export class Thankyou extends Component {

  constructor(props) {
    super(props);       
   
    this.state = {};
    this.shareLink = this.shareLink.bind(this);
}

  async shareLink(){
    const canonical = document.querySelector("link[rel=canonical]");
  let url = canonical ? canonical.href : document.location.href;
  console.log(url)
    if(navigator.share){
      const data ={
        url: 'google.com',
        title: 'Teting share',
        text: 'shared my link'
      }
      try {
        await navigator
          .share(data)
          .then(() =>
            console.log("Hooray! Your content was shared to tha world")
          );
      } catch (error) {
        console.log(`Oops! I couldn't share to the world because: ${error}`);
      }
    }else{
      alert('share not supported')
    }
  }
  render() {
    return (
      <>
        <div className='cb-wrapper-app thankyou'>
          <div className='cb-content phone-layout'>
            <img
              className='mast-head-img'
              src='../images/Masthead-01.png'
              alt='Mast head image is missing'
            />
            {/* <h2 className='cd-text-primary text-center cd-text-3x'>Thank you</h2> */}
            <img className="cb-img-thank" src="../images/Thank-You.gif" alt="Thank you" />
            <h4 className='cd-text-primary text-center main-msg'>
              We have recieved <br />
              your meaningful creation
            </h4>
            <p className='text-center text-white winner-msg'>
              <strong>winner will be connected shortly</strong>
            </p>
            <div className="">
              <h2 className='text-center text-white margin-zero little-gift'>
                We will have a little gift shortly!
              </h2>
              <p className='text-center text-white cb-text-small margin-zero'>
                We will send you gift you through whatsApp link / contact you.
              </p>
              <img
                className='cd-img-stamp margin-auto'
                src='../images/Grab.png'
                alt='Grab image'
              />              
            </div>
            <div class=''>
                <button className='btn btn-primary margin-auto share-btn' onClick={this.shareLink}>Share</button>
              </div>
          </div>
        </div>
      </>
    );
  }
}

export default Thankyou;
