import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Configs from '../config';
import MicRecorder from 'mic-recorder-to-mp3';

let filterBuffers = {};
export class Creation extends Component {

    constructor(props) {
        super(props);

        const Mp3Recorder = new MicRecorder({ bitRate: 128 });

        this.state = {
            filterIds: [
                { icon: 'thumbnails-01.png', path: 'masks/a1' },
                { icon: 'thumbnails-02.png', path: 'masks/a2' },
                { icon: 'thumbnails-03.png', path: 'masks/a3' },
                { icon: 'thumbnails-04.png', path: 'masks/a4' },
                { icon: 'thumbnails-05.png', path: 'masks/a5' },
                { icon: 'thumbnails-06.png', path: 'masks/a6' },
            ],
            Mp3Recorder,
            filterBinary: [],
            deepAR: {},
            activeFilter: 'thumbnails-01.png',
            recordingStarted: false,                                               
            initialized: false
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
                    this.props.navigation(`/creation-preview?v=${URL.createObjectURL(e)}&a=${URL.createObjectURL(Audioblob)}`);
                    return;
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
            licenseKey: '3f92e708616b60122450aeb42226bc9079c4f2fe4edd6fb987d69c78a91b0f3ff070e3c8dcd7bf19',
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
        window.navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {                   
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
                    window.location.href = "/";
                    return;
                });
        }).catch(err => {
            console.log("u got an error:" + err)
        });
    }
    render() {
        return (
            <div className="creation-body">
                {this.renderAr()}
            </div>
        );
    }
}

export default function (props) {
    const navigation = useNavigate();

    return <Creation {...props} navigation={navigation} />;
}

// export default Creation;
