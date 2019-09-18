import React, { Component } from 'react';
import MediaContainer from './MediaContainer'
import CommunicationContainer from './CommunicationContainer'
import { connect } from 'react-redux'
// import store from '../store';
import '../video.css'
import {aRoom} from '../../../store/action/apiAction'
import {messenger} from '../../main'

class RoomPage extends Component {
  constructor(props) {
    super(props);
    this.getUserMedia = navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    }).catch(e => alert('getUserMedia() error: ' + e.name))
    this.socket = messenger;
  }
  componentDidMount() {
    this.props.addRoom();
  }
  render(){
    return (
      <div className="bodya">
        <MediaContainer         room={this.props.match.params.id.trim()}       media={media => this.media = media} socket={this.socket} getUserMedia={this.getUserMedia} />
        <CommunicationContainer socket={this.socket} media={this.media}        room={this.props.match.params.id.trim()} getUserMedia={this.getUserMedia} />
      </div>
    );
  }
}
// const mapStateToProps = store => ({rooms: new Set([...store.rooms])});
const mapDispatchToProps = (dispatch, ownProps) => (
    {
      addRoom: () => aRoom( ownProps.match.params.room)
    }
  );
export default connect(null, mapDispatchToProps)(RoomPage);