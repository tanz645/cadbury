import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
export class Creation extends Component {

    constructor(props) {
        super(props);       
       
        this.state = {
            filterIds: [
                {id:1, path:'../masks/f01'},
                {id:2, path:'../masks/f02'},
                {id:3, path:'../masks/f03'},
                {id:4, path:'../masks/Beard/beard'},
                {id:5, path:'../masks/Frankenstein/frankenstein'},
                {id:6, path:'../masks/Pumpkin/pumpkin'},            
            ],
            deepAR: {},
            recordingStarted: false
        };
        this.startVideo = this.startVideo.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
    }

    startVideo(){   
        const { navigation } = this.props; 
        navigation('/question-popup')
        // if(this.state.recordingStarted){
        //     this.setState({recordingStarted:false},() => {
        //         this.state.deepAR.finishVideoRecording((e) => {
        //             console.log(e)
        //         });
        //     })            
        // }else{            
        //     this.setState({recordingStarted:true},() => {
        //         this.state.deepAR.startVideoRecording();
        //     })
        // }
        
    }

    changeFilter(path){
        this.state.deepAR.switchEffect(0, 'slot', path, function(e) {
            // effect loaded
            console.log(e)
          });
    }

    componentDidMount() {
        const deepAR = window.DeepAR({
            licenseKey: '8870bcae7bc766386feeb3718b6df5e50f70793fca977f8f2c3397f892a027a2a667678ea58f9ac5',
            canvasWidth: window.innerWidth, 
            canvasHeight: window.innerHeight,
            canvas: document.getElementById('deepar-canvas'),
            numberOfFaces: 1, // how many faces we want to track min 1, max 4
            libPath: './lib',
            onInitialize: function() {
              // start video immediately after the initalization, mirror = true
              deepAR.startVideo(true);
              // load the aviators effect on the first face into slot 'slot'
              deepAR.switchEffect(0, 'slot', '../masks/f01', function(e) {
                // effect loaded
                console.log(e)
              });
            },
            onCameraPermissionDenied: (e) => {
                console.log(e)
            },
            onVideoStarted: (e) => {
                console.log(e)
            },
            onError: (e) => {
                console.log('here')
                console.log(e)
            }
          });
        
          // download the face tracking model
          deepAR.downloadFaceTrackingModel('../lib/models/models-68-extreme.bin');
          this.setState({deepAR})
    }
    render() {
        return (
            <>
                <div className="creation-body">
                    <canvas id="deepar-canvas"></canvas>
                    <div className="control-box">
                        <div className="filter-selection">
                            {this.state.filterIds.map(item => <div className="creation-filter-btn" onClick={() => this.changeFilter(item.path)}>{item.id}</div> )}                            
                        </div>
                        <div className="creation-camera-box" onClick={this.startVideo}>
                            <img className="creation-camera-btn" src="../images/White-Camera.png" />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default function(props) {
    const navigation = useNavigate();
  
    return <Creation {...props} navigation={navigation} />;
  }

// export default Creation;
