import React, { Component } from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import { Link, Navigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Configs from '../config';
export class Registration extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {
            modal: false,
            view: 'landing',
            title: '',
            name: '',
            email: '',
            phone: '',
            terms: false,
            privacy: false,
            news: false,
            captcha: null,
            dob: '',
            reciept: '',
            fileErrorMsg: '',
            submitError: '',
            submitted: false,
        };
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.onCaptchaChange = this.onCaptchaChange.bind(this);
        this.onDateSelect = this.onDateSelect.bind(this);
        this.openDate = this.openDate.bind(this);
        this.onFormElementChange = this.onFormElementChange.bind(this);
        this.fileSelected = this.fileSelected.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.makeStringDots = this.makeStringDots.bind(this);
        this.hiddenFileInput = React.createRef();

    }
    onFormElementChange(e) {        
        if(e.target.name === 'terms' || e.target.name === 'news'){            
            this.setState({ [e.target.name]: !this.state[e.target.name] })
        }else{        
            this.setState({ [e.target.name]: e.target.value })
        }
    }
    fileSelected(event) {                
        if (event.target && event.target.files.length) {
            console.log(event.target.files[0])
            if(event.target.files[0].size > 10485760){
                this.setState({fileErrorMsg: 'Max file size: 10mb', reciept: ''});
                return;
            }
            console.log(event.target.files[0].type )
            if(event.target.files[0].type !== 'image/png' && event.target.files[0].type !== 'image/jpeg' && event.target.files[0].type !== 'application/pdf'){
                this.setState({fileErrorMsg: 'only png/jpg/pdf format', reciept: ''});
                return;
            }
            this.setState({ reciept: event.target.files[0], fileErrorMsg: '' })
        }
    }
    openDate(e) {
        document.getElementById('form-dob').click()
    }
    handleFileUpload(e) {
        e.preventDefault();
        this.hiddenFileInput.current.click();
    }
    onDateSelect(date) {
        console.log(date)
        this.setState({ dob: date })
    }
    onCaptchaChange(value) {
        console.log(value)
    }
    async handleSubmit(e){
        e.preventDefault();
        if(!this.state.reciept){
            this.setState({fileErrorMsg: 'Please upload your reciept'});
            return;
        }
        const hubspotData = {
            submittedAt: Date.now(),
            fields:[
                {
                    "name": "firstname",
                    "value": this.state.name
                },
                {
                    "name": "email",
                    "value": this.state.email
                },
                {
                    "name": "phone",
                    "value": this.state.phone
                },
                {
                    "name": "receipt_number",
                    "value": "test"
                },
                {
                    "name": "agree_to_terms_and_conditions",
                    "value": "true"
                },
                {
                    "name": "sign_me_up_to_receive_emails",
                    "value": "true"
                },
                {
                    "name": "cid",
                    "value": Date.now()
                }
            ]
        }        
        try {
            // const hubspotPost = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${Configs.hubspot.portalId}/${Configs.hubspot.formId}`,{
            //     method: 'POST',        
            //     headers: {
            //     'Content-Type': 'application/json'             
            //     },            
            //     body: JSON.stringify(hubspotData)
            // })
            // if (hubspotPost.status >= 400) {
            //     throw new Error("Bad response from server");
            // }
            // const hubspotResult = await hubspotPost.json();
            // console.log(hubspotResult)
            // fetch(`https://api.hubapi.com/contacts/v1/search/query?q=test&hapikey=eu1-5201-252e-4a0a-b86d-2b813d495bc0`)
            //     .then(response => response.json())
            //     .then(data => {
            //         console.log(data)
            //     });
            const data = {
                "customer_id" : "testasd"
            }
            const response = await fetch(Configs.api + '/customers/register', {
                method: 'POST',        
                headers: {
                  'Content-Type': 'application/json'             
                },            
                body: JSON.stringify(data)
              });
              const result = await response.json();
              const formData = new FormData();
              formData.append('receipt', this.state.reciept);
              formData.append('token', result.token);
              await fetch(Configs.api + '/customers/receipt/upload', {
                method: 'POST',                               
                body: formData
              });              
              localStorage.setItem(Configs.local_cache_name, result.token);
              this.setState({submitError: '', submitted: true});              
        } catch (error) {
            this.setState({submitError: 'Can not process your request', submitted: false})
        }            
    }
    componentDidMount(){
        const token = localStorage.getItem(Configs.local_cache_name);      
        if(token)  {
            this.setState({submitError: '', submitted: true}); 
        }        
    }
    makeStringDots(text){
        if (text.length > 20) {
            return text.substring(0, 20) + " ...";            
        }
        return text
    }
    render() {
        return (
            <>
                {this.state.submitted? <Navigate to="/permission" /> : ''}
                <div className="cb-wrapper-app">
                    <div className="cb-content phone-layout">
                        <div className="">
                            <img className="mast-head-img" src="../images/Masthead-02.png" alt="Mast head image is missing" />
                        </div>
                        <div className="registration-form">
                            <form onSubmit={this.handleSubmit} autoComplete="off">
                                <div className="mb-3 form-ele-box">
                                    <select className="form-select" onChange={this.onFormElementChange} name="title" value={this.state.title} required aria-label="Default select example">
                                        <option value="" disabled selected hidden>Title</option>
                                        <option value="Mr.">Mr.</option>
                                        <option value="Mrs.">Mrs.</option>
                                    </select>
                                </div>
                                <div className="mb-3 form-ele-box">
                                    <input type="text" onChange={this.onFormElementChange} name="name" value={this.state.name} className="form-control" placeholder="Name (As per IC)" required />
                                </div>
                                <div className="mb-3 form-ele-box">
                                    <input type="email" onChange={this.onFormElementChange} name="email" value={this.state.email} className="form-control" placeholder="Email (optional)" />
                                </div>
                                <div className="d-flex">
                                    <div className="mb-3 cb-mr-2 flex-fill form-ele-box">
                                        <input type="text" pattern="\d*" minLength="10" maxLength="11" onChange={this.onFormElementChange} name="phone" value={this.state.phone} placeholder="Phone No." className="form-control" required />
                                    </div>
                                    <div className="mb-3 flex-fill form-ele-box">
                                        {/* <input type="date" id="form-dob" className="form-control" name="dob" value="test"
                                            min="1900-01-01" max="2022-01-01" /> */}
                                        <DatePicker selected={this.state.dob} onChange={this.onDateSelect} showYearDropdown yearDropdownItemNumber={121} scrollableYearDropdown={true} minDate={new Date('1800-01-01')} maxDate={new Date()} id="form-dob" />
                                        <img src="../images/Calendar.png" className="form-cal-icon" alt="" onClick={this.openDate} />
                                        {!this.state.dob ? <div className="date-placeholder" onClick={this.openDate}>Birthday <br /> (optional)</div> : ''}
                                    </div>
                                </div>
                                <div className="mb-3 form-ele-box d-flex">
                                    <div className="flex-fill">
                                        <h2 className="cd-text-primary upload-recipet-text mb-2">Upload my reciept:</h2>
                                        {this.state.reciept && this.state.reciept.name ? <h5 className="receipt-name">{this.makeStringDots(this.state.reciept.name)}</h5> : ''}
                                    </div>
                                    <div className="flex-fill text-right">
                                        <button className="btn-primary btn mb-2 upload-button" onClick={this.handleFileUpload}>Upload</button>
                                        <input type="file" ref={this.hiddenFileInput} onChange={this.fileSelected} style={{ display: 'none' }} className="file-upload-button" name="receipt" />
                                    </div>                                                                                                            
                                </div>
                                <div>{this.state.fileErrorMsg ? <p className="text-red text-small">({this.state.fileErrorMsg})</p> : ''}</div>
                                <div className="terms-condition-box mb-3 form-ele-box">
                                    <div>
                                        <input className="text-white" onChange={this.onFormElementChange} name="terms" value={this.state.terms} type="checkbox" required /> I agree to <a className="termsAndPrivacy" target="_blank" href="../tandc.pdf">Terms & Condition </a> and <a className="termsAndPrivacy" target="_blank" href="https://my.mondelezinternational.com/privacy-policy">Privacy policy</a>
                                    </div>                                    
                                    <div>
                                        <input className="text-white" onChange={this.onFormElementChange} name="news" value={this.state.news} type="checkbox" required /> I agree to be contacted via WhatsApp and/or Email
                                    </div>
                                </div>
                                <div className="mb-3 form-ele-box">
                                    {/* <ReCAPTCHA
                                        sitekey="6Lfw-Q8dAAAAAObmc2DS2SuCaQt8Y24R9F8HcGJE"
                                        onChange={this.onCaptchaChange}
                                    /> */}
                                </div>
                                <div className="mb-3 form-ele-box">
                                    {/* <Link to="/permission"><button className="btn-primary btn margin-auto">NEXT</button></Link> */}
                                    <input type="submit" className="btn-primary btn margin-auto" value="NEXT"/>
                                    {this.state.submitError ? <p className="text-red text-small">({this.state.submitError})</p> : ''}
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
