import React, { Component } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Configs from '../config';
export class MessagePlay extends Component {

    constructor(props) {
        super(props);

        this.state = {
            audioLink: '',
            videoLink: '',
            videoEnded: false
        };
        this.handleVideoEnd = this.handleVideoEnd.bind(this);
        this.replay = this.replay.bind(this);
    }

    handleVideoEnd(e) {
        this.setState({ videoEnded: true })
    }

    replay(){
        const vd = window.document.getElementById('vd-palyer');
        const au = window.document.getElementById('au-palyer');
        
        this.setState({videoEnded:false}, () => {
            vd.play();
            au.play();
        })
    }    
    componentDidMount() {
        const hash = this.props.urlQuery.get('hash');
        if (!hash) {
            window.location.href = "/";
            return;
        }
        fetch(`${Configs.api}/customers/${hash}`)
            .then(response => response.json())
            .then(data => {
                console.log(Configs.static_files + data.video_link)
                this.setState({ videoLink: Configs.static_files + data.video_link, audioLink: Configs.static_files + data.audio_link })
            }).catch(err => {
                console.log(err)
            });
    }
    render() {
        return (
            this.state.videoLink ? (
                <div className="message-play-wrapper">
                    <video className="mp-video-player" autoPlay muted onEnded={this.handleVideoEnd} id="vd-palyer">
                        <source src={this.state.videoLink} type="video/mp4" />
                    </video>
                    <audio autoPlay id="au-palyer">
                        <source src={this.state.audioLink} type="audio/mp3" />
                    </audio>
                    {this.state.videoEnded ? (
                        <div className="control-box-buffer text-center">
                            <div className="message-play-button" onClick={this.replay}>
                                <img
                                    className=''
                                    src='../images/Replay.png'
                                    alt='Mast head image is missing'
                                />
                            </div>
                            <a href={this.state.videoLink} download>
                                <div className="message-play-button">
                                    <img
                                        className='dwn'
                                        src='../images/White-Download.png'
                                        alt='Mast head image is missing'
                                    />
                                </div> 
                            </a> 
                            <a href='/'>
                                <div className="message-play-button">
                                    <img
                                        className=''
                                        src='../images/Next.png'
                                        alt='Mast head image is missing'
                                    />
                                </div> 
                            </a>                            
                        </div>
                    ) : ''}
                </div>
            ) : ''
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
    return <MessagePlay {...props} urlQuery={urlQuery} navigation={navigation} />;
}

