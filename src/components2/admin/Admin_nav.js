import React from 'react';
import './admin.css';
import Axios from 'axios';
import History from '../../History'
import {Link} from 'react-router-dom';
class Admin_nav extends React.Component{
    constructor(props){
        super(props);
    }
    onLogout(event){
        event.preventDefault();

        Axios({url:'/logout',method:'get',withCredentials:true})
        .then(data=>{
           
          if(data.data.logout){
            History.push('/')
          }
        })
    }
    render(){
        return(
          <div className="container-fluid">
          <div className="row">
          <div className="col-12">
          <nav className="navbar navbar-expand  justify-content-center nav_height nav_bgcolor">
          <ul className="navbar-nav">
          <li className="nav-item nav-bg-item">
          <Link  className="nav-link nav_textcolor" to="/khjadsshjasdasdasdjasdeewwqehjtrjkhrjkwiuewruiowe/logie">Statistics&nbsp;&nbsp;</Link>
          </li>
          <li className="nav-item nav-bg-item">
          <Link className=" nav-link nav_textcolor" to="/239802839sdkjlsdajlkdsajlksdajklsadkjlasdkjlasjklasd/logo">Approval Request&nbsp;&nbsp;</Link>
          </li>
          <li className="nav-item nav-bg-item">
          <Link className="nav-link nav_textcolor" to="/khjadsshjasdaslassldasdjasdeellkwwqehjtrjkhrjkwiuewruiowes">Search/View Profiles &nbsp;&nbsp;</Link>
          </li>
          <li className="nav-item nav-bg-item">
          <div className="nav-link nav_textcolor" style={{cursor:'pointer'}} onClick={this.onLogout.bind(this)}>Logout</div>
          </li>
          </ul>
          </nav>
          </div>
          </div>
          </div>
        )
    }
}

export default Admin_nav;