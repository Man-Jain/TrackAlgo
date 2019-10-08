// Imports -----------------------------
import React from 'react';
import ReactDOM from 'react-dom';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css";

import { Container, Row, Col, FormInput, Button ,Card,CardHeader,CardTitle,CardBody,CardFooter, } from "shards-react";
import {
  Route,
  HashRouter
} from "react-router-dom";

import './index.css';
import NavExample from './Navbar';
import CreateArtifact from './CreateArtifact';
import TrackArtifact from './TrackArtifact';
import ArtifactDetails from './ArtifactDetails';
import SearchArtifact from './SearchArtifact';
import TrackSection from './TrackSection';

import {config} from './utils.js'

const algosdk = require('algosdk');

var recoveredAccount = algosdk.mnemonicToSecretKey(config.mnemonic);

let algodclient = new algosdk.Algod(config.token, config.server, config.port);
let postalgodclient = new algosdk.Algod(config.ptoken, config.server, config.port);
// -------------------------------------

class Main extends React.Component {
  constructor(props){
    super(props);
  }
  componentDidMount = async() => {
   document.title = "TrackAlgo";
   let params = await algodclient.getTransactionParams();
   //get all transactions for an address for the last 1000 rounds
   let txts = (await algodclient.transactionByAddress( recoveredAccount.addr , params.lastRound - 1000, params.lastRound ));
   if(!txts){
     console.log('No previous transaction found');
     (async() => {
       let params = await algodclient.getTransactionParams();
       let endRound = params.lastRound + parseInt(1000);
       let txn = {
         "from": recoveredAccount.addr,
         "to": recoveredAccount.addr,
         "fee": 0,
         "amount": 0,
         "firstRound": params.lastRound,
         "lastRound": endRound,
         "genesisID": params.genesisID,
         "genesisHash": params.genesishashb64,
         "note": algosdk.encodeObj({items:[{id: 'FGYHJ56DCVHJasda',name: 'Paracetamol',latlng: {lat: 51.505,lng: -0.09,},temp: 34,timestamp: '2018-8-3 11:12:40'}]}),
       };
       let signedTxn = algosdk.signTransaction(txn, recoveredAccount.sk);
       let tx = (await postalgodclient.sendRawTransaction(signedTxn.blob));
       console.log(tx.txId);
     })().catch(e => {
       console.log(e);
     });
   }
  }
  render(){
    return(
      <div>
      <NavExample />
      <HashRouter>
        <Route exact path="/" component={TrackArtifact}/>
        <Route path="/new-artifact" component={CreateArtifact}/>
        <Route path="/search" component={TrackSection}/>
        <Route path="/artifact-details/:itemid" component={ArtifactDetails}/>
      </HashRouter>
      <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css" />
      </div>
    );
  }
}


ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
