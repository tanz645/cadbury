import React, { Component } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Configs from '../config';

export class QuestionPopup extends Component {

  constructor(props) {
    super(props);

    this.state = {
      answer: '',
      error: ''
    };
    this.saveAnswer = this.saveAnswer.bind(this);
    this.handleAnswer = this.handleAnswer.bind(this);
  }
  handleAnswer(e){
    this.setState({answer:e.target.value, error: ''})
  }

  async saveAnswer() {
    const { navigation } = this.props;
    const token = localStorage.getItem(Configs.local_cache_name);
    if(!this.state.answer){
      this.setState({error: 'answer can not be empty'});
      return ;
    }
    const data = {
      token,
      answer: this.state.answer
    }
    try {
      const result = await fetch(Configs.api + '/customers/question/answer', {
        method: 'POST',        
        headers: {
          'Content-Type': 'application/json'             
        },            
        body: JSON.stringify(data)
      });
      if (result.status >= 400) {
          throw new Error("Bad response from server");
      }
      console.log(result);
      localStorage.removeItem(Configs.local_cache_name);
      navigation('/thankyou');
    } catch (error) {
        console.log(error);
    }
  };

  componentDidMount() {
    const { navigation } = this.props;
    const token = localStorage.getItem(Configs.local_cache_name);
    if (!token) {
      navigation('/')
    }
    fetch(`${Configs.api}/customers/${token}`)
      .then(response => response.json())
      .then(data => {
        if (!data)
          if (data && data.receipt_uploaded !== 'creation_uploaded') {
            navigation('/')
          }
      });
  }

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
              <div className='cb-border-box-golden margin-auto question-box'>
                <h3 className='cd-text-primary question-text'>
                  What is the Cadbury <br /> CNY campaign name ?
                </h3>
                <textarea
                  className='question-popup-textaria'
                  name='question-popup'
                  id='question-popup'                  
                  onChange={this.handleAnswer}
                ></textarea>
                {this.state.error ? <p className="text-red text-small">({this.state.error})</p> : ''}
              </div>
              <div class=''>
                <div className="mb-3">
                  <button className="btn-primary btn margin-auto save-anwser-btn" onClick={this.saveAnswer}>NEXT</button>
                </div>
              </div>
            </div>
            <footer className="text-center text-white text-small">
                <p className="mt-3">Cadbury Confectionery Malaysia Sdn Bhd</p>
            </footer>
          </div>
        </div>
      </>
    );
  }
}

export default function (props) {
  const navigation = useNavigate();
  return <QuestionPopup {...props} navigation={navigation} />;
}
