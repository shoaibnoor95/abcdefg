import React from 'react';
import Nav from './Nav';
import {Link} from 'react-router-dom';
import {base64ArrayBuffer} from './base64';
import Axios from 'axios';
import {notifier} from './main';
import {connect} from 'react-redux';
import {Profiles} from '../store/action/apiAction';	
import Modals from './Modal';
import { Button as ModalButton, Modal,  ModalBody, ModalFooter,ModalHeader } from 'reactstrap';
import Postdata from './Postdata';
import Footer from './Footer';
import Dots from 'react-activity/lib/Dots';
import Info from './Info';
import Notfound from './Notfound';
import History from '../History';
    
class Home extends React.Component{
	constructor(props){
		super(props); 
	this.consumption=this.consumption.bind(this)
	this.togglePicture=this.togglePicture.bind(this)
	this.state = {
		img:"",
		from:"",
		qualification:"",
		type:'',
		moto:"",
		email:"",
		fullname:'',
		specialization:"",
		institute:'',
		teach:'',
		notVerified:false,
		coverModal:false,
		pictureModal:false,
		myProfile:true,
		img2:'',
		loading:true,
		emailAuth:true,
		hover:false,
		stats:{},
		_id:'',
		dialog:false,
		message:'',
		operation:'',
		request:false,
		friend:false,
		modal:false,
		respond:false,  
		profileFound:true,
		approved:true,
		acc:false,
		pType:'',
		pSize:'',
		feed:true,
		friendsCount:'',
		requestCount:''
	 }
 }
 componentDidMount() {
	this.props.bringUser(this.props.match.params.id.trim());
  	}
  
  
  componentWillReceiveProps(nextProps){
	console.log(nextProps)
	if(nextProps.profile.notFound){
		this.setState({profileFound:false})
		return;
	}
	  else if(!nextProps.profile.emailAuth  && nextProps.profile.otherProfile)
	{
	  this.setState({
		  notVerified:true
	  })  
	  return; 
	}
	else {
	  if(nextProps.profile.user==undefined)  {
		  this.setState({profileFound:false,loading:false})
		  return;
	  }
	  else{
		if(!nextProps.profile.user.auth){
			History.push('/files')
		  }
	  
	else{ 
		if(!nextProps.profile.user.user.myProfile){
			this.setState({
				myProfile:false
			})
		}
		var pic2=nextProps.profile.user.user.coverPhoto.coverPhoto.data.data;
		var pic=nextProps.profile.user.user.photo.data.data;
		let ac=false;
		if(nextProps.profile.user.user.type=='teacher'){
			ac=true
		}
		let base64String =    base64ArrayBuffer(pic);
		let base64String2 =   base64ArrayBuffer(pic2);
		this.setState({
		   emailAuth:nextProps.profile.user.user.emailAuth,
		   approved:nextProps.profile.user.user.approved,
		   fullname:nextProps.profile.user.user.full_name,
		   from:nextProps.profile.user.user.from, 
		   qualification:nextProps.profile.user.user.qualification,
		   specialization:nextProps.profile.user.user.specialization,
		   moto:nextProps.profile.user.user.moto,
		   img:base64String,
		   img2:base64String2,
		   type:nextProps.profile.user.user.type,
		   loading:false,
		   stats:nextProps.profile.stats,
		   _id:nextProps.profile.user.user._id,
		   hover:!nextProps.profile.stats.availablity,
		   request:nextProps.profile.user.user.request,
		   friend:nextProps.profile.user.user.friend,
		   respond:nextProps.profile.user.user.respond,
		   acc:ac,
		   friendsCount:nextProps.profile.user.user.friendsCount,
		   requestCount:nextProps.profile.user.user.requestsCount
		  })
	  }
  }
  }
}
onToggle(type,message,event){
event.preventDefault();
this.setState({
  operation:type,
  message:message,
  modal:true
})
}

onChoose(event){
  event.preventDefault();

  switch(this.state.operation){
  case 'removeRequest':
  this.setState({respond:false,modal:false})
  Axios({
	  url:'/removeRequest',
	  method:'post',
	  withCredentials:true,
	  data:{
		  _id:this.state._id
	  }
  })
  .then(data=>{
	  if(!data.data.ok){
	  
		  this.setState({
			  respond:true
		  })
	  }
		})
  .catch(err=>{
	  this.setState({
		  respond:true
	  })
  })
  break;
  case 'onRemove':
  this.setState({
	  friend:false,
	  request:false,
	  modal:false,
  })
  Axios({
	  url:'/removeFriend',
	  method:'post',
	  withCredentials:true,
	  data:{
		  _id:this.state._id
	  }
  })
  .then(data=>{
	  if(!data.data.ok){
	  
		  this.setState({
			  friend:true,
		  
		  })
	  }
  })
  .catch(err=>{
	  this.setState({
		  friend:true
	  })
  }) 
  break;

  case 'cancleRequest':
  this.setState({
	  request:false,
	  modal:false,
  })
   Axios({
	   url:'/cancleRequest',
	   method:'post',
	   data:{
		   _id:this.state._id
	   },
	   withCredentials:true        
   })
   .then(data=>{
	   if(!data.data.ok){
		   this.setState({
			   request:true,
		   })
	   }
   })
   .catch(err=>{
	   this.setState({
		   request:true,
	   })
   })
	  break;

  case 'addfriend':
  this.setState({friend:true,respond:false,request:false,modal:false})
  Axios({
	  url:'/addfriend',
	  method:'post',
	  data:{
		  _id:this.state._id
	  },
	  withCredentials:true
  })
  .then(data=>{
	  if(!data.data.ok){
		  this.setState({friend:true,respond:false})
		  return;
	  }
	  notifier.emit('acceptInvite',{id:this.state._id})
	  let stats=this.state.stats;
	  stats['messageCounter']=+1
	  this.setState({stats:stats})
  })
  .catch(err=>{
	  this.setState({friend:true,respond:false}) 
  })
  break;
  case 'onOccupied':
  this.setState({hover:true,modal:false}) 
  Axios({
	  url:'/availablityChanger',
	  method:'post',
	  data:{
		  available:false
	  },
	  withCredentials:true,
  })
  .then(data=>{
	  if(!data.data.success){

		  this.setState({hover:false})
		  return;
	  }


  })
  .catch(err=>{
	  this.setState({hover:false})      
  })
	  break;
  case 'onMakeRequest':
  this.setState({
	  request:true,
	  modal:false
  })
  Axios({
	  url:'/makeRequest',
	  withCredentials:true,
	  data:{
		  person:this.state._id
	  },
	  method:'post'
  })
  .then(data=>{
	  if(!data.data.ok){

		  this.setState({
			  request:false
		  })
	  }
	  notifier.emit('makeRequest',{id:this.state._id,type:'ivitationRequest'})

  })
  .catch(err=>{
	  this.setState({
		  request:false
	  })
  })
  break;

  default: 
		  return;
}
}

consumption(){
  let stats=this.state.stats;
  if(this.state.myProfile){

	  if(stats.offerRemaining==-1){
		  stats.tutionRemaining=stats.tutionRemaining-1;
	  }
	  else{
		  stats.offerRemaining=stats.offerRemaining-1;
	  }
	  this.setState({
		  stats
	  })
  }
  else{
	  stats.connsume=stats.connsume+1;
	  stats.RemainingConnect=stats.RemainingConnect-1
	  this.setState({
		  stats
	  })
  }
  }
onAvailable(event){
  event.preventDefault();
  this.setState({hover:false})
  if(this.state.myProfile){
  Axios({
	  url:'/availablityChanger',
	  method:'post',
	  data:{
		  available:true
	  },
	  withCredentials:true,
  })
  .then(data=>{
	  if(!data.data.success)
	  this.setState({hover:true})
  })
  .catch(err=>{
	  this.setState({hover:true})
	  
  })
   }
  }
  togglePicture(e){
	  e.preventDefault();
	  this.setState({pictureModal:!this.state.pictureModal})
  }

