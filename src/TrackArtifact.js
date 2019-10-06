import React from "react";

import {
  Row,
  Col,
  Container,
  Button,
  FormInput,
  Collapse,
  Card,
  CardFooter,
  CardBody,
  CardTitle,
  CardHeader,
  Modal,
  ModalBody,
  ModalHeader,
  Badge
} from 'shards-react';
import {
  Link
} from "react-router-dom";
import {config} from './utils.js';
import './index.css';

console.log(config.mnemonic);

const algosdk = require('algosdk');

var recoveredAccount = algosdk.mnemonicToSecretKey(config.mnemonic);
console.log(recoveredAccount.addr);
let algodclient = new algosdk.Algod(config.token, config.server, config.port);
let postalgodclient = new algosdk.Algod(config.ptoken, config.server, config.port);
//const kmdclient = new algosdk.Kmd(config.token2, config.serverkmd, config.port2);


export default class TrackArtifact extends React.Component {
  render() {
    return (
      <div>
        <Container className="main-container">
          <Row>
            <Col sm="12" md="12">
              <NewTrack></NewTrack>
            </Col>
            <Col sm="12" md="12">
              <hr/ ><br />
              <TrackHistory></TrackHistory>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

class NewTrack extends React.Component {
  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.state = { collapse: false , itemId:''};
  }

  handleInput(event) {
    this.setState({itemId:event.target.value})
  }

  render(){
    return(
      <div>
        <h3>Enter The Item ID You Want To Search :- </h3>
        <Row>
          <Col sm="11" md="11">
            <FormInput onChange={this.handleInput} value={this.state.itemId} placeholder="Item Hash" />
          </Col>
          <Col sm="1" md="1">
            <Link to={{
                pathname: '/artifact-details/' + this.state.itemId,
              }}><Button>Search</Button></Link>
          </Col>
        </Row>
      </div>
    );
  }
}


class TrackHistory extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false, 'num':2, history: [], open: false};
  }

  componentDidMount = async () => {
    (async() => {
      let params = await algodclient.getTransactionParams();
      let txts = await algodclient.transactionByAddress( recoveredAccount.addr, params.lastRound- 1000 , params.lastRound );
      let lastTransaction = txts.transactions[txts.transactions.length-1];
      const obj = algosdk.decodeObj(lastTransaction.note);
      console.log('last transaction obj');
      console.log(obj);
      var items = []
      if(obj.items){
        for(let j=0;j<(obj.items).length;j++){
          let l = items.length;
          if(!items[items.length]){
            items[l] = [];
          }
          items[l].push((obj.items)[j]);
        }
      }
      console.log('Items are');
      console.log(items);
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
      <Card>
        <CardHeader><span class="bold-text">Item ID </span>:- {item[0].id}</CardHeader>
        <CardBody>
          <Badge className="timestamp" pill theme="secondary">
            {item[0].timestamp}
          </Badge>
          <p><span class="bold-text">Item Name</span> :- {item[0].name}</p>
          <p><span class="bold-text">Item Current Location</span> :- <a href={'http://www.google.com/maps/place/' + item[0].latlng.lat + ','  +item[0].latlng.lng}><Badge theme="warning">Check on Maps</Badge></a></p>
          <Link to={{
              pathname: '/artifact-details/' + item[0].id,
              state: {
                item: item
              }
            }}><Button>See More</Button></Link>
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
    return(
      <div>
        <h3>Current Tracked Items</h3><hr/> <br />
        {listItems}
      </div>
    );
  }
}
