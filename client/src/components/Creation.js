import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Configs from '../config';
export class Creation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filterIds: [
                { icon: 'thumbnails-01.png', path: '../masks/a1' },
                { icon: 'thumbnails-02.png', path: '../masks/a2' },
                { icon: 'thumbnails-03.png', path: '../masks/a3' },
                { icon: 'thumbnails-04.png', path: '../masks/a4' },
                { icon: 'thumbnails-05.png', path: '../masks/a5' },
                { icon: 'thumbnails-06.png', path: '../masks/a6' },
            ],
            deepAR: {},
            activeFilter: 'thumbnails-01.png',
            recordingStarted: false,
            bufferVideo: '',
            blob: '',
            uploading: false,
            initialized: false
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
                this.setState({ bufferVideo: URL.createObjectURL(e), blob: e, recordingStarted: false, initialized: false })
            });
        } else {
            this.setState({ recordingStarted: true }, () => {
                this.state.deepAR.startVideoRecording();
                timeoutID = setTimeout(() => {
                    this.state.deepAR.finishVideoRecording((e) => {
                        this.state.deepAR.shutdown();
                        this.setState({ bufferVideo: URL.createObjectURL(e), blob: e, recordingStarted: false, initialized: false })
                    });
                }, 1000 * 30)
            })
        }

    }

    changeFilter(item) {
        this.setState({ activeFilter: item.icon })
        this.state.deepAR.switchEffect(0, 'slot', item.path);
    }

    startEngine() {
        const deepAR = window.DeepAR({
            licenseKey: '3f92e708616b60122450aeb42226bc9079c4f2fe4edd6fb987d69c78a91b0f3ff070e3c8dcd7bf19',
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight,
            canvas: document.getElementById('deepar-canvas'),
            numberOfFaces: 1, // how many faces we want to track min 1, max 4
            libPath: './lib',
            onInitialize:  () => {
                // start video immediately after the initalization, mirror = true
                deepAR.startVideo(true);
                // load the aviators effect on the first face into slot 'slot'
                deepAR.switchEffect(0, 'slot', '../masks/a1', function (e) {
                    // effect loaded
                    console.log(e)
                });
                this.setState({ initialized: true })
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
        if (this.state.uploading) {
            return 1;
        }
        this.setState({ uploading: true });
        const token = localStorage.getItem(Configs.local_cache_name);
        const { navigation } = this.props;
        if (token && this.state.blob) {
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
                this.setState({ uploading: false });
                navigation('/question-popup');
            } catch (error) {
                this.setState({ uploading: false });
                console.log(error);
            }

        } else {
            this.setState({ uploading: false });
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
                <canvas id="deepar-canvas" style={this.state.initialized ? {opacity: 1}: {opacity:0}}></canvas>
                {this.state.initialized ?
                    (
                        <div className="control-box">
                            {!this.state.recordingStarted ?
                                <div className="filter-selection">
                                    {this.state.filterIds.map(item => <div key={item.icon} className={`creation-filter-btn${this.state.activeFilter === item.icon ? ' active' : ''}`} onClick={() => this.changeFilter(item)}><img className="creation-camera-btn" src={`../images/${item.icon}`} /></div>)}
                                </div>
                                : ''
                            }
                            <div className="creation-camera-box" onClick={this.startVideo}>
                                {this.state.recordingStarted ?
                                    <img className="creation-camera-btn vdo-run" src="../images/Record.gif" /> :
                                    <img className="creation-camera-btn vdo-start" src="../images/White-Camera.png" />}

                            </div>
                        </div>
                    )
                    : ''}

            </div>
        )
    }
    componentDidMount() {
        const { navigation } = this.props;
        const token = localStorage.getItem(Configs.local_cache_name);
        if (!token) {
            window.location.href = "/";
            return;
        }
        fetch(`${Configs.api}/customers/${token}`)
            .then(response => response.json())
            .then(data => {
                if (!data) {
                    window.location.href = "/";
                    return;
                } else {
                    this.startEngine();
                }
            });
        // navigator.mediaDevices.getUserMedia({video: false, audio: true}).then( stream => {
        //     window.localStream = stream; // A
        //     window.localAudio.srcObject = stream; // B
        //     window.localAudio.autoplay = true; // C
        // }).catch( err => {
        //     console.log("u got an error:" + err)
        // });           
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
