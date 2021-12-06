import React, { Component } from 'react';
import { Link, useNavigate } from "react-router-dom";

export class ComingSoon extends Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      modal: false,
      view: 'landing'
    };
    this.toggleModal = this.toggleModal.bind(this);
    const width = window.innerWidth;
    if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(navigator.userAgent)) || width >= 800) {
      window.location.href = '/desktop'
      console.log("not mobile device");
    }    
  }

  toggleModal() {
    this.setState({ modal: !this.state.modal })
  }

  render() {
    return (
      <>
        <div className='cb-wrapper-app'>
          <div className='cb-content phone-layout'>
            <div className='landing-main-body'>
              <img
                className='mast-head-img'
                src='../images/Masthead-01.png'
                alt='Mast head image is missing'
              />
              <img
                className='landing-family margin-auto'
                src='../images/Family.png'
                alt='Family image is missing!'
              />
              <h2 className='landing-slogan coming-soon-slogan'>
                SOMTHING AWESOME < br/> IS COING SOON!
              </h2>      
              <p className="text-coming-soon-small">The Cadbury Gift From The Heart Campaign will begin on 26 December 2021. 
Get ready and we will see you soon!
</p>               
            </div>
            <footer className="text-center text-white text-small">
                <p className="">©️ 2021 Mondelēz International. All Rights Reserved.</p>
            </footer>
          </div>
        </div>

      </>
    );
  }
}

export default function (props) {
  const navigation = useNavigate();

  return <ComingSoon {...props} navigation={navigation} />;
}

