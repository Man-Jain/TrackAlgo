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


export default class TrackSection extends React.Component {
  render() {
    return (
      <div>
        <Container className="main-container">
          <Row>
            <Col sm="12" md="12">
              <NewTrack></NewTrack>
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
