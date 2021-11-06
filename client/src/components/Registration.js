import React, { Component } from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";
export class Registration extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
          modal: false,
          view: 'landing'
        };
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.onCaptchaChange = this.onCaptchaChange.bind(this);
        this.hiddenFileInput = React.createRef();
      }

      handleFileUpload(e) {
          e.preventDefault();
        this.hiddenFileInput.current.click();
      }
      
      onCaptchaChange(value) {
        console.log(value)
      }
    render() {
        return (
            <>
                <div className="cb-wrapper-app">
                    <div className="cb-content phone-layout">
                        <div className="">
                            <img className="mast-head-img" src="../images/Masthead-01.png" alt="Mast head image is missing" />
                        </div>
                        <div className="registration-form">
                            <form>
                                <div className="mb-3">
                                    <select className="form-select" aria-label="Default select example">
                                        <option selected>Title</option>
                                        <option value="Mr.">Mr.</option>
                                        <option value="Mrs.">Mrs.</option>                                        
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <input type="text" className="form-control" id="personal-info-name" placeholder="Name (As per IC)" />
                                </div>
                                <div className="mb-3">
                                    <input type="email" className="form-control" id="email1" placeholder="Email (optional)" />
                                </div>
                                <div className="d-flex">
                                    <div className="mb-3 cb-mr-2 flex-fill">
                                        <input type="text" placeholder="Phone Number" className="form-control"
                                            id="exampleInputPassword1" />
                                    </div>
                                    <div className="mb-3 flex-fill">
                                        <input type="date" id="start" className="form-control" name="trip-start" value="2021-07-22"
                                            min="2021-01-01" max="2033-12-31" />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <h2 className="cd-text-primary upload-recipet-text mb-2">Upload my reciept:</h2>
                                    <h5 className="receipt-name">My_recipet.png</h5>
                                    <button className="btn-primary btn mb-2 upload-button" onClick={this.handleFileUpload}>Upload</button>
                                    <input type="file" ref={this.hiddenFileInput} style={{display:'none'}} className="file-upload-button" name="filename" />
                                </div>
                                <div className="terms-condition-box mb-3">
                                    <div>
                                        <input className="text-white" type="checkbox" /> I agree to <a class="termsAndPrivacy" href="">Terms & Condition</a>
                                    </div>
                                    <div>
                                        <input className="text-white" type="checkbox" /> I agree to <a class="termsAndPrivacy" href="">Privacy policy</a>
                                    </div>
                                    <div>
                                        <input className="text-white" type="checkbox" /> Sign me up to receive Cadbury's latest news via email &
                                        WhatsApp
                                        message
                                    </div>
                                </div>                               
                                <div className="mb-3">
                                    <ReCAPTCHA
                                        sitekey="6Lfw-Q8dAAAAAObmc2DS2SuCaQt8Y24R9F8HcGJE"
                                        onChange={this.onCaptchaChange}
                                    />                                                                        
                                </div>
                                <div className="mb-3">
                                    <Link to="/permission"><button className="btn-primary btn margin-auto">NEXT</button></Link>                                    
                                </div>
                            </form>
                        </div>
                    </div>
                </div>                
            </>
        )
    }
}

export default Registration
