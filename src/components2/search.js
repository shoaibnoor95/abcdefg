import React, {Component} from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import TimeAgo from 'timeago-react';
import Nav from './Nav';
import {notifier} from './main'
import Dots from 'react-activity/lib/Dots';
import {Modal,ModalHeader,ModalFooter,ModalBody} from 'reactstrap'
import { base64ArrayBuffer } from './base64';
class Search extends React.Component{
	constructor(props){
		super(props);
		this.state = {
		  dataSource: [],
		  search:"",
		  value:'',
		  results:[],
		  results2:[],
		  error:'',
		  message3:'',
		  loading:true,
		  type:'',
		  stats:{},
		  viewId:'',
		  img:'',
		  fullname:'',
		  viewList:0,
		  loading3:false,
		  fullname:'',
		  requiredSpecs:'',
		  studentGender:'',
		  username:'',
		  headings:'',
		  dialogOpen:false,
		  operation:'',
		  myId:'',
		  pId:'',
		  applied:[],
		  area:'',
		  city:"",
		  gender:"",
		  pArea:"",
		  posterId:''
		};	
	  }
	  componentDidMount(){
		console.log(this.props)
		 if(this.props.location.search.indexOf("=")!==-1){
			 let par=this.props.location.search;
			 var set=par.slice(8) 
			 this.setState({
				loading:true,
				results2:[]
			})
			let parameter={
				value:set.trim()
			}
	
            Axios({
            	  url:'/DoSearch',
            	  method:'post',
            	  data:parameter,
            	  withCredentials:true
            	  
            	})
            	.then((data)=>{
				console.log(data.data)
            	 if(data.data){
            
            	   this.setState({
            		 results:data.data,
					 loading:false,
					 
            		})
            	  }
            	//   else{
            	// 	this.setState({
            	// 	  results:data.data,
				// 	  loading:false,
					  
            	// 	 })
            		 
            	//   }
            	})
            	.catch((error)=>{
            	  this.setState({error:'Could not proceed with the request'})
            	})
			   
			}		
		else{
			Axios({
			   url:'/onSearch',
			   method:'get',
			   withCredentials:true,
			 }).then(data=>{
				 console.log(data.data)
			   if(data.data.posts){
				 this.setState({
				   results2:data.data,
				   loading:false,
				   stats:data.data.stats,
				   myId:data.data.id	  
				 })
			   }
			  })
			  .catch(err=>{
				this.setState({
				  error:'Could not proceed with the request'
				})
			  })
			  
		  	 }
			}
			performOperation(){
				switch(this.state.operation){
					case 'apply':
					console.log(this.state.myId)
					let text = {
						pId: this.state.pId,
						userId:this.state.posterId
					}
					let apply = this.state.applied;
			
					apply.push(this.state.myId)
					let stats=this.state.stats;
					stats['RemainingConnect']=this.state.stats['RemainingConnect']-1;
					//stats['connsume']=this.state.stats['connsume']+1;
					this.setState({
						applied: apply,
						dialogOpen:false
					})
					Axios({
						withCredentials: true,
						data: text,
						method: 'post',
						url: '/applyTuition'
					})
						.then(data => {
							console.log(data.data)
							if (!data.data.received) {
			
								apply.pop()
								this.setState({
									applied: apply,
									dialogOpen:false,
								})
							}
							notifier.emit("applyTuitions",{userId:this.state.posterId,id:this.state.pId})
						})
						.catch(error => {
							this.setState({
								message: 'Could not proceed with the request'
							})
						})
					break;
					case 'cancel':
					let text2 = {
						pId: this.state.pId
					}
					let apply2 = this.state.applied;
					let applied = apply2.filter((element) => {
						return element != this.state.myId
					});
					
					this.setState({
						applied: applied,
						dialogOpen:false,
					})
					Axios({
						withCredentials: true,
						data: text2,
						method: 'post',
						url: '/unApply'
					})
						.then(data => {
						console.log(data.data)
							if (!data.data.received) {
								let apply = this.state.applied;
									apply.push(this.state.pId)
								
								this.setState({
									applied: apply,
									dialogOpen:false,
								})
							}
						})
						.catch(error => {
							let apply = this.state.applied;
									apply.push(this.state.pId)
								
								this.setState({
									applied: apply,
									dialogOpen:false,
								})
						})
					break;
		
					default:break;
				}
		
			}		
	toggleRequest(message3,headings,operation,pId,event){
		event.preventDefault();
		 this.setState({
			 headings:headings,
			 dialogOpen:true,
			 message3:message3,
			 operation:operation,
			 pId:pId

			
			}) 
	}
		
	
	submitSearch=()=>{
	  var value=this.state.value
		console.log(this.state.value)
	  if(this.state.value!=="" && this.state.value!==null){
	this.setState({
					loading:true,
					results2:[]
				})
		let parameter={
				value:value.trim(),
				city:this.state.city.trim(),
				area:this.state.area.trim(),
				gender:this.state.gender.trim()
		}
	Axios({
		  url:'/DoSearch',
		  method:'post',
		  data:parameter,
		  withCredentials:true
		  
		})
		.then((data)=>{
		 if(data.data){
			console.log(data.data.posts)
		   this.setState({
			 results2:data.data,
			 loading:false
			})
		  }
		//   else{
		// 	this.setState({
		// 	  results:data.data,
		// 	  loading:false
		// 	 })
			 
		  //}
		})
		.catch((error)=>{
		  this.setState({error:'Could not proceed with the request'})
		})
	  }
	}
	  handleUpdateInput = (value) => {
	   if(value!=undefined && value!==""){
		this.setState({value:value})
	  }
		Axios({
			url:'/searching',
			method:'get',
			params:{
			  search:value
			}
		  }).then(data=>{
		   
	 var search=data.data.users.map((suggest)=>{
	   return suggest.teach[0];
	  })
			this.setState({
			  dataSource: search
			});
		  }).catch(err=>{
			console.log(err);
		  })     
	  };
	  viewProposal(id,e){
	  e.preventDefault();
	  this.setState({
		  loading3:true,
		  viewId:id
	  })
	 Axios({
		 withCredentials:true,
		 data:{
			 identity:id
		 	},
		 method:'post',
		 url:'/singlePosting'
	 })
	 .then(data=>{
		 console.log(data.data)
		 let img=base64ArrayBuffer(data.data.user.photo.data.data)
		 this.setState({
			 img,
			 fullname:data.data.user.firstName+" "+data.data.user.lastName,
			 viewList:data.data.post.views,
			 loading3:false,
			 requiredSpecs:data.data.post.requiredTeacherSpecification,
			 studentGender:data.data.post.studentGender,
			 username:data.data.user.username,
			 applied:data.data.post.applied,
			 pArea:(data.data.post.area)==undefined?data.data.post.favoriteArea:data.data.post.area,
			 posterId:data.data.user._id
			})
	 })
	 .catch(err=>{

	 		})	
	  }
	 
