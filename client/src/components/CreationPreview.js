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
            tapped: false       
        };
        this.renderBufferVideo = this.renderBufferVideo.bind(this);
        this.replay = this.replay.bind(this);
        this.upload = this.upload.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.handleTap = this.handleTap.bind(this);
    }
    
    handleTap(){
        if(!this.state.tapped){
            this.setState({tapped:true}, () => {
                this.state.ae.play();
                this.state.ve.play();
            })
        }        
    }
    replay() {
        URL.revokeObjectURL(this.state.a)
        URL.revokeObjectURL(this.state.v)
        this.props.navigation('/creation')        
    }
    handleEnd(){        
        setTimeout(() => {
            this.state.ae.play();
            this.state.ve.play();
        },100)
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
           <>
           <video className="cb-video-player" id="video-player-view" playsInline>
                <source src={this.state.v} type="video/mp4" />
            </video>
            <audio id="audio-player-view" onEnded={this.handleEnd} playsInline>
                <source src={this.state.a} type="audio/mp3" />                        
            </audio>
            <div className="control-box-buffer">
                <div className="landing-button text-center">
                    <button className="btn btn-primary" onClick={this.replay}>RETAKE</button>
                </div>
                <div className="landing-button">
                    <button className="btn btn-primary" onClick={this.upload}>UPLOAD</button>
                </div>                        
            </div>
           </>
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
        const ae = window.document.getElementById('audio-player-view');
        const ve = window.document.getElementById('video-player-view');        
        if(!a || !v){
            window.location.href = "/";
            return;
        }
        fetch(v).then(r => r.blob())
        .then(vblob => {            
            if(vblob){
                fetch(a).then(r => r.blob())
                .then(ablob => {           
                    ae.src = a;
                    ve.src = v;
                    ae.load() 
                    ve.load()                                                            
                    this.setState({a,v,ablob,vblob, ae, ve })                    
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
            <div className="video-preview-wrapper text-center" onClick={this.handleTap}>
                {!this.state.tapped? <h2 className="tap-on-the-screen">Tap on the screen to replay</h2> : ''}                
                {/* {this.state.v && this.state.a ? this.renderBufferVideo() : ''} */}
                {this.renderBufferVideo()}
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

