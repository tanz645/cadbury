import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Configs from '../config';
import MicRecorder from 'mic-recorder-to-mp3';
import PermissionDenied from './PermissionDenied';

let filterBuffers = {};
export class Creation extends Component {

    constructor(props) {
        super(props);

        this.state = {
            filterIds: [
                { icon: 'thumbnails-01.png', path: 'masks/a1' },
                { icon: 'thumbnails-02.png', path: 'masks/a2' },
                { icon: 'thumbnails-03.png', path: 'masks/a3' },
                { icon: 'thumbnails-04.png', path: 'masks/a4' },
                { icon: 'thumbnails-05.png', path: 'masks/a5' },
                { icon: 'thumbnails-06.png', path: 'masks/a6' },
            ],
            Mp3Recorder: '',
            filterBinary: [],
            deepAR: {},
            activeFilter: 'thumbnails-01.png',
            recordingStarted: false,
            initialized: false,
            permissionDenied: false,
        };
        this.startVideo = this.startVideo.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.startEngine = this.startEngine.bind(this);
        this.renderAr = this.renderAr.bind(this);
    }

    startVideo() {
        let timeoutID;
        if (this.state.recordingStarted) {
            this.state.deepAR.finishVideoRecording((e) => {
                console.log(e)
                this.state.Mp3Recorder.stop().getMp3().then(([buffer, Audioblob]) => {
                    this.state.deepAR.shutdown();
                    clearTimeout(timeoutID);                                         
                    const vid = URL.createObjectURL(e);
                    const aud = URL.createObjectURL(Audioblob);                    
                    setTimeout(() => {
                        this.props.navigation(`/creation-preview?v=${vid}&a=${aud}`);
                        return;
                    },200)
                    
                });
            });
        } else {
            this.setState({ recordingStarted: true }, () => {
                this.state.deepAR.startVideoRecording();
                this.state.Mp3Recorder.start();
                timeoutID = setTimeout(() => {
                    this.state.deepAR.finishVideoRecording((e) => {
                        this.state.Mp3Recorder.stop().getMp3().then(([buffer, Audioblob]) => {
                            this.state.deepAR.shutdown();
                            clearTimeout(timeoutID);
                            this.props.navigation(`/creation-preview?v=${URL.createObjectURL(e)}&a=${URL.createObjectURL(Audioblob)}`);
                            return;
                        });
                    });
                }, 1000 * 30)
            })
        }

    }

    changeFilter(item) {
        if (filterBuffers[item.icon]) {
            this.state.deepAR.switchEffectByteArray(0, 'slot', filterBuffers[item.icon]);
            this.setState({ activeFilter: item.icon })
        }
    }

    startEngine() {
        const deepAR = window.DeepAR({
            licenseKey: '83c8b73c80fa427dc93b7109a0f38c44fb177479f2873f8d6647be174470d08272a5d31c5e04399e',
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight,
            canvas: document.getElementById('deepar-canvas'),
            numberOfFaces: 1, // how many faces we want to track min 1, max 4
            libPath: './lib',
            onInitialize: () => {
                // start video immediately after the initalization, mirror = true
                deepAR.startVideo(true);
                // load the aviators effect on the first face into slot 'slot'
                deepAR.switchEffect(0, 'slot', '../masks/a1', function (e) {
                    // effect loaded
                    console.log(e)
                });
                const Mp3Recorder = new MicRecorder({ bitRate: 128 });
                this.setState({ initialized: true, Mp3Recorder })
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
    renderAr() {
        return (
            <>
                <canvas id="deepar-canvas" style={this.state.initialized ? { opacity: 1 } : { opacity: 0 }}></canvas>
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

            </>
        )
    }
    componentDidMount() {
        const token = localStorage.getItem(Configs.local_cache_name);
        if (!token) {
            window.location.href = "/";
            return;
        }      
        const options = {
            video: true,           
            audio: true, 
        }
        window.navigator.mediaDevices.getUserMedia(options).then(stream => {
            fetch(`${Configs.api}/customers/${token}`)
                .then(response => response.json())
                .then(data => {
                    if (!data) {
                        window.location.href = "/";
                        return;
                    } else {
                        this.state.filterIds.forEach((item, index) => {
                            if (!filterBuffers[item.icon]) {
                                fetch(item.path)
                                    .then(response => response.arrayBuffer())
                                    .then(data => {
                                        const bytes = new Int8Array(data);
                                        filterBuffers[item.icon] = bytes;
                                    });
                            }
                        })
                        this.startEngine();
                    }
                }).catch(e => {
                    console.log(e)
                });
        }).catch(err => {
            this.setState({permissionDenied: true})
            console.log("u got an error:" + err)
        });
    }
    render() {
        return (
            <div className="creation-body">
                {this.state.permissionDenied ? <PermissionDenied />: this.renderAr()}
            </div>
        );
    }
}

export default function (props) {
    const navigation = useNavigate();

    return <Creation {...props} navigation={navigation} />;
}

// export default Creation;
