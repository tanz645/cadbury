import React, { Component } from 'react';
import { Link } from "react-router-dom";

export class QuestionPopup extends Component {
  render() {
    return (
      <>
        <div className='cb-wrapper-app'>
          <div className='cb-content phone-layout'>
            <div className='mastdead'>
              <img
                className='mast-head-img'
                src='../images/Masthead-02.png'
                alt='Mast head image is missing'
              />
              <div className='cb-border-box-golden margin-auto'>
                <h3 className='cd-text-primary'>
                  What is the Cadbury <br /> CNY campaign name?
                </h3>
                <textarea
                  className='question-popup-textaria'
                  name='question-popup'
                  id='question-popup'
                  cols='30'
                  rows='6'
                ></textarea>
              </div>
              <div class='page-navigation'>
                <div className="mb-3">
                  <Link to="/thankyou"><button className="btn-primary btn margin-auto">NEXT</button></Link>                                    
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default QuestionPopup;
