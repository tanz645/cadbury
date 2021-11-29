import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Configs from '../config';
export class Creation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filterIds: [
                { icon: 'thumbnails-01.png', path: '../masks/f1' },
                { icon: 'thumbnails-02.png', path: '../masks/f2' },
                { icon: 'thumbnails-03.png', path: '../masks/f3' },
                { icon: 'thumbnails-04.png', path: '../masks/f4' },
                { icon: 'thumbnails-05.png', path: '../masks/f5' },
                { icon: 'thumbnails-06.png', path: '../masks/f6' },
            ],
            deepAR: {},
            recordingStarted: false,
            bufferVideo: '',
            blob: ''
        };
        this.startVideo = this.startVideo.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.startEngine = this.startEngine.bind(this);
        this.renderAr = this.renderAr.bind(this);
        this.renderBufferVideo = this.renderBufferVideo.bind(this);
        this.replay = this.replay.bind(this);
        this.upload = this.upload.bind(this);
    }

    startVideo() {       
        let timeoutID;
        if (this.state.recordingStarted) {
            this.state.deepAR.finishVideoRecording((e) => {
                this.state.deepAR.shutdown();
                clearTimeout(timeoutID);
                this.setState({ bufferVideo: URL.createObjectURL(e), blob: e, recordingStarted: false })
            });
        } else {
            this.setState({ recordingStarted: true }, () => {
                this.state.deepAR.startVideoRecording();
                timeoutID = setTimeout(() => {
                    this.state.deepAR.finishVideoRecording((e) => {
                        this.state.deepAR.shutdown();
                        this.setState({ bufferVideo: URL.createObjectURL(e), blob: e, recordingStarted: false })
                    });
                }, 1000 * 30)
            })
        }

    }

    changeFilter(path) {
        this.state.deepAR.switchEffect(0, 'slot', path, function (e) {
            // effect loaded
            console.log(e)
        });
    }

    startEngine() {
        const deepAR = window.DeepAR({
            licenseKey: '3f92e708616b60122450aeb42226bc9079c4f2fe4edd6fb987d69c78a91b0f3ff070e3c8dcd7bf19',
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight,
            canvas: document.getElementById('deepar-canvas'),
            numberOfFaces: 1, // how many faces we want to track min 1, max 4
            libPath: './lib',
            onInitialize: function () {
                // start video immediately after the initalization, mirror = true
                deepAR.startVideo(true);
                // load the aviators effect on the first face into slot 'slot'
                deepAR.switchEffect(0, 'slot', '../masks/f1', function (e) {
                    // effect loaded
                    console.log(e)
                });
            },
            onCameraPermissionDenied: (e) => {
                console.log(e)
            },
            onVideoStarted: (e) => {
                console.log({ videoStarted: e })
            },
            onError: (e) => {
                console.log('here')
                console.log(e)
            }
        });
        deepAR.downloadFaceTrackingModel('../lib/models/models-68-extreme.bin');
        this.setState({ deepAR })
    }
    replay() {
        this.setState({
            deepAR: {},
            recordingStarted: false,
            bufferVideo: '',
            blob: ''
        }, () => {
            this.startEngine();
        })
    }
    async upload() {                
        const token = localStorage.getItem(Configs.local_cache_name);
        const { navigation } = this.props; 
        if(token && this.state.blob){            
            const formData = new FormData();
            const file = new File([this.state.blob], "creation.mp4", {
                type: this.state.blob.type,
              });
            formData.append('creation', file);
            formData.append('token', token);
            try {
                const result = await fetch(Configs.api + '/customers/creation/upload', {
                    method: 'POST',                               
                    body: formData
                });
                if (result.status >= 400) {
                    throw new Error("Bad response from server");
                }
                console.log(result);
                navigation('/question-popup');
            } catch (error) {
                console.log(error);
            }
            
        }               
    }
    renderBufferVideo() {
        return (
            <div className='cb-wrapper-app'>
                <div className='cb-content phone-layout'>
                    <video className="cb-video-player" autoPlay>
                        <source src={this.state.bufferVideo} type="video/mp4" />
                    </video>
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
    renderAr() {
        return (
            <div className="creation-body">
                <canvas id="deepar-canvas"></canvas>
                <div className="control-box">
                    {!this.state.recordingStarted ?
                        <div className="filter-selection">
                            {this.state.filterIds.map(item => <div key={item.id} className="creation-filter-btn" onClick={() => this.changeFilter(item.path)}><img className="creation-camera-btn" src={`../images/${item.icon}`} /></div>)}
                        </div>
                        : ''
                    }
                    <div className="creation-camera-box" onClick={this.startVideo}>
                        {this.state.recordingStarted ?
                            <img className="creation-camera-btn vdo-run" src="../images/Record.gif" /> :
                            <img className="creation-camera-btn vdo-start" src="../images/White-Camera.png" />}

                    </div>
                </div>
            </div>
        )
    }
    componentDidMount() {        
        this.startEngine();   
    }
    render() {
        return (
            <>
                {this.state.bufferVideo ? this.renderBufferVideo() : this.renderAr()}

            </>
        );
    }
}

export default function (props) {
    const navigation = useNavigate();

    return <Creation {...props} navigation={navigation} />;
}

// export default Creation;
