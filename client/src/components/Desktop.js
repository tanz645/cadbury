import React, { Component } from 'react'

export class Desktop extends Component {
    render() {
        return (
            <div className="desktop">
                <div className="container">
                    <div className="cb-wrapper-app row">
                        <div className="col-md-7">
                            <div className="masthead-03">
                                <img className="img-masthead-03 cd-img-base" src="../images/Masthead-03.png"
                                    alt="Masthead is missing!" />
                            </div>
                        </div>
                        <div className="cb-content col-md-3">
                            <div className="heading padding-top-20">
                                <h2 className="text-center looks-like">LOOK'S LIKE YOU'RE ON DESKTOP</h2>
                                <h4 className="text-center">Scan QR code to participate.</h4>
                            </div>
                            <img className="margin-auto desktop-qr" src="../images/qr.jpeg" alt="cadbury qr code!" />
                        </div>
                        <div className="cb-content col-md-2 text-right">
                            <img className="desktop-cadbury-pour" src="../images/CDM.png" alt="cadbury qr code!" />
                        </div>
                        <footer className="text-center text-white text-small">
                            <p className="">© 2021 Mondelēz International. All Rights Reserved.</p>
                        </footer>
                    </div>
                    
                </div>
            </div>
        )
    }
}

export default Desktop
