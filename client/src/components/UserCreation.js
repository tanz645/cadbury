import React, { Component } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Configs from '../config';

export class UserCreation extends Component {

  constructor(props) {
    super(props);
    this.state = {
      videoLink: '',
      audioLink: ''
    }    
  }

  componentDidMount() {    
    const hash = this.props.urlQuery.get('hash');

    fetch(`${Configs.api}/customers/${hash}`)
      .then(response => response.json())
      .then(data => {        
        this.setState({ videoLink: Configs.static_files + data.video_link })
      });      
  }

  render() {
    return (
      <>
        <div className='cb-wrapper-app'>
          <div className='cb-content text-center mt-4'>
            {this.state.videoLink ?
              (
                <>
                  <video className="cb-video-player-user-creation" autoPlay controls name="media" id="video-player-view">
                    <source src={this.state.videoLink} type="video/mp4" />                    
                  </video>                  
                </>
              ) : ''}
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
  return <UserCreation {...props} navigation={navigation} urlQuery={urlQuery} />;
}
