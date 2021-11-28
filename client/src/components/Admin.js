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
    this.handleResultRadioButton = this.handleResultRadioButton.bind(this);
    this.reload = this.reload.bind(this);
    this.openReciept = this.openReciept.bind(this);
  }

  reload() {
    fetch(`${Configs.api}/customers`)
      .then(response => response.json())
      .then(data => {
        this.setState({ records: data })
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
      window.open(`${Configs.static_files}${item.video_link}`, '_blank');
    } else {
      alert('No video uploaded')
    }
  }

  async handleResultRadioButton(item, type) {
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

  componentDidMount() {
    const { navigation } = this.props;
    const token = localStorage.getItem(Configs.local_cache_name);
    if (!token) {
      navigation('/')
    }
    this.reload()
  }

  renderItems(item, index) {
    return (
      <>        
        <tr key={item._id}>
          <td>{index + 1}</td>
          <td>{item._id}</td>
          <td><FontAwesomeIcon className="cursor-pointer" icon={faEye} onClick={() => this.openReciept(item)} /></td>
          <td>{item.journey_state}</td>
          <td>
            <div className="d-flex">
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`verification_${item._id}`} value="aeon" checked={item.verification_type === 'aeon'} onChange={() => this.handleResultRadioButton(item, 'aeon', index)} />
              </div>
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`verification_${item._id}`} value="tf" checked={item.verification_type === 'tf'} onChange={() => this.handleResultRadioButton(item, 'tf', index)} />
              </div>
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`verification_${item._id}`} value="econsave" checked={item.verification_type === 'econsave'} onChange={() => this.handleResultRadioButton(item, 'econsave', index)} />
              </div>
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`verification_${item._id}`} value="nationwide" checked={item.verification_type === 'nationwide'} onChange={() => this.handleResultRadioButton(item, 'nationwide', index)} />
              </div>
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`verification_${item._id}`} value="invalid" checked={item.verification_type === 'invalid'} onChange={() => this.handleResultRadioButton(item, 'invalid', index)} />
              </div>
            </div>
          </td>
          <td>{item.promo_code || 'N/A'}</td>
          <td>{item.answer}</td>
          <td><FontAwesomeIcon icon={faEye} className="cursor-pointer" onClick={() => this.openVideo(item)} /></td>
          <td>
            <FontAwesomeIcon icon={faPrint} />
            <FontAwesomeIcon icon={faDownload} />
          </td>
          <td>
            <div className="d-flex">
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`result_${item._id}`} id="flexRadioDefault1" />
              </div>
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`result_${item._id}`} id="flexRadioDefault1" />
              </div>
              <div className="flex-fill form-check">
                <input className="form-check-input" type="radio" name={`result_${item._id}`} id="flexRadioDefault1" />
              </div>
            </div>
          </td>
          <td className="cb-text-small">
            <div>{item.verified_at ? new Date(item.verified_at).toLocaleString() : 'N/A'}</div>
          </td>
        </tr>
      </>

    )
  }
  render() {
    return (
      <>
        <div className='cb-wrapper-app cb-backend'>
          <table className="table table-striped table-hover">
            <thead>
              <tr className="cb-text-primary">
                <td>No.</td>
                <td>SHOPPER ID</td>
                <td>RECIEPT</td>
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
                <td>RM8<br />PROMO<br />CODE</td>
                <td>ANSWER</td>
                <td>VIDEO</td>
                <td>QR CODE<br />(video)</td>
                <td>
                  <div>REASULT</div>
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

