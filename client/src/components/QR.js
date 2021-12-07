import React, { Component } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import Configs from '../config';
import { jsPDF } from "jspdf";
export class QR extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hash: '',
            wantToVerify: false,
        };
    }


    componentDidMount() {
        const hash = this.props.urlQuery.get('hash');
        const download = this.props.urlQuery.get('download');
        // if(download && (download === true || download === 'true')){
        //     const doc = new jsPDF();
        //     setTimeout(() => {
        //         doc.html(window.document.body, {
        //             callback: function (doc) {
        //                 doc.save(`${hash}_cadbury_gift_from_the_heart.pdf`);
        //             },
        //             x: 10,
        //             y: 10
        //         }); 
        //     },1000)
           
        // }
        // fetch(`/qr?hash=${id}`)
        //     .then(async (response) => {
        //         if (response.status && response.status === 200) {
        //         const html = await response.text();
        //         console.log(html)
        //         doc.html(html, {
        //             callback: function (doc) {
        //             doc.save(`${id}_cadbury_gift_from_the_heart.pdf`);
        //             },
        //             x: 10,
        //             y: 10
        //         }); 
        //         }
        //     });
        // }
        console.log(download)
        console.log(hash)
        this.setState({hash})
        // window.print();
    }

    render() {
        return (
            <>
                <div className="whiteWrapper">
                    <div className='cb-wrapper-app qr-page text-center'>
                        <QRCode size={256} value="https://snapapic.digital" />
                        <div className="qr-user-id">
                            <h2>{this.state.hash}</h2>
                        </div>
                    </div>
                </div>

            </>
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
    return <QR {...props} navigation={navigation} urlQuery={urlQuery} />;
}

