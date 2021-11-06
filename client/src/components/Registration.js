import React, { Component } from 'react'

export class Registration extends Component {
    render() {
        return (
            <>
                <div className="cb-wrapper-app">
        <div className="cb-content phone-layout">
            <div className="mastdead">
                <img className="mast-head-img" src="../images/Masthead-01.png" alt="Mast head image is missing"/>
            </div>
            <div className="registration-form">
                <form>
                    <div className="mb-3">
                        <select className="form-select" aria-label="Default select example">
                            <option selected>Open this select menu</option>
                            <option value="1">One</option>
                            <option value="2">Two</option>
                            <option value="3">Three</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control" id="personal-info-name" placeholder="Name" />
                    </div>
                    <div className="mb-3">
                        <input type="email" className="form-control" id="email1" placeholder="Email" />
                    </div>
                    <div className="d-flex">
                        <div className="mb-3 cb-mr-2 flex-fill">
                            <input type="text" placeholder="Phone Number" className="form-control"
                                id="exampleInputPassword1" />
                        </div>
                        <div className="mb-3 flex-fill">
                            <input type="date" id="start" className="form-control" name="trip-start" value="2021-07-22"
                                min="2021-01-01" max="2033-12-31"/>
                        </div>
                    </div>
                    <div>
                        <h2 className="cd-text-primary">Upload my reciept:</h2>
                        <input type="file" name="filename"/>
                    </div>
                    <div>
                        <input className="text-white" type="checkbox"/> I agree to <span>Terms & Condition</span>
                    </div>
                    <div>
                        <input className="text-white" type="checkbox"/> I agree to <span>Privacy policy</span>
                    </div>
                    <div>
                        <input className="text-white" type="checkbox"/> Sign me up to receive Cadbury's latest news via email &
                        WhatsApp
                        message
                    </div>
                    <div>
                        <div className="g-recaptcha mt-3 mb-3" data-sitekey="6Lfw-Q8dAAAAAObmc2DS2SuCaQt8Y24R9F8HcGJE">
                        </div>
                    </div>
                    <div>
                        <button className="btn-primary btn margin-auto" >Next</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
            </>
        )
    }
}

export default Registration
