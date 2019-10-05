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
  ModalHeader
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
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }
  render(){
    return(
      <div>
        <h3>Enter The Item Hash You Want To Track :- </h3>
        <Row>
          <Col sm="11" md="11">
            <FormInput placeholder="Item Hash" />
          </Col>
          <Col sm="1" md="1">
            <Button onClick={this.toggle}>Track</Button>
          </Col>
        </Row>
        <Collapse open={this.state.collapse}>
          <div className="p-3 mt-3 border rounded">
            <h5>😍 Now you see me!</h5>
            <span>
              In sagittis nibh non arcu viverra, nec imperdiet quam suscipit.
              Sed porta eleifend scelerisque. Vestibulum dapibus quis arcu a
              facilisis.
              In sagittis nibh non arcu viverra, nec imperdiet quam suscipit.
              Sed porta eleifend scelerisque. Vestibulum dapibus quis arcu a
              facilisis.
              In sagittis nibh non arcu viverra, nec imperdiet quam suscipit.
              Sed porta eleifend scelerisque. Vestibulum dapibus quis arcu a
              facilisis.
              In sagittis nibh non arcu viverra, nec imperdiet quam suscipit.
              Sed porta eleifend scelerisque. Vestibulum dapibus quis arcu a
              facilisis.
            </span>
          </div>
        </Collapse>
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
      console.log(params);
      let txts = await algodclient.transactionByAddress( recoveredAccount.addr, params.lastRound- 1000 , params.lastRound );
      console.log(txts);
      const history = (txts.transactions).reverse();

      var items = []
      for(let i = 0; i<history.length;i++){
          const obj = algosdk.decodeObj(history[i].note);
          if(obj.items){
            let l = items.length;
            console.log(obj);
            for(let j=0;j<(obj.items).length;j++){
              if(!items[items.length]){
                console.log('lenght is');
                console.log(items.length);
                items[l] = [];
              }
              console.log('lenght is');
              console.log(items.length);
              items[l].push((obj.items)[j]);
            }
          }
      }
      console.log('Items is');
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
        <CardHeader>Item Id :- {item[0].id}</CardHeader>
        <CardBody>
          <p>Item Name :- {item[0].name}</p>
          <p>Item Current Location :- {JSON.stringify (item[0].latlng)}</p>
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
