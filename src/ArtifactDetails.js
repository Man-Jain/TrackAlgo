import React from "react";
import {Modal, ModalHeader, ModalBody, Collapse,Container,Row, FormInput, Button,Col, Card,CardHeader,CardTitle,CardBody,CardFooter, } from "shards-react";
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
    console.log('This is the location props');
    console.log(this.props.location.state);
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
      <TrackHistory></TrackHistory>
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

class TrackHistory extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false, 'num':2, history: [''], open: false};
  }

  componentDidMount = async () => {
    (async() => {
      let params = await algodclient.getTransactionParams();
      console.log(params);
      let txts = await algodclient.transactionByAddress( recoveredAccount.addr, params.lastRound- 1000 , params.lastRound );
      console.log(txts);
      this.setState({history: txts.transactions})
    })().catch(e => {
        console.log(e);
    });
  }

  toggle() {
    this.setState({ open: !this.state.open });
  }

  render(){
    const { open } = this.state;
    const listItems = this.state.history.map((item) =>
      <li key={Math.random()} className="list-items-artifacts">
        <Modal size="lg" open={open} toggle={this.toggle}>
          <ModalHeader>Header</ModalHeader>
          <ModalBody>👋 Hello there!</ModalBody>
        </Modal>
      <Card>
      <CardHeader>Latest Hash :-{item.type} </CardHeader>
      <CardBody>
        <p>Item Name :- </p>
        <p>Item Current Location :- </p>
        <Button onClick={this.toggle}>See More</Button>
        <Collapse open={this.state.collapse}>
          <div className="p-3 mt-3 border rounded">
            <h5>😍 Now you see me!</h5>
            <span>
              In sagittis nibh non arcu viverra, nec imperdiet quam suscipit.
              Sed porta eleifend scelerisque. Vestibulum dapibus quis arcu a
              facilisis.
            </span>
          </div>
        </Collapse>
      </CardBody>
    </Card>
    <br />
      </li>
    )
    console.log('This is render ');
    console.log(this.state.history);
    return(
        <div>
        <h3>Previously Created Artifacts</h3><hr/> <br />
        {listItems}
      </div>
    );
  }
}
