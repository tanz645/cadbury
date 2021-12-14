import React, { Component } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from './components/Landing';
import Message from './components/Message';
import Desktop from './components/Desktop';
import Registration from './components/Registration';
import Permission from './components/Permission';
import Creation from './components/Creation';
import CreationPreview from './components/CreationPreview';
import ScrollToTop  from './components/ScrollToTop';
import QuestionPopup  from './components/QuestionPopup';
import Thankyou from './components/Thankyou';
import MessagePlay from './components/MessagePlay';
import Admin from './components/Admin';
import UserCreation from './components/UserCreation';
import ComingSoon from './components/ComingSoon';
import QR from './components/QR';
export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      load: 7
    }
  }
  render() {
    return (
      <BrowserRouter>
        <ScrollToTop>
          <Routes>
            <Route exact path="/"  element={<Landing />} />        
            <Route exact path="/coming-soon"  element={<ComingSoon />} />    
            <Route exact path="/desktop"  element={<Desktop />} />  
            <Route exact path="/registration"  element={<Registration />} />
            <Route exact path="/permission"  element={<Permission />} />            
            <Route exact path="/creation"  element={<Creation />} />
            <Route exact path="/creation-preview"  element={<CreationPreview />} />
            <Route exact path="/question-popup"  element={<QuestionPopup />} />
            <Route exact path="/thankyou"  element={<Thankyou />} />
            <Route exact path="/message"  element={<Message />} />                             
            <Route exact path="/admin"  element={<Admin />} />
            <Route exact path="/user-creation"  element={<UserCreation />} />
            <Route exact path="/qr"  element={<QR />} />
            <Route exact path="/message-play"  element={<MessagePlay />} />            
            <Route path="*" element={<Landing />} />
          </Routes>
        </ScrollToTop>        
      </BrowserRouter>
    )
  }
}

export default App

/* {this.state.load === 0 && <Desktop/>}
        {this.state.load === 1 && <Landing/>}
        {this.state.load === 2 && <Registration/>}
        {this.state.load === 3 && <Loading/>}
        {this.state.load === 4 && <Cangyr/>}
        {this.state.load === 5 && <Userdeny/>}
        {this.state.load === 6 && <Thankyou/>}
        {this.state.load === 7 && <Landing2/>} */