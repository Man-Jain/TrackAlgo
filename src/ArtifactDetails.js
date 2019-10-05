import React from "react";
import {Modal, ModalHeader, ModalBody, Collapse,Container,Row, FormInput, Button,Col, Card,CardHeader,CardTitle,CardBody,CardFooter, } from "shards-react";
import {config} from './utils.js'
import { Map, TileLayer, Marker, Popup, Circle,FeatureGroup,LayerGroup,LayersControl,Rectangle,} from 'react-leaflet';
console.log(config.mnemonic);

const algosdk = require('algosdk');

var recoveredAccount = algosdk.mnemonicToSecretKey(config.mnemonic);
console.log(recoveredAccount.addr);
let algodclient = new algosdk.Algod(config.token, config.server, config.port);
let postalgodclient = new algosdk.Algod(config.ptoken, config.server, config.port);
const kmdclient = new algosdk.Kmd(config.token2, config.serverkmd, config.port2);

const { BaseLayer, Overlay } = LayersControl

const center = [51.505, -0.09]
const rectangle = [[51.49, -0.08], [51.5, -0.06]]

export default class NewArtifact extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data: {
        id: '',
        name: '',
        latlng: {
          lat: 51.505,
          lng: -0.09,
        },
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
    console.log('The last Transaction is');
    console.log(lastTransaction);
    this.setState({lastTransactionNote:algosdk.decodeObj(lastTransaction.note)})
    console.log('This state has');
    console.log(this.state.lastTransactionNote);
  }

  handleLocationFound = (e: Object) => {
    var data = {...this.state.data};
    data.latlng = e.latlng;
    this.setState({data:data, hasLocation:true});
    console.log(this.state);
  }

  addArtifact(){
    console.log('Clicking');
    var lastTransaction = {...this.state.lastTransactionNote};
    var lastTransactionItems = lastTransaction.items;

    console.log('Last transaction Items');
    console.log(lastTransactionItems);
    let index;
    for(let i = 0; i<lastTransactionItems.length;i++){
      console.log('This tranascion');
      console.log(lastTransactionItems[i]);
        if (lastTransactionItems[i].id == this.props.match.params.itemid){
          console.log(lastTransactionItems[i]);
          console.log(this.props.match.params.itemid);
          index = i;
          break;
        }
    }

    lastTransactionItems[index].latlng = this.state.data.latlng;

    (async() => {
      let params = await algodclient.getTransactionParams();
      let endRound = params.lastRound + parseInt(1000);
      console.log(recoveredAccount.addr);
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
      data.id = target.value + String(Math.random());
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
          <ModalHeader>Congrats! Your Item location has been updated</ModalHeader>
          <ModalBody>The Transaction Hash Is :- {this.state.txhash}</ModalBody>
        </Modal>

        <Row>
          <Col sm="12" md="6">
            <TrackHistory itemid={this.props.match.params.itemid}></TrackHistory>
          </Col>
          <br/>
          <Col sm="12" md="6">
            <div>
              <h3>Update the Location</h3>
              <hr/ ><br/>
              <Card>
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
              <CardFooter><Button onClick={this.addArtifact}>Update Location</Button></CardFooter>
              </Card>
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
    this.state = { collapse: false, 'num':2, history: [[{
      id: '',
      name: '',
      latlng: {
        lat: 51.505,
        lng: -0.09,
      },
    }]], open: false};
  }

  componentDidMount = async () => {
    (async() => {
      let params = await algodclient.getTransactionParams();
      let txts = await algodclient.transactionByAddress( recoveredAccount.addr, params.lastRound- 1000 , params.lastRound );
      const history = (txts.transactions).reverse();

      var items = []
      for(let i = 0; i<history.length;i++){
          const obj = algosdk.decodeObj(history[i].note);
          if(obj.items){
            let l = items.length;
            console.log(obj);
            for(let j=0;j<(obj.items).length;j++){
              if(obj.items[j] != null && (obj.items)[j].id == this.props.itemid){
                if(!items[l]){
                  items[l] = [];
                }
                items[l].push((obj.items)[j]);
              }
            }
          }
      }
      this.setState({history: items})
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
            {console.log('This is asdf')}
              {console.log(item)}
          <ModalBody>👋 Hello there!</ModalBody>
        </Modal>
        <Card>
          <CardHeader>Item Id :- {item[0].id}</CardHeader>
          <CardBody>
            <p>Item Name :- {item[0].name}</p>
            <p>Item Current Location :- <a href={'http://www.google.com/maps/place/' + item[0].latlng.lat + ','  +item[0].latlng.lng}>Maps</a></p>
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

    const markers = this.state.history.map((item) =>
    <Marker position={[item[0].latlng.lat, item[0].latlng.lng]}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
    )
    console.log(this.state.history);

    return(
        <div>
        <h3>Tracking History</h3><hr/> <br />
          <Map center={center} zoom={2}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          {markers}
          </Map>
          <br/>
        <h3>Tracking Overview</h3><hr/> <br />
        {listItems}
        <br/>
      </div>
    );
  }
}
