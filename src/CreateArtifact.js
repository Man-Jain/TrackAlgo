import React from "react";
import { Collapse,Container,Row, FormInput, Button,Col, Card,CardHeader,CardTitle,CardBody,CardFooter, } from "shards-react";
import {config} from './utils.js'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
console.log(config.mnemonic);

const algosdk = require('algosdk');

var recoveredAccount = algosdk.mnemonicToSecretKey(config.mnemonic);
console.log(recoveredAccount.addr);
let algodclient = new algosdk.Algod(config.token, config.server, config.port);
let postalgodclient = new algosdk.Algod(config.ptoken, config.server, config.port);
const kmdclient = new algosdk.Kmd(config.token2, config.serverkmd, config.port2);


type State = {
  hasLocation: boolean,
  latlng: {
    lat: number,
    lng: number,
  },
}

export default class NewArtifact extends React.Component<{}, State>{
  constructor(props){
    super(props);
    this.state = {
      reciever: '',
      coordinates: '',
      name: '',
      hasLocation: false,
      latlng: {
      lat: 51.505,
      lng: -0.09,
    },
    };

    this.handleInput = this.handleInput.bind(this);
    this.addArtifact = this.addArtifact.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.captureFile = this.captureFile.bind(this);
  }
  mapRef = React.createRef();
  captureFile (event) {
    event.stopPropagation()
    event.preventDefault()
    this.setState({added_file_hash: event.target.files});
  }
  handleClick = () => {
    const map = this.mapRef.current
    if (map != null) {
      map.leafletElement.locate()
    }
  }

  handleLocationFound = (e: Object) => {
    this.setState({
      hasLocation: true,
      latlng: e.latlng,
    })
  }
  addArtifact(){
    console.log('Clicking');
    (async() => {
    let params = await algodclient.getTransactionParams();
    let endRound = params.lastRound + parseInt(1000);
    console.log(recoveredAccount.addr);
    let txn = {
        "from": recoveredAccount.addr,
        "to": this.state.reciever,
        "fee": 0,
        "amount": 0,
        "firstRound": params.lastRound,
        "lastRound": endRound,
        "genesisID": params.genesisID,
        "genesisHash": params.genesishashb64,
        "note": algosdk.encodeObj(this.state),
    };
    let signedTxn = algosdk.signTransaction(txn, recoveredAccount.sk);
    let tx = (await postalgodclient.sendRawTransaction(signedTxn.blob));
    console.log(tx);
    let txan = (await algodclient.transactionById(tx));
    console.log('tx an is');
    console.log(txan);
    console.log("Transaction : " + tx.txId);
    })().catch(e => {
      console.log(e);
    });
  }

  handleInput(event) {
    const target = event.target;
    if (target.name == "reciever"){
      this.setState(Object.assign({}, this.state, {reciever: target.value}));
    }
    else {
      this.setState(Object.assign({}, this.state, {name: target.value}));
    }
  }
  render(){
    const marker = this.state.hasLocation ? (
      <Marker position={this.state.latlng}>
        <Popup>You are here</Popup>
      </Marker>
    ) : null
    return(
      <Container className="main-container">
        <Row>
        <Col sm="12" md="6">
      <div>

      <h3>Track A New Item</h3><hr/> <br />
      <Card>
      <CardHeader>Enter The Details of Artifact</CardHeader>
      <CardBody>
        <CardTitle>Send To</CardTitle>
        <FormInput name="reciever" placeholder="Reciever's Address" value={this.state.reciever} onChange={this.handleInput} />
        <br />
        <CardTitle>Item To Locate</CardTitle>
        <FormInput name="name" placeholder="Item Name" value={this.state.name} onChange={this.handleInput}/>
        <br />
        <Button onClick={this.addArtifact}>Begin Tracking</Button>
      </CardBody>
      <CardFooter>Card footer</CardFooter>
    </Card>
      </div>
    </Col>
    <Col sm="12" md="6">
      <div>
        <h3>Select The Location</h3>
        <hr/><br/>
          <Map
      center={this.state.latlng}
      length={4}
      onClick={this.handleClick}
      onLocationfound={this.handleLocationFound}
      ref={this.mapRef}
      zoom={13}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {marker}
        </Map>
      </div>
    </Col>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/leaflet.css" />
    </Row>
      </Container>
    );
  }
}
