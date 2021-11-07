import React, { Component } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from './components/Landing';
import Desktop from './components/Desktop';
import Registration from './components/Registration';
import Permission from './components/Permission';
import PermissionDenied from './components/PermissionDenied';
import Creation from './components/Creation';
import ScrollToTop  from './components/ScrollToTop';
import QuestionPopup  from './components/QuestionPopup';
import Thankyou from './components/Thankyou';
import Message from './components/Message';
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
            <Route path="/desktop"  element={<Desktop />} />  
            <Route path="/registration"  element={<Registration />} />
            <Route path="/permission"  element={<Permission />} />
            <Route path="/permission-required"  element={<PermissionDenied />} /> 
            <Route path="/creation"  element={<Creation />} />                  
            <Route path="/question-popup"  element={<QuestionPopup />} />                  
            <Route path="/thankyou"  element={<Thankyou />} />                  
            <Route path="/message"  element={<Message />} />                  
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