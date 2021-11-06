import React, { Component } from 'react';
export class Creation extends Component {

    constructor(props) {
        super(props);
        // Don't call this.setState() here!
        this.state = {};
    }
    componentDidMount() {
        var deepAR = window.DeepAR({
            licenseKey: '7ab5eef3873661a22e53d3894b60ae28be34142d171f680cda14084e6eded060fb75f54c26025d93',
            canvasWidth: window.innerWidth, 
            canvasHeight: window.innerHeight,
            canvas: document.getElementById('deepar-canvas'),
            numberOfFaces: 1, // how many faces we want to track min 1, max 4
            onInitialize: function() {
              // start video immediately after the initalization, mirror = true
              deepAR.startVideo(true);
              // load the aviators effect on the first face into slot 'slot'
              deepAR.switchEffect(0, 'slot', './aviators', function() {
                // effect loaded
              });
            }
          });
        
          // download the face tracking model
          deepAR.downloadFaceTrackingModel('models/models-68-extreme.bin');
    }
    render() {
        return (
            <>
                <div className="creation-body">
                    <canvas id="deepar-canvas"></canvas>
                </div>
            </>
        );
    }
}

export default Creation;