	render(){
		const Post=()=>{
			if(this.state.results2.posts==undefined){
				return <div/>
			}
			else {
				const post=this.state.results2.posts.map((el,i)=>{
				if(el['class']!=null)
				{			
			return(
					<div className="post-bar" key={i}>
					<div className="post_topbar">
					{el['_id']==this.state.viewId?
					<div className="usy-dt">
                    <img src={`data:image/jpeg;base64,${this.state.img}`} style={{width:'50px',height:'50px'}} alt=""/>
					<div className="usy-name" style={{cursor:'pointer'}} onClick={(e)=>{var view=window.open("/"+this.state.username,"_blank")
													view.focus()}}>
                        <h3>{this.state.fullname}</h3>
                        <span><img src="images/clock.png" alt=""/><TimeAgo datetime={el.date}/></span>
                    </div>
                </div>
					:
					<span><img src="images/clock.png" alt=""/>{'  '}<TimeAgo datetime={el.date}/></span>}
					</div>
				
						  <div className="job_descp">
						  <div  style={{textAlign:'center',fontSize:'100%'}}>Class and board{' '} <Link to="#"><i className='fa fa-file-text' > </i> </Link></div>
						  <div  style={{border:'1px solid #efefef'}}>{el['class']}</div> 
						  <div  style={{textAlign:'center',fontSize:'100%'}}>City{' '}<Link to="#"><i className='fa fa-building' style={{color:'red'}}> </i></Link> </div>
						  <div  style={{border:'1px solid #efefef'}}>{el['city']}</div>
						{this.state.viewId==el['_id']?
						<span>
							<div  style={{textAlign:'center',fontSize:'100%'}}>Area{' '}<Link to="#"><i className='fa fa-home' style={{color:'green'}}> </i></Link> </div>
						  <div  style={{border:'1px solid #efefef'}}>{this.state.pArea}</div>
						  <div  style={{textAlign:'center',fontSize:'100%'}}>Student Gender{' '}<Link to="#"><i className='fa fa-male' style={{color:'red'}}> </i></Link> <Link to="#"><i className='fa fa-female' style={{color:'blue'}}> </i></Link> </div>
						  <div  style={{border:'1px solid #efefef'}}>{this.state.studentGender}</div> 
						  <div  style={{textAlign:'center',fontSize:'100%'}}>Required Teacher Specification{' '}<Link to="#"><i className='fa fa-circle-o' style={{color:'red'}}> </i></Link> </div>
						  <div  style={{border:'1px solid #efefef'}}>{this.state.requiredSpecs}</div> 
						  </span>:<span/>}
						  <div  style={{textAlign:'center',fontSize:'100%'}}>Category{' '}<Link to="#"><i className='fa fa-tags' style={{color:'#007bff' }}> </i></Link> </div>
						  <ul className="skill-tags">
						  <li><Link to="#" >{el['category'][0]}</Link></li>
						  <li><Link to="#" >{el['category'][1]}</Link></li>
						  <li><Link to="#" >{el['category'][2]}</Link></li>
						  </ul>
						  </div>
						  {(this.state.viewId==el['_id']) && (!this.state.loading3)?
						  <div className="job-status-bar">
							{this.state.applied.indexOf(this.state.myId)==-1?
							 <button  className="btn btn-outline-primary btn-sm" onClick={this.toggleRequest.bind(this,"Are you sure you want to apply for this tuition/offer you can unapply at any time but the consume connect will not refund","Confirm apply","apply",el['_id'])}>Apply</button>
							 :
							 <button  className="btn btn-outline-primary btn-sm" onClick={this.toggleRequest.bind(this,"Are you sure you want to unapply from this tuition/offer but the consume connect will not refund","Confirm cancel","cancel",el['_id'])}>Unapply</button>
							}
							<Link to="#"><i className="la la-eye"></i>Views {this.state.viewList}</Link>
							
										  </div>
						  :
										  <div className="job-status-bar">
										  {(this.state.loading3 && this.state.viewId==el['_id'])? <Dots color="#788EA8" animating={true} size={14} speed={1}  />
											  :<button  className="btn btn-outline-primary btn-sm" onClick={this.viewProposal.bind(this,el['_id'])}>View</button>}
											 {this.state.viewId==el["_id"]?	
											  <Link to="#"><i className="la la-eye"></i>Views {this.state.viewList}</Link>
											  :<div/>}
											  </div>
						  }
									  </div>
				
									)
			}
			else{
				return(
					<div className="post-bar" key={i}>
					<div className="post_topbar">
					{el['_id']==this.state.viewId?
					<div className="usy-dt">
                    <img src={`data:image/jpeg;base64,${this.state.img}`} style={{width:'50px',height:'50px'}} alt=""/>
                    <div className="usy-name" style={{cursor:'pointer'}} onClick={(e)=>{var view=window.open("/"+this.state.username,"_blank")
													view.focus()}}>
                        <h3>{this.state.fullname}</h3>
                        <span><img src="images/clock.png" alt=""/><TimeAgo datetime={el.date}/></span>
                    </div>
                </div>
					:
					<span><img src="images/clock.png" alt=""/>{'  '}<TimeAgo datetime={el.date}/></span>}
					</div>
				
						  <div className="job_descp">
						  <div  style={{textAlign:'center',fontSize:'100%'}}>Offer Content{' '}<Link to="#"><i className='fa fa-text' style={{color:'red'}}> </i></Link> {' '}<Link to="#"><i className='fa fa-male'> </i></Link> </div>
						  <div  style={{border:'1px solid #efefef'}}>{el['offerContent']}</div> 
						  <div  style={{textAlign:'center',fontSize:'100%'}}>City{' '}<Link to="#"><i className='fa fa-building' style={{color:'red'}}> </i></Link> </div>
						  <div  style={{border:'1px solid #efefef'}}>{el['city']}</div> 
						  {el['_id']==this.state.viewId?<span> <div  style={{textAlign:'center',fontSize:'100%'}}>Favorite Area{' '}<Link to="#"><i className='fa fa-heart' style={{color:'red'}}> </i></Link> </div>
						  <div  style={{border:'1px solid #efefef'}}>{this.state.pArea}</div></span> :<div/>}
						  <div  style={{textAlign:'center',fontSize:'100%'}}>Category{' '}<Link to="#"><i className='fa fa-tags' style={{color:'#007bff' }}> </i></Link> </div>
						  <ul className="skill-tags">
						  <li><Link to="#" >{el['category'][0]}</Link></li>
						  <li><Link to="#" >{el['category'][1]}</Link></li>
						  <li><Link to="#" >{el['category'][2]}</Link></li>
						  </ul>
						  </div>
							{(this.state.viewId==el['_id']) && (!this.state.loading3)?
						  <div className="job-status-bar">
							 {this.state.applied.indexOf(this.state.myId)==-1?
							 <button  className="btn btn-outline-primary btn-sm" onClick={this.toggleRequest.bind(this,"Are you sure you want to apply for this tuition/offer you can unapply at any time but the consume connect will not refunded","Confirm apply","apply",el['_id'])}>Apply</button>
							 :
							 <button  className="btn btn-outline-primary btn-sm" onClick={this.toggleRequest.bind(this,"Are you sure you want to unapply from this tuition/offer but the consume connect will not refunded","Confirm cancel","cancel",el['_id'])}>Unapply</button>
							}
							<Link to="#"><i className="la la-eye"></i>Views {this.state.viewList}</Link>
							
										  </div>
						  :
										  <div className="job-status-bar">
										  {(this.state.loading3 && this.state.viewId==el['_id'])? <Dots color="#788EA8" animating={true} size={14} speed={1}  />
											  :<button  className="btn btn-outline-primary btn-sm" onClick={this.viewProposal.bind(this,el['_id'])}>View</button>}
											 {this.state.viewId==el["_id"]?	
											  <Link to="#"><i className="la la-eye"></i>Views {this.state.viewList}</Link>
											  :<div/>}
											  </div>
						  }
									  </div>
				
				)
			}
			})
			return post
		}
		
			
		}
        return(

<div>			<Nav verify={true} loggedIn={true} showMessageCounter={true}
	                counter={this.state.stats.notifyCounter}
					messageCounter={this.state.stats.messageCounter}
	/>
	
						<div className="wrapper">
		<br/><br/><br/>		<div className="search-sec">
			<div className="container">
				<div className="search-box">
					<form onSubmit={(e)=>{e.preventDefault()}}>
					<AutoComplete
		                  style={{width:'92%'}}			
		                  textFieldStyle={{flex:1,width:'92%'}}
		                  underlineShow={false}
		                  textareaStyle={{width:'92%'}}
		                  onClose={this.submitSearch}
                      hintText="Search for tutor or tutions"
                      dataSource={this.state.dataSource}
                      onUpdateInput={this.handleUpdateInput}
          
            
        />
				        <Modal isOpen={this.state.dialogOpen} centered>

          <ModalHeader>{this.state.headings +"?"}</ModalHeader>
          <ModalBody>
              {this.state.message3}
           </ModalBody>
          <ModalFooter>
            <button onClick={()=>{
              this.setState({
                  dialogOpen:false,
              })
            }} className="btn btn-secondary" >
              No
            </button>
            <button onClick={this.performOperation.bind(this)} className="btn btn-primary" autoFocus>
              Yes
            </button>
         </ModalFooter>
				  </Modal>
						{/* <input type="text" name="search" placeholder="Search keywords"/> */}
						<button type="submit">Search</button>
					</form>
				</div>
				{/* <!--search-box end--> */}
			</div>
		</div>
		{/* <!--search-sec end--> */}


		<main>
			<div className="main-section">
				<div className="container">
					<div className="main-section-data">
						<div className="row">
							<div className="col-lg-3">
								<div className="filter-secs">
									<div className="filter-heading">
										<h3>Filters</h3>
										<Link to="#"  onClick={(e)=>{e.preventDefault(); this.setState({area:'',city:'',gender:''})}}>Clear all filters</Link>
									</div>
									{/* <!--filter-heading end--> */}
									<div className="paddy">
										<div className="filter-dd">
											<div className="filter-ttl">
												<h3>Area</h3>
												<Link to="#"  onClick={(e)=>{e.preventDefault(); this.setState({area:''})}}>Clear</Link>
											</div>
											<form>
												<input type="text" value={this.state.area} name="search-skills"
												 onChange={(e)=>{  
											    let sym=/<|>/g;
                                                if(!e.target.value.match(sym)|| e.target.value==""){
                                                    this.setState({
                                                        area:e.target.value
                                                     })
                                                 }}} placeholder="Search Area"/>
											</form>
										</div>
										<div className="filter-dd">
											<div className="filter-ttl">
												<h3>Gender</h3>
												<Link to="#"  >Clear</Link>
											</div>
											<ul className="avail-checks">
												<li>
													<input type="radio" value="Male" onClick={(e)=>{this.setState({gender:e.target.value})}} name="gender" id="c1"/>
													<label htmlFor="c1">
														<span></span>
													</label>
													<small>Male</small>
												</li>
												<li>
													<input type="radio" value="Female" onClick={(e)=>{this.setState({gender:e.target.value})}} name="gender" id="c2"/>
													<label htmlFor="c2">
														<span></span>
													</label>
													<small>Female</small>
												</li>
												
											</ul>
										</div>
										<div className="filter-dd">
											<div className="filter-ttl">
												<h3>City</h3>
												<Link to="#" >Clear</Link>
											</div>
											<form className="job-tp">
												<select defaultValue={this.state.city} onChange={(e)=>{this.setState({city:e.target.value})}} >
													<option value="">Select a city</option>
													<option value="Karachi">Karachi</option>
													<option value="Lahore">Lahore</option>
													<option value="Peshawar">Peshawar</option>
													<option value="Quetta">Quetta</option>
													<option value="Nohshehra">Nohshehra</option>
													<option value="Daddu">Daadu</option>
													<option value="Rahim yaar">Rahim yaar khan</option>
													<option value="Multan">Multan</option>
													<option value="Faisalabad">Faisalabad</option>
													<option value="Islamabad">Islamabad</option>
													<option value="Sahewal">Sahewal</option>
													<option value="Larkaba">Larkana</option>
													<option value="Rawalpindi">Rawalpindi</option>
												</select>
												<i className="fa fa-ellipsis-v" ></i>
											</form>
										</div>
			
									</div>
								</div>
								{/* <!--filter-secs end--> */}
							</div>
							<div className="col-lg-6">
								<div className="main-ws-sec">
									<div className="posts-section">
										<Post/>				
										{/* <!--posty end--> */}
										<div className="process-comm">
											<Link to="#" ><img src="images/process-icon.png" alt=""/></Link>
										</div>
										{/* <!--process-comm end--> */}
									</div>
									{/* <!--posts-section end--> */}
								</div>
								{/* <!--main-ws-sec end--> */}
							</div>
							<div className="col-lg-3">
								<div className="right-sidebar">

									{/* <!--widget-about end--> */}
									<div className="widget widget-jobs">
										<div className="sd-title">
											<h3>My Statistics</h3>
											<i className="la la-ellipsis-v"></i>
										</div>
										<div className="jobs-list">
										{(this.state.stats.tutionRemaining!=-1&&this.state.stats.tutionRemaining!==undefined)?	<div className="job-info">
												{console.log(this.state.stats.tutionRemaining)}
												<div className="job-details">
													<h3>Tuition Remaining</h3>
												</div>
												<div className="hr-rate">
													<span>{this.state.stats.tutionRemaining}</span>
												</div>
											</div>:
										
										<div className="job-info">
										<div className="job-details">
											<h3>Offer Remaining</h3>
										</div>
										<div className="hr-rate">
											<span>{this.state.stats.offerRemaining}</span>
										</div>
									</div>	
									}

											{/* <!--job-info end--> */}
											<div className="job-info">
												<div className="job-details">
													<h3>Connects Remaining</h3>
												</div>
												<div className="hr-rate">
													<span>{this.state.stats.RemainingConnect}</span>
												</div>
											</div>
														{/* <!--job-info end--> */}
										</div>
										{/* <!--jobs-list end--> */}
									</div>
									{/* <!--widget-jobs end--> */}
									
								</div>
								{/* <!--right-sidebar end--> */}
							</div>
						</div>
					</div>
					{/* <!-- main-section-data end--> */}
				</div> 
			</div>
		</main>
	{/* <!--theme-layout end--> */}
	</div>
	</div>
	)
    }
}
export default Search;