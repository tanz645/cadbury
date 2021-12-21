import React, { Component } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Configs from '../config';

export class Landing extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      view: 'landing'
    };
    localStorage.removeItem(Configs.local_cache_name);
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
                src='../images/Gift-Family.gif'
                alt='Family image is missing!'
              />              
              <p className="require-min-purchase" >*requires min purchase of <br /> RM 15 of Cadbury products</p>
              <div className="landing-buttons">
                <div className="landing-button">                  
                  <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={this.toggleModal}>PURCHASE</button>
                </div>
                <div className="landing-button">
                  <Link to="registration"><button className="btn btn-primary">NEXT</button></Link>
                </div>
              </div>
              <div className={this.state.modal ? "landing-modal show" : "landing-modal"} >
                <div className="modal-body">
                  <span className="modal-close" onClick={this.toggleModal}> <img src="../images/Close.png" alt="" /> </span>
                  <a className="btn-pay lazada" target="_blank" href="https://www.lazada.com.my/mondelez/?spm=a2o4k.storeSpmB.0.0.350c63e0FOfRbm&q=All-Products&shop_category_ids=1091932&from=wangpu&sc=KVUG">
                    <img src="../images/Lazada.png" alt="" />
                  </a>
                  <a className="btn-pay shopee" target="_blank" href="https://shopee.com.my/shop/59165532/search?shopCollection=127446465">
                    <img src="../images/Shopee.png" alt="" />
                  </a>
                </div>
              </div>
              <footer className="text-center text-white text-small">
                <p className="generalTC">
                    <a className="generalTermsAndPrivacy" target="_blank" href="https://my.mondelezinternational.com/privacy-policy">Privacy Policy</a>
                    | 
                    <a className="generalTermsAndPrivacy" target="_blank" href="../Terms_&_Conditions.pdf">Terms and Conditions </a>  
                  </p>
                  <p className="">© 2021 Mondelēz International. All Rights Reserved.</p>
              </footer>            
            </div>            
          </div>
          
        </div>

      </>
    );
  }
}

export default function (props) {
  const navigation = useNavigate();

  return <Landing {...props} navigation={navigation} />;
}