	render(){
        return(
            <div>
	    <Nav verify={true} loggedIn={true} counter={this.state.stats.notifyCounter} mCounter={this.state.stats.messageCounter}  showMessageCounter={true}/>       
		 
		<br/>
		{!this.state.emailAuth?
		<div className="alert alert-danger" role="alert" style={{height:'40px',marginTop:'60px'}}>
  
  Please verify your email to enjoy full functionality
</div>
	:<span/>}
		{(!this.state.approved && this.state.emailAuth)?
		<div className="alert alert-success" role="alert" style={{height:'40px',marginTop:'60px'}}>
  Comeback with in 24-48 hours your profile is under review for approval
</div>
	:<span/>}
	<br/>
	{this.state.profileFound?
	<div> 
	<Modal centered isOpen={this.state.modal} className={this.props.className}>
                   <ModalHeader>Confirmation </ModalHeader>
                   <ModalBody>{this.state.message}</ModalBody>
                 <ModalFooter> <ModalButton color='primary' onClick={this.onChoose.bind(this)} >Yes</ModalButton>{' '} <ModalButton color='secondary' onClick={(e)=>{e.preventDefault(); this.setState({modal:false})}} >No</ModalButton> </ModalFooter>
                    </Modal>
		
	<Modals	 open={this.state.pictureModal}   changeModal={this.togglePicture} size={this.state.pSize} img={(this.state.pSize=='sm')?this.state.img:this.state.img2}/>
		<section className="cover-sec">
			<img src={`data:image/jpeg;base64,${this.state.img2}`} style={{maxHeight:'283.75px'}} alt=""/>
			{this.state.myProfile?
			<Link to="#" ><i className="fa fa-camera" onClick={()=>{this.setState({pType:'cover', pSize:'lg', pictureModal:true})}}></i> Change Image</Link>
			:<div/>}
		<div/>
		
		</section>
		<main>
	
	<div className="main-section">
	{!this.state.loading?
	
				<div className="container">
					<div className="main-section-data">
						<div className="row">
							<div className="col-lg-3">
								<div className="main-left-sidebar">
									<div className="user_profile">
									
										{this.state.myProfile?
										<div className="user-pro-img">
											<img src={`data:image/jpeg;base64,${this.state.img}`} style={{width:'170px',height:'170px'}} alt="" className="rounded-circle"/>
											<Link to="#" ><i className="fa fa-camera" onClick={()=>{this.setState({pType:'dp', pSize:'sm', pictureModal:true})}}></i></Link>
										</div>
										:
										<div className="user-pro-img">
										<img src={`data:image/jpeg;base64,${this.state.img}`} style={{width:'170px',height:'170px'}} alt="" className="rounded-circle"/>
										</div>
								
										}
										{/* <!--user-pro-img end--> */}
										{this.state.myProfile?
										<div className="user_pro_status">
											
											
											
											{this.state.hover?
												<ul className="flw-hr">
												<li onClick={this.onAvailable.bind(this)}><Link  to="#"  className="flww"> Available</Link></li>
												<li><Link to="#"    className="hre" > <i className="fa fa-check"></i> Occupy</Link></li></ul>
												:
												<ul className="flw-hr">
												<li><Link to="#"  className="flww"><i className="fa fa-check"></i> Available</Link></li>
												<li onClick={this.onToggle.bind(this,"onOccupied","Are you sure you want to change your status?")}><Link to="#"  className="hre" >Occupy</Link></li>
											</ul>}
											<ul className="flw-status">
												<li>
													<span>Encircle</span>
													<b>{this.state.friendsCount}</b>
												</li>
												<li>
													<span>Requests</span>
													<b>{this.state.requestCount}</b>
												</li>
											</ul>
										</div>:
										<div className="user_pro_status">
											
											
											
											{(this.state.request||this.state.respond)?
											
												<ul className="flw-hr">
											{this.state.respond?	<li onClick={this.onToggle.bind(this,"addfriend","Are you sure you want to add him/her?")}><Link  to="#"  className="flww"> Add</Link></li>:<li><Link  to="#"  className="flww"><i className="fa fa-check"></i> Invited</Link></li>}
											{this.state.respond?	<li onClick={this.onToggle.bind(this,"removeRequest","Are you sure you want to remove his/her request?")}><Link to="#"  className="hre" >Remove</Link></li>:<li onClick={this.onToggle.bind(this,"cancleRequest","Are you sure you want to cancel the request?")}><Link to="#"   className="hre" >  Cancel</Link></li>}
												</ul>
												:
												<ul className="flw-hr">
												{this.state.friend?
												<li ><Link to="#"  className="flww"><i className="fa fa-check"></i> Encircle</Link></li>:<li onClick={this.onToggle.bind(this,"onMakeRequest","Are you sure you want to sent encircle request to him/her?")}><Link to="#"  className="hre"> Invite</Link>
												</li>}
												{this.state.friend?<li onClick={this.onToggle.bind(this,"onRemove","Are your you want to remove him/her?")}><Link to="#"  className="hre" >Remove</Link></li> :<li><Link to="#"  className="flww">Block</Link></li>}
											</ul>}
											<ul className="flw-status">
												<li>
													<span>Encircle</span>
													<b>{this.state.friendsCount}</b>
												</li>
												<li>
													<span>Requests</span>
													<b>{this.state.requestCount}</b>
												</li>
											</ul>
										</div>}
										{/* <h4>Social Links</h4> */}
										<br/>
										<hr/>
										{/* <!--user_pro_status end--> */}
										{/* <ul className="social_links">
											{/* <li><Link to="#" ><i className="la la-globe"></i> www.example.com</Link></li> *
											<li><Link to="#" ><i className="fa fa-facebook-square"></i>facebook.com/john...</Link></li>
											{/* <li><Link to="#" ><i className="fa fa-twitter"></i>Twitter.com/john...</Link></li> *
											<li><Link to="#" ><i className="fa fa-google-plus-square"></i> Http://www.googleplus.com/john...</Link></li>
			
										</ul> */}
									</div>
									{/* <!--user_profile end--> */}
			
										</div>
			
							</div>
							<div className="col-lg-6">
								<div className="main-ws-sec">
									<div className="user-tab-sec">
										<h3>{this.state.fullname}</h3>
										{/* <div className="star-descp">
											<span>Graphic Designer at Self Employed</span>
					
											<Link to="#" >Status</Link>
										</div> */}
										{/* <!--star-descp end--> */}
										<div className="tab-feed st2">
										{this.state.feed?
										<ul>	
										<li  className="active">
											<Link to="#" >
												<img src="images/ic1.png" alt=""/>
												<span>Feed</span>
											</Link>
										</li>
										<li >
											<Link to="#" onClick={()=>{this.setState({feed:false})}} >
												<img src="images/ic2.png" alt=""/>
												<span>Info</span>
											</Link>
												</li>
											</ul>
											:
											
											<ul>
												
										<li>
											<Link to="#" onClick={()=>{this.setState({feed:true})}} >
												<img src="images/ic1.png" alt=""/>
												<span>Feed</span>
											</Link>
										</li>
										<li className="active" >
											<Link to="#" >
												<img src="images/ic2.png" alt=""/>
												<span>Info</span>
											</Link>
												</li>
											</ul>
											
										}
										</div>
										{/* <!-- tab-feed end--> */}
									</div>
									{/* <!--user-tab-sec end--> */}
									
							
									{/* <!--product-feed-tab end--> */}
								
									{!this.state.feed?<Info type={this.state.type} friend={this.state.friend} profile={this.state.myProfile} ide={this.state._id}/>:		<Postdata id={this.props.match.params.id} img={this.state.img} fullname={this.state.fullname} consumption={this.consumption} type={this.state.type} profile={this.state.myProfile} />
}
									{/* <!--product-feed-tab end--> */}
									
									{/* <!--product-feed-tab end--> */}
												
									{/* <!--product-feed-tab end--> */}
								</div>
								{/* <!--main-ws-sec end--> */}
							</div>
							<div className="col-lg-3">
								<div className="right-sidebar">
									{!(this.state.myProfile) && (this.state.friend)?
									<div className="message-btn">
										<Link to="#" ><i className="fa fa-envelope"></i> Message</Link>
									</div>:<div/>}
									<div className="widget widget-portfolio">
										<div className="wd-heady">
											<h3>My statistics</h3>
											<img src="images/photo-icon.png" alt=""/>
										</div>
									
										<div className="pf-gallery">
										{this.state.stats.offerRemaining!=-1?
										<h6 style={{fontWeight:'600'}}>Offers Left {' '} {this.state.stats.offerRemaining} </h6>	
										:<h6 style={{fontWeight:'600'}}>Tuitions Left {' '} {this.state.stats.tutionRemaining} </h6>	
									}
										<br/>
										<h6 style={{fontWeight:'600'}}>Connects Left {' '} {this.state.stats.RemainingConnect} </h6>	
													
										
										
										</div>
										{/* <!--pf-gallery end--> */}
									</div>
									{/* <!--widget-portfolio end--> */}
								</div>
								{/* <!--right-sidebar end--> */}
							</div>
						</div>
					</div>
					{/* <!-- main-section-data end--> */}
				</div> : <div style={{textAlign:'center'}}>   <Dots color="#788EA8" animating={true} size={44} speed={1}  /></div>}
			</div>
		</main>
		</div>:<Notfound/>}
		<Footer/>
		{/* <!--footer end--> */}

		

		
            </div>
        )
    }
}

function mapStateToProps(state){
    return({
        profile:state.apiReducer.user
    })
}
function mapDispatchToProps(dispatch){
    return({
        bringUser:(param)=>{ 
            dispatch(Profiles(param)); 
        }
        
    })
}
export default connect(mapStateToProps,mapDispatchToProps) (Home);