import React, { Component } from 'react'

export class Loading extends Component {
    render() {
        return (
            <>
                <div className="cb-wrapper-app">
        <div className="cb-content phone-layout">
            <div className="mastdead">
                <img className="mast-head-img" src="../images/Masthead-02.png" alt="Mast head image is missing"/>
                <img className="cd-img-small margin-auto familyLoading" src="../images/Family.png" alt="Family image is missing!"/>
                <img src="../images/Loading.gif" alt="Special message" className="loadingGif" />
            </div>
        </div>
    </div>
            </>
        )
    }
}

export default Loading
