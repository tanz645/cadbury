import React, { Component } from 'react'

export class Desktop extends Component {
    render() {
        return (
            <div className="desktop">
        <div className="container">
            <div className="cb-wrapper-app row">
                <div className="col-md-5">
                    <div className="masthead-03">
                        <img className="img-masthead-03 cd-img-base" src="../images/Masthead-03.png"
                            alt="Masthead is missing!"/>
                    </div>
                </div>
                <div className="cb-content col-md-3">
                    <div className="heading padding-top-20">
                        <h2 className="text-center">Looks like your're on desktop</h2>
                        <h4 className="text-center">Kindly scan the QR code<br />to praticipate in thee content.</h4>
                    </div>
                    <img className="margin-auto" src="../images/qr.jpeg" alt="cadbury qr code!"/>
                </div>

            </div>
        </div>
    </div>
        )
    }
}

export default Desktop
