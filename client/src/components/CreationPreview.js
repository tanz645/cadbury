import React, { Component } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Configs from '../config';
export class CreationPreview extends Component {

    constructor(props) {
        super(props);

        this.state = {                                                         
            a: '',
            v: '',
            uploading: false,            
        };
        this.renderBufferVideo = this.renderBufferVideo.bind(this);
        this.replay = this.replay.bind(this);
        this.upload = this.upload.bind(this);
    }
    replay() {
        URL.revokeObjectURL(this.state.a)
        URL.revokeObjectURL(this.state.v)
        this.props.navigation('/creation')        
    }
    async upload() {
        if (this.state.uploading) {
            return 1;
        }
        this.setState({ uploading: true });
        const token = localStorage.getItem(Configs.local_cache_name);
        const { navigation } = this.props;
        if (token && this.state.vblob) {
            const formData = new FormData();
            const file = new File([this.state.vblob], "creation.mp4", {
                type: this.state.vblob.type,
            });
            const fileAudio = new File([this.state.ablob], "creation_audio.mp3", {
                type: this.state.ablob.type,
            });
            formData.append('creation', file);
            formData.append('creationAudio', fileAudio);
            formData.append('token', token);
            try {
                const result = await fetch(Configs.api + '/customers/creation/upload', {
                    method: 'POST',
                    body: formData
                });
                if (result.status >= 400) {
                    alert("Can not upload video");
                    URL.revokeObjectURL(this.state.v)
                    URL.revokeObjectURL(this.state.a)
                    return;
                }
                URL.revokeObjectURL(this.state.v)
                URL.revokeObjectURL(this.state.a)
                this.setState({ uploading: false });
                navigation('/question-popup');
            } catch (error) {
                this.setState({ uploading: false });
                URL.revokeObjectURL(this.state.v)
                URL.revokeObjectURL(this.state.a)
                console.log(error);
            }

        } else {
            this.setState({ uploading: false });
        }
    }
    renderBufferVideo() {
        return (
            <div className='cb-wrapper-app'>
                <div className='cb-content'>
                    <video className="cb-video-player" autoPlay loop>
                        <source src={this.state.v} type="video/mp4" />
                    </video>
                    <audio autoPlay loop>
                        <source src={this.state.a} type="audio/mp3" />                        
                    </audio>
                    <div className="control-box-buffer">
                        <div className="landing-button text-center">
                            <button className="btn btn-primary" onClick={this.replay}>RETAKE</button>
                        </div>
                        <div className="landing-button">
                            <button className="btn btn-primary" onClick={this.upload}>UPLOAD</button>
                        </div>
                        {/* <img className="creation-buffer-btn replay" src="../images/Replay.png" onClick={this.replay}/>
                        <img className="creation-buffer-btn next" src="../images/Next.png" /> */}
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount() {
        const token = localStorage.getItem(Configs.local_cache_name);        
        if (!token) {
            window.location.href = "/";
            return;
        }        
        const a = this.props.urlQuery.get('a');
        const v = this.props.urlQuery.get('v');
        console.log({a,v})
        if(!a || !v){
            window.location.href = "/";
            return;
        }
        fetch(v).then(r => r.blob())
        .then(vblob => {
            console.log(vblob)
            if(vblob){
                fetch(a).then(r => r.blob())
                .then(ablob => {
                    this.setState({a,v,ablob,vblob})
                }).catch(e => {
                    console.log(e)
                    this.props.navigation('/creation')
                });
            }
        }).catch(e => {
            console.log(e)
            this.props.navigation('/creation')
        });        
    }
    render() {
        return (
            <div className="creation-body">
                {this.state.v && this.state.a ? this.renderBufferVideo() : ''}
            </div>
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
    return <CreationPreview {...props} urlQuery={urlQuery} navigation={navigation} />;
}

