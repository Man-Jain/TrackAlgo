import React from "react";
import {Badge, Modal, ModalHeader, ModalBody, Collapse,Container,Row, FormInput, Button,Col, Card,CardHeader,CardTitle,CardBody,CardFooter, } from "shards-react";
import {config, options} from './utils.js';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
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

export default class SearchArtifact extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <Container className="main-container">
        <Row>
          <Col sm="12" md="12">
            <TrackHistory itemid={this.props.match.params.itemid}></TrackHistory>
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
    }]], open: false, reload: this.props.reload, options: {}};
  }
  static getDerivedStateFromProps(props, state) {
  return { reload: props.reload };
  }
  componentDidMount = async () => {
    (async() => {
      let params = await algodclient.getTransactionParams();
      let txts = await algodclient.transactionByAddress( recoveredAccount.addr, params.lastRound- 1000 , params.lastRound );
      const history = (txts.transactions).reverse();

      var items = []
      for(let i = 0; i<history.length;i++){
        if(history[i].note){
          const obj = algosdk.decodeObj(history[i].note);
          if(obj.items){
            let l = items.length;
            if(i==0){
            for(let j=0;j<(obj.items).length;j++){
              if(obj.items[j] != null && (obj.items)[j].id == this.props.itemid){
                if(!items[l]){
                  items[l] = [];
                }
                items[l].push((obj.items)[j]);
              }
              }
            }
            else {
              const objprev = algosdk.decodeObj(history[i-1].note);
              for(let j=0;j<(obj.items).length;j++){
                if(obj.items[j] != null && (obj.items)[j].id == this.props.itemid && !((obj.items)[j].timestamp ===  (objprev.items)[j].timestamp)){
                  if(!items[l]){
                    items[l] = [];
                  }
                  items[l].push((obj.items)[j]);
                }
                }
            }
          }
        }
      }
      console.log('This is Items ');
      console.log(items);
      this.setState({history: items})
    })().catch(e => {
        console.log(e);
    });

    function getdata(item){
      console.log('Per Item');
      console.log(item);
      if(item[0].timestamp){
        let hour = item[0].timestamp.split(' ')[1].split(':')[0]
        return {x:parseInt(hour),y:item[0].temp,}
      }
    }

    const data  = this.state.history.map(getdata);
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
          <CardHeader><span class="bold-text">Item ID </span>:- {item[0].id}</CardHeader>
          <CardBody>
            <Badge className="timestamp" pill theme="secondary">
              {item[0].timestamp}
            </Badge>
            <p><span class="bold-text">Item Name</span> :- {item[0].name}</p>
            <p><span class="bold-text">Item Current Location</span> :- <a href={'http://www.google.com/maps/place/' + item[0].latlng.lat + ','  +item[0].latlng.lng}><Badge theme="warning">Check on Maps</Badge></a></p>
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
        Item was here
      </Popup>
    </Marker>
    )

    function getdata(item){
      console.log('Per Item');
      console.log(item);
      if(item[0].timestamp){
        let hour = item[0].timestamp.split(' ')[1].split(':')[0]
        return {time:parseInt(hour),Temp:item[0].temp,}
      }
    }

    const data  = this.state.history.map(getdata);
    console.log('Data is');
    console.log(data);

    return(
      <div>
        <Row>
          <Col md="6" sm="12">
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

          </Col>
          <Col md="6" sm="12">
          <h3>Temperature Changes</h3><hr /><br />
          <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
           <CartesianGrid strokeDasharray="3 3"/>
           <Tooltip />
            <XAxis />
            <Legend />
            <YAxis />
           <Line type="monotone" dataKey="Temp" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
            </ResponsiveContainer>
          </Col>
        </Row>

      </div>
    );
  }
}
