import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import { faDownload, faEye, faPrint } from '@fortawesome/free-solid-svg-icons';
import Configs from '../config';

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
        this.setState({hash})
        window.print();
    }

    render() {
        return (
            <>
                <div className="whiteWrapper">
                    <div className='cb-wrapper-app qr-page text-center'>
                        <QRCode size="256" value="https://snapapic.digital" />
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

