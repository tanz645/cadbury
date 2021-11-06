import React, { Component } from 'react'
// import 

// import './App.css';

import Landing from './components/Landing';
import Desktop from './components/Desktop';
import Registration from './components/Registration';
import Loading from './components/Loading';
import Cangyr from './components/Cangyr';
import Userdeny from './components/Userdeny';
import Thankyou from './components/Thankyou';
import Landing2 from './components/Landing2';


export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      load: 7
    }
  }
  render() {
    return (
      <>
        {this.state.load === 0 && <Desktop/>}
        {this.state.load === 1 && <Landing/>}
        {this.state.load === 2 && <Registration/>}
        {this.state.load === 3 && <Loading/>}
        {this.state.load === 4 && <Cangyr/>}
        {this.state.load === 5 && <Userdeny/>}
        {this.state.load === 6 && <Thankyou/>}
        {this.state.load === 7 && <Landing2/>}
      </>
    )
  }
}

export default App
