import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee } from '@fortawesome/free-solid-svg-icons'

export class Backend extends Component {
  render() {
    return (
      <>
        <div className='cb-wrapper-app cb-backend'>
          <table class="table table-striped table-hover">
            <thead>
              <tr className="cb-text-primary">
                <td>No.</td>
                <td>SHOPPER ID</td>
                <td>RECIEPT</td>
                <td>
                  <div>VEERIFY</div>
                  <div class="d-flex">
                    <div class="flex-fill">
                      
                      <FontAwesomeIcon icon={faCoffee} />
                    </div>
                    <div class="flex-fill">i</div>
                    <div class="flex-fill">i</div>
                    <div class="flex-fill">i</div>
                    <div class="flex-fill">i</div>
                  </div>
                </td>
                <td>RM8<br />PROMO<br />CODE</td>
                <td>ANSWERS</td>
                <td>VIDEO</td>
                <td>QR CODE<br />(video)</td>
                <td>
                    <div>REASULT</div>
                    <div class="d-flex cb-text-small cb-text-black">
                      <div class="flex-fill">Video</div>
                      <div class="flex-fill">Bespoke</div>
                      <div class="flex-fill">Nationwide</div>
                    </div>
                </td>
                <td>STATUS</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>3</td>
                <td>cdm100003</td>
                <td>e</td>
                <td>
                  <div class="d-flex">
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                  </div>
                </td>
                <td>bkh13%e</td>
                <td>Gift from the heart</td>
                <td>e</td>
                <td>d/p</td>
                <td>
                  <div class="d-flex">
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                  </div>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>3</td>
                <td>cdm100003</td>
                <td>e</td>
                <td>
                  <div class="d-flex">
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                  </div>
                </td>
                <td>bkh13%e</td>
                <td>Gift from the heart</td>
                <td>e</td>
                <td>d/p</td>
                <td>
                  <div class="d-flex">
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                  </div>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>3</td>
                <td>cdm100003</td>
                <td>e</td>
                <td>
                  <div class="d-flex">
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                  </div>
                </td>
                <td>bkh13%e</td>
                <td>Gift from the heart</td>
                <td>e</td>
                <td>d/p</td>
                <td>
                  <div class="d-flex">
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                    <div class="flex-fill">t</div>
                  </div>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default Backend;
