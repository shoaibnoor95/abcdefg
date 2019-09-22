import React from 'react';
import { notifier,messenger } from '../components2/main';
import './css/style.css';
import './css/bootstrap.min.css';
import './css/line-awesome.css';
import './css/line-awesome-font-awesome.min.css';
import './css/font-awesome.min.css';
import './css/jquery.mCustomScrollbar.min.css';
import './lib/slick/slick.css';
import './lib/slick/slick-theme.css';
import './css/responsive.css';
import './lib/slick/slick.css';
import {Link} from 'react-router-dom'
import Axios from 'axios';
import Dots from 'react-activity/lib/Dots'
import {base64ArrayBuffer} from './base64';
import {ModalHeader,ModalFooter,ModalBody,Modal,Button} from 'reactstrap'
import TimeAgo from 'timeago-react';
import History from '../History'
class PrimarySearchAppBar extends React.Component {

  state = {
    username:'',
    showmore:false,
    messageList:false,
    notification:[],
    counter:0,
    mCounter:0,
    firstFetch:false,
    firstName:'',
    photo:'',
    search:'',
    messagDialog:false,
    notficationDialog:false,
    toggleMenu:false,
    modal:false,
    message:'',
    calleePic:'',
    calleeName:'',
    room:'',
    notiLoading:false
  };
  componentDidMount(){
    if(this.props.verify){
      Axios({url:'/getUsernme',method:'get',withCredentials:true})
      .then(data=>{
          console.log(data)
        this.setState({
          username:data.data.data.username,
          firstName:data.data.data.firstName
      })
      const photo=base64ArrayBuffer(data.data.data.pic.data.data)
      this.setState({
          photo
         })
      })
      
      messenger.on('notifyMessage',()=>{
        if(this.props.showMessageCounter){
        this.setState({
          mCounter:this.state.mCounter+1
        })
        }
      })
      messenger.on('callee',(data)=>{
          this.setState({modal:true,
            calleeName:data.firstName,
            calleePic:data.calleePic,
            room:data.room
        })
      })
      notifier.on('notifyMe',(notification)=>{
        let notifier=this.state.notification;
        notifier.push(notification);
        this.setState({
        notification:notifier,
        counter:this.state.counter+1
        })
      })
    }
  }
  onFetchNotify(event){
    event.preventDefault();
   this.setState({
     notiLoading:true
   })
    this.setState({counter:0,notficationDialog:!this.state.notficationDialog})
    notifier.emit("okNoti")
   if(!this.state.firstFetch){

     Axios({
       method:'post',
       url:'/fecthNoti',
       withCredentials:true
    })
    .then(data=>{
        console.log(data)
      if(data.data.notifications)
      {
        this.setState({
          messagDialog:false,
          notification:data.data.notifications
          ,firstFetch:true,
          notiLoading:false  
        })
      }
      else {
        if(data.data.message){
          this.setState({
            message:'No notification to show'
          })
        }
          else{
            this.setState({
              message:'Could not proceed with the request'
            })
          }
        }
      })
      .catch(err=>{
        this.setState({
          message:'Could not proceed with the request'
        })
      })
    }
    else{
      this.setState({
        notiLoading:false
      }) 
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({counter:nextProps.counter,mCounter:nextProps.mCounter})
  }
  logout(){
    Axios({url:'/logout',method:'get',withCredentials:true})
    .then(data=>{
      if(data.data.logout){
        History.push('/')
      }
    })
    .catch(err=>{
      console.log(err);
    })
  }

  
    getDashboard(){
        History.push('/'+this.state.username)
         window.location.reload();
  }
    changeInput(e){
        console.log(e.target.value)
        this.setState({
        search:e.target.value       
        })
    }
    acceptCall(e){
        this.setState({modal:false});
        var view=window.open("http://localhost:4000/r/"+this.state.room+"/"+this.state.firstName,"_blank")
													view.focus(); 

    }
 

  render() {
   const Notification=()=>{
   

    if(this.state.notiLoading){
     return(

       <div className="notfication-details" >
     
      <div style={{textAlign:'center'}}>   <Dots color="#788EA8" animating={true} size={24} speed={1}  /></div>
    </div>
       )
    }
    else{
    const Noti=this.state.notification.map((el,i)=>{
        let im=""
        if( el['othersId']!==undefined && el['othersId'].photo!==undefined){

            im=base64ArrayBuffer(el['othersId'].photo.data.data)
        return(
        <div className="notfication-details" key={i}>
        <div className="noty-user-img">
            <img src={`data:image/jpeg;base64,${im}`} className="rounded-circle" alt="profile picture" style={{width:'35',height:'35'}}/>
        </div>
        <div className="notification-info" onClick={()=>{History.push(el['notLink']); window.location.reload();}} style={{cursor:'pointer'}}>
            <h3><Link to="#" >{el['othersId'].firstName+" "+el['othersId'].lastName}</Link></h3>
            <p>{el.text}.</p>
            <span style={{bottom:'60px'}}><TimeAgo datetime={el.createdAt}/></span>
        </div>
        
    </div>
        )
        }
    })
    return Noti;
  }
}

   
//    const Messages=()=>{
//        return(
//         <div className="notfication-details">
//         <div className="noty-user-img">
//             <img src="/images/resources/ny-img1.png" alt=""/>
//         </div>
//         <div className="notification-info">
//             <h3><Link to="messages.html" >Jassica William</Link> </h3>
//             <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do.</p>
//             <span>2 min ago</span>
//         </div>
//     </div>
//        )
//    }
   return(
           <header>
               <Modal
            centered
          isOpen={this.state.modal}>

          <ModalHeader>{"Accept Invitation?"}</ModalHeader>
          <ModalBody>
          <div className="noty-user-img">
            <img src={`data:image/jpeg;base64,${this.state.calleePic}`} className="rounded-circle" alt="profile picture" style={{width:'35',height:'35'}}/> {'  '} is inviting you in video room
        </div>
          
         
          </ModalBody>
          <ModalFooter>
            <Button onClick={()=>{
              this.setState({
                  modal:false,
                  
              })
            }} color="primary" autoFocus>
              No
            </Button>
            <Button onClick={this.acceptCall.bind(this)} color="secondary">
              Yes
            </Button>
          </ModalFooter>
        </Modal>
    <div className="container">
        <div className="header-data">
            <div className="logo">
                <Link to={"/"+this.state.username} ><img src="/tutors.png" alt="tutors-logo" style={{width:'40px',height:'40px'}}/></Link>
            </div>
            {/* <!--logo end--> */}
            <div className="search-bar">

              {this.props.verify?  <form onSubmit={()=>{History.push("/search?search="+this.state.search) }}>
                    <input type="text" onChange={this.changeInput.bind(this)} name="search" placeholder="Search..."/>
                    <button type="submit"><i className="la la-search"></i></button>
                </form>:<span/>}
            </div>
            {/* <!--search-bar end--> */}
            <nav>
                {this.props.loggedIn? 
                <ul>
                  {this.props.verify?  <li>
                        <Link to="#" onClick={this.getDashboard.bind(this)} >
                            <span><i className="fa fa-home" ></i></span>
                            Home
                        </Link>
                    </li>:
                                   <li>
                                                   <Link to={"/"+this.state.username} >
                                                       <span>{'   '}<i className="fa fa-sign-out" ></i></span>
                                                       Logout
                                                   </Link>
                                               </li>
                                    
                    }
                    
                    {this.props.verify? <li>
                        <Link to="/search" >
                            <span>
                                <i className="fa fa-search"></i>
                                </span>
                            Search
                        </Link>
                    </li>:<li/>}
                    
                    
                    {this.props.verify?
                    <li>
                       <div style={{position:"relative"}}>
                        <Link to="#" onClick={()=>{notifier.emit('clearMessanger'); History.push('/messanger');window.location.reload()}}  className="not-box-open" >
                            <span><img src="/images/icon6.png" alt="messages"/>
                            
                        
 </span>
                            Messages
</Link>
                    {this.state.mCounter>0?
                      <span style={{position:"absolute",top:"-1px",right:"-40px",left:"0px",color:"red"}}>{this.state.mCounter}</span>
                    :<span/>}


                
                    </div>
                    </li>:
                    <li/>}
                {this.props.verify?
                    <li>
                    <div style={{position:"relative"}}>
                        <Link to="#"  className="not-box-open" onClick={this.onFetchNotify.bind(this)}>
                            <span><img src="/images/icon7.png" alt=""/></span>
                            Notification
                        </Link>
                        {this.state.counter>0?
                        <span style={{position:"absolute",top:"1px",right:"-40px",left:"-2px",color:"red"}}>{this.state.counter}</span>
                            :<span/>}
                        </div>
                      {this.state.notficationDialog?  
                      <div className="notification-box active">
                            <div className="nt-title">
                         
                            </div>
                            <div className="nott-list" style={{overflowY:'auto'}}>
                             <Notification/>
                          
                            </div>
                            {/* <!--nott-list end--> */}
                        </div>:<div/>}
                        {/* <!--notification-box end--> */}
                    </li>:<li/>}
                </ul>:
              <span/>
                // <ul>
                //                 <li>
                //                 <Link to={"/"+this.state.username} >
                //                     <span><i className="fa fa-sign-in" ></i></span>
                //                     Login
                //                 </Link>
                //             </li>
                //             <li>
                //                 <Link to="/register" >
                //                     <span><i className="fa fa-address-book" ></i></span>
                //                     Register
                //                 </Link>
                //             </li>
                //     </ul>
        }
            </nav>
            {/* <!--nav end--> */}
            {this.props.loggedIn?
            <div className="menu-btn">
                <Link to="#" ><i className="fa fa-bars"></i></Link>
            </div>:<span/>}
        
            {/* <!--menu-btn end--> */}
        {this.props.verify?
        
            <div className="user-account">
                <div className="user-info" onClick={()=>{this.setState({toggleMenu:!this.state.toggleMenu})}}>
                    <img src={`data:image/jpeg;base64,${this.state.photo}`} style={{width:'30px',height:'30px'}} alt=""/>
                    <Link to="#" >{this.state.firstName}</Link>
                    <i className="la la-sort-down"></i>
                </div>  
                {this.state.toggleMenu? <div className="user-account-settingss active">
                    {/* <!--search_form end--> */}
                    <h3 >Setting</h3>
                    <ul className="us-links">
                        <li><Link to="/settings" >Account Setting</Link></li>
                        <li><Link to="#" >Privacy</Link></li>
                        <li><Link to="#" >Faqs</Link></li>
                        <li><Link to="#" >Terms {'&'} Conditions</Link></li>
                    </ul>
                    <h3 className="tc" onClick={this.logout.bind(this)}><Link to="#" >Logout</Link></h3>
                </div>:<div/>}
                {/* <!--user-account-settingss end--> */}
            </div>:<div/>}
        </div>
        {/* <!--header-data end--> */}
    </div>
</header>
         
   )
  }
}


export default PrimarySearchAppBar;