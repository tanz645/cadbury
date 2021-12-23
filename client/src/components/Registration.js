import React, { Component } from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import { Link, Navigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Configs from '../config';

const hubspotCookie = () => {
    return window.document.cookie.replace(/(?:(?:^|.*;\s*)hubspotutk\s*\=\s*([^;]*).*$)|^.*$/, "$1");
}
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
            captcha: '',
            dob: '',
            reciept: '',
            fileErrorMsg: '',
            submitError: '',
            cid: '',
            submitted: false,
            submitStarted: false,            
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
        this.setState({captcha: value})
    }
    async handleSubmit(e){
        e.preventDefault();
        if(this.state.submitStarted){
            return 1;
        }
        if(!this.state.captcha){
            alert('Please verify using captcha')
            return;
        }
        this.setState({submitStarted: true});                
        if(!this.state.reciept){
            this.setState({fileErrorMsg: 'Please upload your reciept', submitStarted: false});
            return;
        }
        const hutk = hubspotCookie() || '';
        const cid = window.document.cookie.match(/_ga=(.+?);/)[1].split('.').slice(-2).join(".") || '';
        const hubspotData = {
            submittedAt: Date.now(),
            fields:[
                {
                    "name": "title",
                    "value": this.state.title
                },
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
                    "name": "agree_to_terms_and_conditions",
                    "value": "true"
                },
                {
                    "name": "sign_me_up_to_receive_emails",
                    "value": "true"
                },
                {
                    "name": "cid",
                    "value": cid
                }
            ],
            context: {                
                "pageUri": "cadbury.cnygiftfromtheheart.com/registration",
                "pageName": "Registration page"
            }
        }     
        if(this.state.dob){
            hubspotData.fields.push({
                "name": "date_of_birth",
                "value": this.state.dob.toString()
            })
        }   
        if(hutk){
            hubspotData.context.hutk = hutk
        }
        try {
            fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${Configs.hubspot.portalId}/${Configs.hubspot.formId}`,{
                method: 'POST',        
                headers: {
                'Content-Type': 'application/json'             
                },            
                body: JSON.stringify(hubspotData)
            })                                  
            const data = {
                "cid" : cid,
                "captcha": this.state.captcha
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
              this.setState({submitError: '', submitted: true, submitStarted: false});              
        } catch (error) {
            this.setState({submitError: 'Can not process your request', submitted: false, submitStarted: false})
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
                                        <option value="Ms.">Ms.</option>
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
                                        <DatePicker dateFormat="dd/MM/yy" selected={this.state.dob} onChange={this.onDateSelect} showYearDropdown yearDropdownItemNumber={121} scrollableYearDropdown={true} minDate={new Date('1800-01-01')} maxDate={new Date()} id="form-dob" />
                                        <img src="../images/Calendar.png" className="form-cal-icon" alt="" onClick={this.openDate} />
                                        {!this.state.dob ? <div className="date-placeholder" onClick={this.openDate}>Birthday <br /> (optional)</div> : ''}
                                    </div>
                                </div>
                                <div className="mb-3 form-ele-box d-flex">
                                    <div className="flex-fill">
                                        <h2 className="cd-text-primary upload-recipet-text mb-2">Upload my receipt:</h2>
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
                                        <input className="text-white" onChange={this.onFormElementChange} name="terms" value={this.state.terms} type="checkbox" required /> I agree to <a className="termsAndPrivacy" target="_blank" href="../Terms_&_Conditions.pdf">Terms & Conditions </a> and <a className="termsAndPrivacy" target="_blank" href="https://my.mondelezinternational.com/privacy-policy">Privacy Policy</a>
                                    </div>                                    
                                    <div>
                                        <input className="text-white" onChange={this.onFormElementChange} name="news" value={this.state.news} type="checkbox" required /> I agree to be contacted via WhatsApp and/or Email
                                    </div>
                                </div>
                                <div className="mb-3 form-ele-box">
                                    <ReCAPTCHA
                                        sitekey="6Lf7VaUdAAAAAHLabJlpTrfefzqcKwxovMHEMDUZ"
                                        onChange={this.onCaptchaChange}
                                    />
                                </div>
                                <div className="mb-3 form-ele-box">
                                    {/* <Link to="/permission"><button className="btn-primary btn margin-auto">NEXT</button></Link> */}
                                    <input type="submit" className="btn-primary btn margin-auto" value="NEXT"/>
                                    {this.state.submitError ? <p className="text-red text-small">({this.state.submitError})</p> : ''}
                                </div>
                            </form>
                            <footer className="text-center text-white text-small mt-4">
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
        )
    }
}

export default Registration
