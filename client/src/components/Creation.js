import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import Configs from '../config';
import PermissionDenied from './PermissionDenied';
import Loading from './Loading'
let filterBuffers = {};
let timeoutID;
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
        if (this.state.recordingStarted) {                      
            this.state.deepAR.finishVideoRecording((e) => {                                              
                this.state.deepAR.shutdown();
                clearTimeout(timeoutID);                                                                          
                const vid = URL.createObjectURL(e);
                const aud = window.audioBlobLink;                                                          
                setTimeout(() => {
                    this.props.navigation(`/creation-preview?v=${vid}&a=${aud}`);
                    return;
                },200)
            });
        } else {
            this.setState({ recordingStarted: true },async () => {
                this.state.deepAR.startVideoRecording();                
                timeoutID = setTimeout(() => {
                    this.state.deepAR.finishVideoRecording((e) => {
                        this.state.deepAR.shutdown();
                        clearTimeout(timeoutID);
                        const vid = URL.createObjectURL(e);
                        const aud = window.audioBlobLink;   
                        setTimeout(() => {
                            this.props.navigation(`/creation-preview?v=${vid}&a=${aud}`);
                            return;
                        },200)
                        return;
                    });
                }, 1000 * 20)
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
        const wwwKey = 'f98e4511dbbd4e0c58ab7fe7a14300ad49455b9d515d52c1009071e65c952e0ee63f3e4f3499c787';
        const nonWwwKey = 'eb34ca6c899324abda2f54f7b0d0102302d2c9d76d511639cfdc2163d2847e47dcb85fe162a18b69';
        let key = window.location.href.includes('www') ? wwwKey : nonWwwKey;
        const deepAR = window.DeepAR({
            licenseKey: key,
            canvasWidth: window.innerWidth,
            canvasHeight: window.innerHeight,
            canvas: document.getElementById('deepar-canvas'),
            numberOfFaces: 1,
            libPath: './lib',
            onInitialize: () => {                
                deepAR.startVideo(true);                
                deepAR.switchEffect(0, 'slot', '../masks/a1', function (e) {                   
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
                <canvas id="deepar-canvas" style={this.state.initialized ? { display: 'block' } : { display: 'none' }}></canvas>
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
                                    <img className="creation-camera-btn vdo-run" src="../images/Record_New.gif" /> :
                                    <img className="creation-camera-btn vdo-start" src="../images/White-Camera.png" />}

                            </div>
                        </div>
                    )
                    : <Loading />}

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
            audio: false, 
        };
        const optionsAud = {
            video: false,           
            audio: true, 
        };
        if(!window.navigator || !window.navigator.mediaDevices || !window.navigator.mediaDevices.getUserMedia){
            alert('Media device not supported in this browser');
            return;
        }
        if("function" !== typeof HTMLCanvasElement.prototype.captureStream){
            alert('Canvas captureStream in this browser');
            return;
        }
        window.navigator.mediaDevices.getUserMedia(options).then(stream => {
            window.EnabledMediaStream = stream;            
            window.navigator.mediaDevices.getUserMedia(optionsAud).then(stream =>{  
                window.EnabledMediaStreamA = stream;
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