import React, { Component } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import Configs from '../config';
export class QR extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hash: '',
            wantToVerify: false,
            pngLink: '',
            download: false
        };
    }


    componentDidMount() {
        const hash = this.props.urlQuery.get('hash');
        const download = this.props.urlQuery.get('download');              
        const data = {
            "data": `${Configs.domain}/message?hash=${hash}`,
            "config":{
                "body":"circle",
                "eye": "frame13",
                "eyeBall": "ball14"
            },
            "size":256,
            "download": false,
            "file":"png"
            }
        fetch(`https://qrcode-monkey.p.rapidapi.com/qr/custom`,{            
                method: 'post',                
                headers: {
                  'content-type': 'application/json',
                  'x-rapidapi-host': 'qrcode-monkey.p.rapidapi.com',
                  'x-rapidapi-key': 'c48b243870mshf737c56fddf557cp11074ajsn061008a6f7c7'
                },
                body: JSON.stringify(data)
        })
        .then(async (response) => {
            if (response.status && response.status === 200) {
                const png = await response.blob();
                const pngLink = URL.createObjectURL(png);             
                this.setState({pngLink, download: download || false, hash});
                setTimeout(() => {
                    window.print();
                },500)
                       
            }
        }).catch(e => {
            alert('can not generate QR code, third party api error')
        });                        
    }

    render() {
        return (
            <>
                <div className="whiteWrapper">
                    <div className='cb-wrapper-app qr-page text-center'>
                        {this.state.pngLink ? 
                        (
                            <img className="mt-4" src={this.state.pngLink} alt="qr code generating" />
                        ) : 'Generating QR'}
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

