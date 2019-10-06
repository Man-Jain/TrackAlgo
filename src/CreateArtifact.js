import React from "react";
import { Modal, ModalBody, ModalHeader ,Collapse,Container,Row, FormInput, Button,Col, Card,CardHeader,CardTitle,CardBody,CardFooter, } from "shards-react";
import {config} from './utils.js'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
console.log(config.mnemonic);

const algosdk = require('algosdk');

var recoveredAccount = algosdk.mnemonicToSecretKey(config.mnemonic);
console.log(recoveredAccount.addr);
let algodclient = new algosdk.Algod(config.token, config.server, config.port);
let postalgodclient = new algosdk.Algod(config.ptoken, config.server, config.port);
const kmdclient = new algosdk.Kmd(config.token2, config.serverkmd, config.port2);

export default class NewArtifact extends React.Component{
  constructor(props){
    super(props);
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    this.state = {
      data: {
        id: '',
        name: '',
        latlng: {
          lat: 51.505,
          lng: -0.09,
        },
        temp: Math.floor((Math.random() * 60) + 1),
        timestamp: dateTime,
      },
      hasLocation: false,
      open: false,
      txhash: '',
      lastTransactionNote: {items:[]},
    };

    this.handleInput = this.handleInput.bind(this);
    this.addArtifact = this.addArtifact.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  mapRef = React.createRef();

  handleClick = () => {
    const map = this.mapRef.current
    if (map != null) {
      map.leafletElement.locate()
    }
  }

  toggle() {
    this.setState({
      open: !this.state.open
    });
  }

  componentDidMount = async () => {
    this.handleClick();
    let params = await algodclient.getTransactionParams();
    //get all transactions for an address for the last 1000 rounds
    let txts = (await algodclient.transactionByAddress( recoveredAccount.addr , params.lastRound - 1000, params.lastRound ));
    let lastTransaction = txts.transactions[txts.transactions.length-1];
    this.setState({lastTransactionNote:algosdk.decodeObj(lastTransaction.note)})
  }

  handleLocationFound = (e: Object) => {
    var data = {...this.state.data};
    data.latlng = e.latlng;
    this.setState({data:data, hasLocation:true});
  }

  addArtifact(){
    var lastTransaction = {...this.state.lastTransactionNote};
    lastTransaction.items.push(this.state.data);
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
        "note": algosdk.encodeObj(lastTransaction),
      };
      let signedTxn = algosdk.signTransaction(txn, recoveredAccount.sk);
      let tx = (await postalgodclient.sendRawTransaction(signedTxn.blob));
      console.log(tx.txId);
      this.setState({txhash: tx.txId});
      this.setState({
      open: !this.state.open
      });
    })().catch(e => {
      console.log(e);
    });
  }

  handleInput(event) {
    const target = event.target;
    if(target.name == "id"){
      var data = {...this.state.data};
      data.id = target.value + String(Math.random().toString(36).substring(7));
      this.setState({data:data});
    }
    else {
      var data = {...this.state.data};
      data.name = target.value;
      this.setState({data:data});
    }
  }
  render(){
    const marker = this.state.hasLocation ? (
      <Marker position={this.state.data.latlng}>
        <Popup>You are here</Popup>
      </Marker>
    ) : null
    return(
      <Container className="main-container">

        <Modal size="lg" open={this.state.open} toggle={this.toggle}>
          <ModalHeader>Congrats! Your Item is now on Blokchain</ModalHeader>
          <ModalBody>The Transaction Hash Is :- {this.state.txhash}</ModalBody>
        </Modal>

        <Row>
          <Col sm="12" md="6">
            <div>
              <h3>Track A New Item</h3><hr/> <br />
              <Card>
                <CardHeader>Enter The Details of Artifact</CardHeader>
                <CardBody>
                  <CardTitle>Item To Track</CardTitle>
                  <FormInput name="name" placeholder="Item Name" value={this.state.name} onChange={this.handleInput}/>
                  <br />
                  <FormInput name="id" placeholder="Item Id" value={this.state.id} onChange={this.handleInput}/>
                  <br />
                  <Button onClick={this.addArtifact}>Begin Tracking</Button>
                </CardBody>
                <CardFooter>Card footer</CardFooter>
              </Card>
            </div>
          </Col>
          <br/>
          <Col sm="12" md="6">
            <div>
              <h3>Select The Location</h3>
              <hr/ ><br/>
              <Map
                center={this.state.data.latlng}
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
