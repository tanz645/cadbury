import React, { Component } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import { Link } from 'react-router-dom';
export class Message extends Component {

  constructor(props) {
    super(props);
    this.state = {
        hash: '',        
    };
}

  componentDidMount(){
    const hash = this.props.urlQuery.get('hash');
    if(!hash){
      window.location.href = "/";
      return;
    }
    this.setState({hash:hash})
  }
  render() {
    return (
      <>
        <div className='cb-wrapper-app'>
          <div className='cb-content phone-layout text-center'>
            <img
              className='mast-head-img'
              src='../images/Masthead-01.png'
              alt='Mast head image is missing'
            />
            <img src="../images/Special.gif" alt="Special message" className="special-message-img" />
            <div class='page-navigation'>
              <Link to={`/message-play?hash=${this.state.hash}`}><button className='btn btn-primary margin-auto'>Play Now</button></Link>
            </div>
          </div>
        </div>
      </>
    );
  }
}

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function (props) {
  const navigation = useNavigate();
  const urlQuery = useQuery();
  return <Message {...props} navigation={navigation} urlQuery={urlQuery} />;
}
