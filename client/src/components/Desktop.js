import React, { Component } from 'react'

export class Desktop extends Component {
    render() {
        return (
            <div className="desktop">
                <div className="container">
                    <div className="cb-wrapper-app row">
                        <div className="col-md-6">
                            <div className="masthead-03">
                                <img className="img-masthead-03 cd-img-base" src="../images/Masthead-03.png"
                                    alt="Masthead is missing!" />
                            </div>
                        </div>
                        <div className="cb-content col-md-2">
                            <div className="heading padding-top-20">
                                <h2 className="text-center">LOOKS LIKE YOU'RE ON DESKTOP</h2>
                                <h4 className="text-center">Scan QR code to praticipate.</h4>
                            </div>
                            <img className="margin-auto desktop-qr img-fluid" src="../images/qr.jpeg" alt="cadbury qr code!" />
                        </div>
                        <div className="cb-content col-md-4 text-right">
                            <img className="desktop-cadbury-pour" src="../images/CDM.png" alt="cadbury qr code!" />
                        </div>
                        <footer className="text-center text-white text-small">
                            <p className="">Cadbury Confectionery Malaysia Sdn Bhd</p>
                        </footer>
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default Desktop
