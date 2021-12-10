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
    this.onPlayHandler = this.onPlayHandler.bind(this);
    this.onPauseHandler = this.onPauseHandler.bind(this);
  }

  onPlayHandler(e){
    console.log('start playing')
    const audioEle = window.document.getElementById('audio-player-view');
    audioEle.play()
  }
  onPauseHandler(e){
    console.log('start playing')
    const audioEle = window.document.getElementById('audio-player-view');
    audioEle.pause()
  }

  componentDidMount() {
    const hash = this.props.urlQuery.get('hash');

    fetch(`${Configs.api}/customers/${hash}`)
      .then(response => response.json())
      .then(data => {
        console.log(Configs.static_files + data.video_link)
        this.setState({ videoLink: Configs.static_files + data.video_link, audioLink: Configs.static_files + data.audio_link })
      });      
  }

  render() {
    return (
      <>
        <div className='cb-wrapper-app'>
          <div className='cb-content phone-layout'>
            {this.state.videoLink ?
              (
                <>
                  <video onPlay={this.onPlayHandler} onPause={this.onPauseHandler} className="cb-video-player" autoPlay controls name="media" id="video-player-view">
                    <source src={this.state.videoLink} type="video/mp4" />
                    <source src={this.state.videoLink} type="video/mpeg" />
                    <source src={this.state.videoLink} type="video/ogg" />
                  </video>
                  <audio className="cb-video-player" id="audio-player-view">
                    <source src={this.state.audioLink} type="audio/mp3" />
                    <source src={this.state.audioLink} type="audio/mpeg" />
                  </audio>
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
