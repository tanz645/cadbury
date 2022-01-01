import React, { Component } from 'react';

export class Thankyou extends Component {

  constructor(props) {
    super(props);

    this.state = {};
    this.shareLink = this.shareLink.bind(this);
  }

  async shareLink() {
    const canonical = document.querySelector("link[rel=canonical]");
    let url = canonical ? canonical.href : document.location.href;
    console.log(url)
    if (navigator.share) {
      const data = {
        url: 'https://cadbury.cnygiftfromtheheart.com',
        title: 'Cadbury',
        text: 'CNY Gift From The Heart'
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
    } else {
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
              src='../images/Masthead-02.png'
              alt='Mast head image is missing'
            />
            {/* <h2 className='cd-text-primary text-center cd-text-3x'>Thank you</h2> */}
            <img className="cb-img-thank" src="../images/Thank-You.gif" alt="Thank you" />
            <h4 className='cd-text-primary text-center main-msg'>
              We have received <br />
              your meaningful creation.
            </h4>
            <p className='text-center text-white winner-msg'>
              Winners will be contacted shortly.
            </p>
            <div className="">
              <h2 className='text-center text-white margin-zero little-gift'>
                We have a little gift for you!
              </h2>
              <p className='text-center text-white cb-text-small margin-zero'>
                via WhatsApp link / contact you.
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
            <footer className="text-center text-white text-small mt-3">
            <p className="generalTC">
                  <a className="generalTermsAndPrivacy" target="_blank" href="https://my.mondelezinternational.com/privacy-policy">Privacy Policy</a>
                  | 
                  <a className="generalTermsAndPrivacy" target="_blank" href="../Terms_&_Conditions.pdf">Terms and Conditions </a>  
              </p>
              <p className="">© 2021 Mondelēz International. All Rights Reserved.</p>
            </footer>
          </div>
        </div>
      </>
    );
  }
}

export default Thankyou;
