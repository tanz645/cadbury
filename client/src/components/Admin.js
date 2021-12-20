import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {useNavigate} from "react-router-dom";
import { faDownload, faEye, faPrint } from '@fortawesome/free-solid-svg-icons';
import Configs from '../config';

export class Admin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      records: [],
      wantToVerify: false,
    };
    this.renderItems = this.renderItems.bind(this);
    this.handleVerifyRadioButton = this.handleVerifyRadioButton.bind(this);
    this.handleResultRadioButton = this.handleResultRadioButton.bind(this);
    this.reload = this.reload.bind(this);
    this.openReciept = this.openReciept.bind(this);
    this.openPrintPreview = this.openPrintPreview.bind(this);
    this.downloadQR = this.downloadQR.bind(this);

  }

  reload() {
    fetch(`${Configs.api}/customers`)
      .then(response => response.json())
      .then(data => {
        this.setState({ records: data })
      }).catch(e => {
        console.log(e)
      });
  }

  openReciept(item) {
    if (item.receipt_link) {
      window.open(`${Configs.static_files}${item.receipt_link}`, '_blank');
    } else {
      alert('No receipt uploaded')
    }
  }

  openVideo(item) {
    if (item.video_link) {
      window.open(`/user-creation?hash=${item._id}`,"_blank");
    } else {
      alert('No video uploaded')
    }
  }
  async handleResultRadioButton(item, type) {
    if (!item.result_type) {
      let confirmed = false;
      if (window.confirm("Are you sure you want to publish result?")) {
        confirmed = true;
      } else {
        confirmed = false;
      }
      if (confirmed) {
        const data = {
          token: item._id,
          type: type
        }
        try {
          const result = await fetch(Configs.api + '/customers/result-set', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          if (result.status >= 400) {
            const text = await result.text()
            alert(text)
          }
          this.reload()
        } catch (error) {
          alert(error)
        }
      }
    } else {
      alert('Result has been set already')
    }
  }
  async handleVerifyRadioButton(item, type) {
    if (!item.verified) {
      let confirmed = false;
      if (window.confirm("Are you sure you want to verify?")) {
        confirmed = true;
      } else {
        confirmed = false;
      }
      if (confirmed) {
        const data = {
          token: item._id,
          type: type
        }
        try {
          const result = await fetch(Configs.api + '/customers/verify', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          if (result.status >= 400) {
            const text = await result.text()
            alert(text)
          }
          this.reload()
        } catch (error) {
          alert(error)
        }
      }
    } else {
      alert('Already verified')
    }
  }
  downloadQR(id) {    
    window.open(`/qr?hash=${id}&download=true`,"_blank");
  }
  openPrintPreview(id) {    
    window.open(`/qr?hash=${id}`,"_blank");
  }
  componentDidMount() {   
    this.reload()
  }

  renderItems(item, index) {
    return (      
        <tr key={item._id}>
          <td>{index + 1}</td>
          {/* <td>{item._id}</td> */}
          <td>{item.customer_id || ''}</td>
          <td><FontAwesomeIcon className="cursor-pointer" icon={faEye} onClick={() => this.openReciept(item)} /></td>
          <td>{item.journey_state}</td>
          <td>
            <div className="d-flex">
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`verification_${item._id}`} value="aeon" checked={item.verification_type === 'aeon'} onChange={() => this.handleVerifyRadioButton(item, 'aeon', index)} />
              </div>
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`verification_${item._id}`} value="tf" checked={item.verification_type === 'tf'} onChange={() => this.handleVerifyRadioButton(item, 'tf', index)} />
              </div>
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`verification_${item._id}`} value="econsave" checked={item.verification_type === 'econsave'} onChange={() => this.handleVerifyRadioButton(item, 'econsave', index)} />
              </div>
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`verification_${item._id}`} value="nationwide" checked={item.verification_type === 'nationwide'} onChange={() => this.handleVerifyRadioButton(item, 'nationwide', index)} />
              </div>
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`verification_${item._id}`} value="invalid" checked={item.verification_type === 'invalid'} onChange={() => this.handleVerifyRadioButton(item, 'invalid', index)} />
              </div>
            </div>
          </td>          
          <td>{item.verified_at ? new Date(item.verified_at).toLocaleString() : 'N/A'}</td>
          <td className="admin-partion">t</td>
          <td>{item.answer}</td>
          <td><FontAwesomeIcon icon={faEye} className="cursor-pointer" onClick={() => this.openVideo(item)} /></td>
          <td>
            <FontAwesomeIcon className="cursor-pointer" icon={faPrint} onClick={() => this.openPrintPreview(item._id)}/>
            <FontAwesomeIcon className="cursor-pointer" icon={faDownload} onClick={() => this.downloadQR(item._id)}/>
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`result_${item._id}`} value="video" checked={item.result_type === 'video'} onChange={() => this.handleResultRadioButton(item, 'video', index)}/>
              </div>
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`result_${item._id}`} value="bespoke" checked={item.result_type === 'bespoke'} onChange={() => this.handleResultRadioButton(item, 'bespoke', index)}/>
              </div>
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`result_${item._id}`} value="nationwide" checked={item.result_type === 'nationwide'} onChange={() => this.handleResultRadioButton(item, 'nationwide', index)}/>
              </div>
            </div>
          </td>
          <td className="">
            <div>{item.result_set_at ? new Date(item.result_set_at).toLocaleString() : 'N/A'}</div>
          </td>
        </tr>
    )
  }
  render() {
    return (
      <>
        <div className='cb-wrapper-app cb-backend'>         
        <h2>CADBURY GIFT FROM THE HEART</h2>           
          <table className="table table-striped table-hover">
            <thead>
              <tr className="cb-text-primary">
                <td>No.</td>
                <td>SHOPPER ID</td>                
                <td>RECEIPT</td>
                <td>STATE</td>
                <td>
                  <div>VERIFY</div>
                  <div className="d-flex">
                    <div className="flex-fill">
                      <img src="../images/AEON.png" alt="" />
                    </div>
                    <div className="flex-fill">
                      <img src="../images/TF.png" alt="" />
                    </div>
                    <div className="flex-fill">
                      <img src="../images/Econsave.png" alt="" />
                    </div>
                    <div className="flex-fill">
                      <strong className="cb-text-black">Nationwide</strong>
                    </div>
                    <div className="flex-fill">
                      <img src="../images/Invalid.png" alt="" />
                    </div>
                  </div>
                </td>                
                <td>STATUS</td>
                <td className="admin-partion">t</td>
                <td>ANSWER</td>
                <td>VIDEO</td>
                <td>QR CODE<br />(video)</td>
                <td>
                  <div>RESULT</div>
                  <div className="d-flex cb-text-small cb-text-black">
                    <div className="flex-fill">Video</div>
                    <div className="flex-fill">Bespoke</div>
                    <div className="flex-fill">Nationwide</div>
                  </div>
                </td>
                <td>STATUS</td>
              </tr>
            </thead>
            {/*  */}
            <tbody>
              {this.state.records.map((item, index) => {
                return this.renderItems(item, index)
              })}

            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default function (props) {
  const navigation = useNavigate();
  return <Admin {...props} navigation={navigation} />;
}

