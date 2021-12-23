import React, { Component } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Configs from '../config';
export class MessagePlay extends Component {

    constructor(props) {
        super(props);

        this.state = {           
            videoLink: '',
            videoEnded: false,
            tapped: false,
            vd: null,           
        };
        this.handleVideoEnd = this.handleVideoEnd.bind(this);
        this.replay = this.replay.bind(this);
        this.handleTap = this.handleTap.bind(this);
    }

    handleTap() {
        if (!this.state.tapped) {            
            this.setState({ tapped: true}, () => {                
                this.state.vd.play();
            })
        }
    }

    handleVideoEnd(e) {
        console.log('video ended')
        this.setState({ videoEnded: true })
    }

    replay() {
        this.setState({ videoEnded: false, }, () => {
            this.state.vd.play();            
        })
    }
    componentDidMount() {
        const width = window.innerWidth;
        if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i.test(navigator.userAgent)) || width >= 800) {
            window.location.href = '/desktop'
            console.log("not mobile device");
        } 
        const hash = this.props.urlQuery.get('hash');
        if (!hash) {
            window.location.href = "/";
            return;
        }
        const vd = window.document.getElementById('vd-palyer');       
        fetch(`${Configs.api}/customers/${hash}`)
            .then(response => response.json())
            .then(data => {     
                vd.src = Configs.static_files + data.video_link;
                vd.load();             
                this.setState({
                    videoLink: Configs.static_files + data.video_link,                    
                    vd
                })
            }).catch(err => {
                console.log(err)
            });
    }
    renderVd() {
        return (
            <>
                <video className="mp-video-player" playsInline id="vd-palyer" controls onEnded={this.handleVideoEnd}>
                    <source src={this.state.videoLink} type="video/mp4" />
                </video>                
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
            </>
        );
    }

    render() {
        return (
            <div className="message-play-wrapper text-center" onClick={this.handleTap}>
                {!this.state.tapped ? <h2 className="tap-on-the-screen">Tap on the screen to replay</h2> : ''}
                {/* {this.state.videoLink ? this.renderVd() : ''} */}
                {this.renderVd()}
            </div>
        )
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

