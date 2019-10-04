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

import {config} from './utils.js'

const algosdk = require('algosdk');

var recoveredAccount = algosdk.mnemonicToSecretKey(config.mnemonic);

let algodclient = new algosdk.Algod(config.token, config.server, config.port);
const kmdclient = new algosdk.Kmd(config.token2, config.serverkmd, config.port2);
// -------------------------------------

class Main extends React.Component {
  constructor(props){
    super(props);

(async () => {
    let walletid = (await kmdclient.createWallet("MyTestWallet", "testpassword", "", "sqlite")).wallet.id;
    console.log("Created wallet.", walletid);

    let wallethandle = (await kmdclient.initWalletHandle(walletid, "testpassword")).wallet_handle_token;
    console.log("Got wallet handle.", wallethandle);

    let address = (await kmdclient.generateKey(wallethandle)).address;
    console.log("Created new account.", address);
})().catch(e => {
    console.log(e);
});
  }
  render(){
    return(
      <div>
      <NavExample />
      <HashRouter>
      <Route exact path="/" component={TrackArtifact}/>
        <Route path="/new-artifact" component={CreateArtifact}/>
        <Route path="/artifact-details/:hash" component={ArtifactDetails}/>
      </HashRouter>
      </div>
    );
  }
}


ReactDOM.render(
  <Main />,
  document.getElementById('root')
);
