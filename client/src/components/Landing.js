import React, { Component } from 'react';
import { Link } from "react-router-dom";
export class Landing extends Component {

  constructor(props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      modal: false,
      view: 'landing'
    };
    this.toggleModal = this.toggleModal.bind(this);
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
              <h2 className='landing-slogan'>
                Personalize your Gift <br /> Surprise Your Loved One!
              </h2>
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
                  <span className="modal-close" onClick={this.toggleModal}> x </span>
                  <a className="btn-pay lazada" href="">
                    <img src="../images/Lazada.png" alt="" />
                  </a>
                  <a className="btn-pay shopee" href="">
                    <img src="../images/Shopee.png" alt="" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

      </>
    );
  }
}

export default Landing;
