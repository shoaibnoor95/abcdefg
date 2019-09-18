import React, {Component} from 'react';
import {Input} from '@material-ui/core'
import { notifier,messenger } from './main';
import Axios from 'axios';
import {Link} from 'react-router-dom';
import TimeAgo from 'timeago-react';
// import {Dots} from 'react-activity'
import Nav from './Nav';
import {encodeHtml} from './filterHtml';
import History from '../History';
import Chips,{Chip} from 'react-chips';
import Dots from 'react-activity/lib/Dots';
import {Modal,ModalHeader,ModalFooter,ModalBody,Button} from 'reactstrap'
import { base64ArrayBuffer } from './base64';
class Single extends React.Component{
	constructor(props) {
        super(props);
        this.state = {
          userId:'',
          message2:'',
          picture: null,
          counter: 0,
          loading: true,
          selectedTab:false,
          modalOpen:false,
          posterName: '',
          postType: '',
          myId: '',
          postFound: true,
          username: '',
          error: '',
          candidates:[],
          category:[],
          applied: [],
          invited:[],
          message3:'',
          headings:'',
          operation:'',
          showCandidates:false,
          suggesstions:["CHEMISTRY","PHYSICS","MATHS","BIOLOGY","PRIMARY","SECONDARY","O/A Levels","INTER COMMERCE","PRE PRIMARY","COMPUTER SCIENCES","BUSINESS ADMINSTRATION","POST GRADUATION","INTER PRE MEDICAL","INTER PRE ENGINEERING","INTER ARTS","FINANCE","MARKETING","ECAT","ONLINE","QURAN KARIM","ENGLISH LANGUAGE"],
          text: {
            class: '',
            area: '',
            city: '',
            studentGender: '',
            specification: '',
            offerContent: '',
            favoriteArea: '',
            date: '',
            studentGender: '',
            _ide: '',
            viewList:''
          },
          updateOk:false,
          stats:{},
          dialogOpen:false,
          myProfile: false,
          edit: false,
        
        }
      }
      componentDidMount() {
        
        Axios({
          url: '/postSingle',
          params: {
            search: this.props.match.params.id
          },
          method: 'get'
        })
          .then(data => {
            console.log(data)
            if (data.data.post) {
              console.log(data.data)
              let text = this.state.text;
              if (data.data.post.type == 'tuition') {
                text.class = data.data.post.class;
                text.specification = data.data.post.requiredTeacherSpecification;
                text.area = data.data.post.area;
                text.studentGender = data.data.post.studentGender;
              }
              else {
              text.offerContent = data.data.post.offerContent;
              text.favoriteArea = data.data.post.favoriteArea;
              }
              let image = base64ArrayBuffer(data.data.user.photo.data.data)
              text.city = data.data.post.city;
              text.date = data.data.post.date;
              text._ide = data.data.post._id;
              this.setState({
                picture: image,
                posterName: data.data.user.firstName + ' ' + data.data.user.lastName,
                username: data.data.user.username,
                category: data.data.post.category,
                applied: data.data.post.applied,
                invited:data.data.post.invited,
                text,
                myProfile: data.data.myProfile,
                postType: data.data.post.type,
                myId: data.data.user._id,
                userId:data.data.post._userId,
                loading: false,
                stats:data.data.stats,
              })
    
            }
            else {
              this.setState({
                postFound: false
              })
            }
          })
      }
        performOperation(){
        switch(this.state.operation){
          case 'delete':
          let id = {
            pId: this.state.text._ide,
          }
          Axios({
            method: 'post',
            withCredentials: true,
            data: id,
            url: '/deletePost'
          })
            .then(data => {
              this.setState({
                posts: data.data.posts,
                dialogOpen: false,
              })
                History.push('/'+this.state.username)
            })
          break;
          case 'onApply':
          let text = {
            pId: this.state.text._ide,
            userId:this.state.myId
          }
          let apply = this.state.applied;
      
          apply.push(this.state.stats._userId)
          let stats=this.state.stats;
          stats['RemainingConnect']=this.state.stats['RemainingConnect']-1;
          stats['connsume']=this.state.stats['connsume']+1;
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
              notifier.emit("applyTuitions",{userId:this.state.myId,id:this.state.text._ide})
            })
            .catch(error => {
              this.setState({
                message: 'Could not proceed with the request'
              })
            })
          break;
          case 'cancel':
          let text2 = {
            pId: this.state.text._ide
          }
          let apply2 = this.state.applied;
          let applied = apply2.filter((element) => {
            return element != this.state.stats._userId
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
                  apply.push(this.state.stats._userId)
                
                this.setState({
                  applied: apply,
                  dialogOpen:false,
                })
              }
            })
            .catch(error => {
              let apply = this.state.applied;
                  apply.push(this.state.stats._userId)
                
                this.setState({
                  applied: apply,
                  dialogOpen:false,
                })
            })
          break;
    
          default:break;
        }
    
      }
      toggleRequest(message3,headings,operation,event){
        event.preventDefault();
         this.setState({
           headings:headings,
           dialogOpen:true,
           message3:message3,
           operation:operation
          }) 
      }
      onUpdate(event) {
        event.preventDefault();
        let text = {
          category: this.state.category,
          city: this.state.text.city
        }
        if (this.state.postType == "teacher") {
    
          text.favoriteArea = encodeHtml(this.state.text.favoriteArea.trim());
          text.offerContent = encodeHtml(this.state.text.offerContent.trim());
    
        }
    
        else {
    
          text.area = encodeHtml(this.state.text.area.trim());
          text.studentGender = encodeHtml(this.state.text.studentGender.trim());
          text.requiredTeacherSpecification = encodeHtml(this.state.text.specification.trim());
          text.class = encodeHtml(this.state.text.class.trim());
        }
    
        text.pId = this.state.text._ide,
        Axios({
            method: 'post',
            withCredentials: true,
            url: '/updatePost',
            data: text
          })
            .then(data => {
    
              if (data.data.updatePost) {
                this.setState({
                  edit:false,
                  updateOk: true,
                  posts: data.data.posts,
                  message2:'Post Updated Successfully'
                  
                })
              }
              
            })
            .catch(error => {
              this.setState({
                message: 'Could not proceed the request'
              })
            })
      }
    
      onChangeHandle(property, event) {
        event.preventDefault();
        var sym = /<|>/g;
        if (!event.target.value.match(sym) || event.target.value == "") {
          {
            let text = this.state.text;
            text[property] = event.target.value;
            this.setState({
              text,
            })
          }
        }
      }
      onViewInterest(event) {
       console.log('in interest view')
        event.preventDefault();
        this.setState({
          loading2: true
        })
        let pId = {
          pId: this.state.text._ide
        }
        Axios({
          withCredentials: true,
          url: '/appliedCandidates',
          method: 'post',
          data: pId
        })
          .then(data => {
            if (data.data.candidates) {
    
              this.setState({
                showCandidates: true,
                candidates: data.data.candidates,
                loading2: false
              })
            }
    
          })
          .catch(error => {
            let text = this.state.text
            text['error'] = 'Could not proceed the request';
            this.setState({
              text,
              loading2: false
            })
          })
    
      }
      AddInCircle(id,event){
        event.preventDefault();
        messenger.emit('addition',{postId:this.state.text._ide,id:id})
        let invited=this.state.invited;
        invited.push(id)
        this.setState({
          invited
          })
      }
      onChange = text => {
        
        if (text[this.state.counter] != undefined) {
          if (text[this.state.counter].search(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/) == -1) {
            text[this.state.counter] = encodeHtml(text[this.state.counter]);
            let count = this.state.counter;
            count++;
            this.setState({ 
              category: text,
              counter: count
            })
          }
        }
        else {
          if (this.state.counter == 0) {
            text[0] = encodeHtml(text[0])
            this.setState({
              category: text
            })
          }
          else {
            this.setState({
              category: text,
              counter: this.state.counter - 1
            })
          }
        }
      } 
	render(){
    const Candidates=()=>{
      const listing=this.state.candidates.map((el,i)=>{
        const compressImage=base64ArrayBuffer(el['photo'].data.data)
        return(
        
       <div key={i}>
            <div style={{width:'100%',flex:'1', backgroundColor:'red'}}>   
            <div style={{width:'80%', float:'left', display:'inline'}}>
            <Link to={'/user/'+el['username']}><img src={`data:image/jpeg;base64,${compressImage}`} onClick={()=>{window.open('/user/'+el['username'],"_blank")}} className="rounded-circle imgfriend" style={{ width:"50px",height:'50px'}}/></Link>
          {' '} <Link to='#' onClick={()=>{window.open('/'+el['username'],"_blank")}} className="friendtext">{el['firstName']+" "+el['lastName']}</Link>
          </div>
            <div  style={{width:'20%',float:'left'}}>
            {this.state.invited.indexOf(el['_id'])==-1?
            <Button color="primary" bsSize="sm" onClick={this.AddInCircle.bind(this,el['_id'])} >Invite</Button>
          :
            <span style={{fontWeight:'bold'}}>Invited</span>
            }
            </div>
            </div>
            <br/>
            <br/>
            </div>
          ) 
      })
      return listing
    }
        return(
       		<div className="wrapper">
       		<span  className="fixed-top">
       	<Nav verify={true} loggedIn={true} showMessageCounter={true}/>
        </span>
        <Modal
          isOpen={this.state.showCandidates}
          centered
         size="sm"
         >
           <ModalHeader id="form-dialog-title">Candidates</ModalHeader>
          <ModalBody>
            {this.state.loading2?
                  <div style={{textAlign:'center'}}>   <Dots color="#788EA8" animating={true} size={34} speed={1}  /></div>
                  :
            <div>
              {this.state.candidates.length==0?<div>No Candidates to show</div>
              :
             <Candidates/>
              }
           </div>
            }
            
          
        
    </ModalBody>
    <ModalFooter>
    <Button onClick={()=>{
              this.setState({
                  showCandidates:false,
                  candidates:[]
              })
            }} color="primary" autoFocus>
              Close
            </Button>
      
      </ModalFooter>
      </Modal>
        <Modal isOpen={this.state.modalOpen}  centered>
           <ModalHeader >Edit Post</ModalHeader>
          <ModalBody>
      
       <div className="row">
       <div className="col-sm-12">
       {console.log(this.state.postType)}
       {this.state.postType=="offer"?
      
       <div style={{width:'100%'}}> 
       <div style={{textAlign:'center',fontSize:'100%'}}>Offer Details</div>
       <Input style={{width:'100%'}} type="text" value={this.state.text.offerContent} onChange={this.onChangeHandle.bind(this,'offerContent')}  className="entertext" placeholder="I will teach 3 students in 10 thousands"/>
       </div>
       :
       <div style={{width:'100%'}} >
       <div style={{textAlign:'center',fontSize:'100%'}}>Class and board</div>
       <Input style={{width:'100%'}} type="text" value={this.state.text.class} onChange={this.onChangeHandle.bind(this,'class')}  className="entertext" placeholder="Class 9 Sindh board"/>
       </div>}
       <div style={{textAlign:'center',fontSize:'100%'}}>Category</div>
       <Chips
        placeholder='Kindly select a category'
        required={true}
        value={this.state.category}
        onChange={this.onChange}
        suggestions={this.state.suggesstions}
        onRemove={()=>{
        var count =this.state.counter;
        count--
        this.setState({
        counter:count
        })
    }}
/>
{this.state.postType=="offer"?
<div style={{width:'100%'}}>
       <div style={{textAlign:'center',fontSize:'100%'}}>Favorite area</div>
       <Input style={{width:'100%'}} type="text" value={this.state.text.favoriteArea} onChange={this.onChangeHandle.bind(this,'favoriteArea')}  className="entertext" placeholder="Eg. Buffer zone North Nazimabad"/>
       <div style={{textAlign:'center',fontSize:'100%'}}>City</div>
       <Input style={{width:'100%'}} type="text" value={this.state.text.city}   onChange={this.onChangeHandle.bind(this,'city')} className="entertext" placeholder="Eg. Karachi"/>
     </div>
:
        <div style={{width:'100%'}}>
        <div style={{textAlign:'center',fontSize:'100%'}}>Area</div>
       <Input style={{width:'100%'}} type="text" value={this.state.text.area} onChange={this.onChangeHandle.bind(this,'area')}  className="entertext" placeholder="Eg. Buffer zone North Nazimabad"/>
       <div style={{textAlign:'center',fontSize:'100%'}}>City</div>
       <Input style={{width:'100%'}} type="text" value={this.state.text.city}   onChange={this.onChangeHandle.bind(this,'city')} className="entertext" placeholder="Eg. Karachi"/>
       <div style={{textAlign:'center',fontSize:'100%'}}>Student Gender</div>
       <Input style={{width:'100%'}} type="text" value={this.state.text.studentGender}  className="entertext" onChange={this.onChangeHandle.bind(this,'studentGender')} placeholder="Eg. Male"/>     
       <div style={{textAlign:'center',fontSize:'100%'}}>Required Teacher specification</div>
       <Input style={{width:'100%'}} type="text" value={this.state.text.specification} onChange={this.onChangeHandle.bind(this,'specification')}   className="entertext" placeholder="Eg. Should not be a student too,  should be an engineer"/>
     </div>

}
</div>
       </div>
       </ModalBody>      
       <ModalFooter>
       {(this.state.updateOk==false)? 
       <div>
           <Button color="primary"  onClick={this.onUpdate.bind(this)}>Update</Button> {' '}  
           <Button color="secondary"     onClick={()=>{this.setState({modalOpen:false})}}>Cancel</Button>  
          </div>
           :
        <div>
          <div style={{color:'green'}}>Post updated sucessfully </div>
        <Button color="primary"  onClick={(e)=>{
         this.setState({
           modalOpen:false,
           
         })
          }} >Ok</Button>  
       </div>
        }

          </ModalFooter>
        </Modal>
		<br/><br/><br/>
		<div className="search-sec">
			<div className="container">
				<div className="search-box">
			
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
										{/* <h3>Filter</h3> */}
										{/* <Link to="#"  onClick={(e)=>{e.preventDefault(); this.setState({area:'',city:'',gender:''})}}>Clear all filters</Link> */}
									</div>
									{/* <!--filter-heading end--> */}
									<div className="paddy">
										<div className="filter-dd">
											<div className="filter-ttl">
												{/* <h3>Area</h3> */}
												{/* <Link to="#"  onClick={(e)=>{e.preventDefault(); this.setState({area:''})}}>Clear</Link> */}
											</div>
											{/* <form>
												<input type="text" value={this.state.area} name="search-skills"
												 onChange={(e)=>{  
											    let sym=/<|>/g;
                                                if(!e.target.value.match(sym)|| e.target.value==""){
                                                    this.setState({
                                                        area:e.target.value
                                                     })
                                                 }}} placeholder="Search Area"/>
											</form> */}
										</div>
										<div className="filter-dd">
											<div className="filter-ttl">
												{/* <h3>Gender</h3> */}
												{/* <Link to="#" >Clear</Link> */}
											</div>
											<ul className="avail-checks">
												<li>
													{/* <input type="radio" onClick={(e)=>{this.setState({gender:e.target.value})}} name="gender" id="c1"/> */}
													<label htmlFor="c1">
														<span></span>
													</label>
													{/* <small>Male</small> */}
												</li>
												<li>
													{/* <input type="radio" onClick={(e)=>{this.setState({gender:e.target.value})}} name="gender" id="c2"/> */}
													<label htmlFor="c2">
														<span></span>
													</label>
													{/* <small>Female</small> */}
												</li>
												
											</ul>
										</div>
										<div className="filter-dd">
											<div className="filter-ttl">
												{/* <h3>City</h3> */}
												{/* <Link to="#" >Clear</Link> */}
											</div>
											{/* <form className="job-tp">
												<select>
													<option>Select a city</option>
													<option>Karachi</option>
													<option>Lahore</option>
													<option>Peshawar</option>
													<option>Quetta</option>
													<option>Nohshehra</option>
													<option>Daadu</option>
													<option>Rahim yaar khan</option>
													<option>Multan</option>
													<option>Faisalabad</option>
													<option>Islamabad</option>
													<option>Sahewal</option>
													<option>Larkana</option>
													<option>Rawalpindi</option>
												</select>
				        					<i className="fa fa-ellipsis-v" ></i>
											</form> */}
										</div>
			
									</div>
								</div>
								{/* <!--filter-secs end--> */}
							</div>
							<div className="col-lg-6" >
								<div className="main-ws-sec">
					<div className="posts-section">
                    <div className="post-bar">
					<div className="post_topbar">
					<div className="usy-dt">
                    <img src={`data:image/jpeg;base64,${this.state.picture}`} style={{width:'50px',height:'50px'}} alt=""/>
                    <div className="usy-name" style={{cursor:'pointer'}} onClick={(e)=>{var view=window.open("/"+this.state.username,"_blank")
													view.focus()}}>
                        <h3>{this.state.posterName}</h3>
                        <span><img src="images/clock.png" alt=""/>{'  '}<TimeAgo datetime={this.state.text.date}/></span>
                    </div>
                </div>
                {this.state.myProfile? 
                   <div className="ed-opts">
                    <Link to="#" title="" className="ed-opts-open" onClick={()=>{this.setState({selectedTab:!this.state.selectedTab})}}><i className="la la-ellipsis-v"></i></Link>
                    {this.state.selectedTab? <ul className="ed-options active">
                        <li><Link to="#" title="" onClick={()=>{
              
                 this.setState({
                   modalOpen:true,
                  })
                
                
               }} >Edit Post</Link></li>
                        <li><Link to="#" title=""  onClick={this.toggleRequest.bind(this,'Are you sure you want to delete the post?','onDelete')} >Delete</Link></li>
                        <li><Link to="#" title="">Close</Link></li>
                          </ul>:<div/>}
                </div>:<div/>} 
			</div>
				
						  <div className="job_descp">
						{(this.state.text.area==""||this.state.text.area==undefined)?  <div>
              <div  style={{textAlign:'center',fontSize:'100%'}}>Offer Content{' '}<Link to="#"><i className='fa fa-text' style={{color:'red'}}> </i></Link> {' '}<Link to="#"><i className='fa fa-list'> </i></Link> </div>
						  <div  style={{border:'1px solid #efefef'}}>{this.state.text.offerContent}</div> 
						  <div  style={{textAlign:'center',fontSize:'100%'}}>City{' '}<Link to="#"><i className='fa fa-building' style={{color:'red'}}> </i></Link> </div>
						  <div  style={{border:'1px solid #efefef'}}>{this.state.text.city}</div> 
						  <span> <div  style={{textAlign:'center',fontSize:'100%'}}>Favorite Area{' '}<Link to="#"><i className='fa fa-heart' style={{color:'red'}}> </i></Link> </div>
						  <div  style={{border:'1px solid #efefef'}}>{this.state.text.favoriteArea}</div></span>
              </div>
              :<div>
              <div  style={{textAlign:'center',fontSize:'100%'}}>Class and board{' '}<Link to="#"><i className='fa fa-text' style={{color:'red'}}> </i></Link> {' '}<Link to="#"><i className='fa fa-list'> </i></Link> </div>
						  <div  style={{border:'1px solid #efefef'}}>{this.state.text.class}</div> 
						  <div  style={{textAlign:'center',fontSize:'100%'}}>City{' '}<Link to="#"><i className='fa fa-building' style={{color:'red'}}> </i></Link> </div>
						  <div  style={{border:'1px solid #efefef'}}>{this.state.text.city}</div> 
						  <span> <div  style={{textAlign:'center',fontSize:'100%'}}>Area{' '}<Link to="#"><i className='fa fa-heart' style={{color:'red'}}> </i></Link> </div>
						  <div  style={{border:'1px solid #efefef'}}>{this.state.text.area}</div></span>
              <span> <div  style={{textAlign:'center',fontSize:'100%'}}>Student Gender{' '}<Link to="#"><i className='fa fa-male' style={{color:'red'}}> </i></Link> <Link to="#"><i className='fa fa-female' style={{color:'blue'}}> </i></Link> </div>
						  <div  style={{border:'1px solid #efefef'}}>{this.state.text.studentGender}</div></span>
              <span> <div  style={{textAlign:'center',fontSize:'100%'}}>Required Teacher Specification{' '}<Link to="#"><i className='fa fa-circle-o' style={{color:'red'}}> </i></Link></div>
						  <div  style={{border:'1px solid #efefef'}}>{this.state.text.specification}</div></span>
            
              </div>
              } 
						  <div  style={{textAlign:'center',fontSize:'100%'}}>Category{' '}<Link to="#"><i className='fa fa-tags' style={{color:'#007bff' }}> </i></Link> </div>
						  <ul className="skill-tags">
						  <li><Link to="#" >{this.state.category[0]}</Link></li>
						  <li><Link to="#" >{this.state.category[1]}</Link></li>
						  <li><Link to="#" >{this.state.category[2]}</Link></li>
						  </ul>
						  </div>
              <div className="job-status-bar">
                <ul className="like-com">
                            
              {this.state.myProfile?
                    <li><Link to="#"  onClick={this.onViewInterest.bind(this)}  className="com"><i className="fa fa-handshake-o"></i> Interested {this.state.applied.length}</Link></li>
                :
                <li><Link to="#" className="com"><i className="fa fa-handshake-o"></i> Interested {this.state.applied.length}</Link></li>
               
                }
                </ul>{!this.state.myProfile?
                  <Link to="#">
                     {this.state.applied.indexOf(this.state.stats._userId)==-1?
                   <Link to="#"> <button className="btn btn-outline-primary btn-sm" onClick={this.toggleRequest.bind(this,'Are you sure you want to apply for this offer / tuition?','Confirm apply','onApply')}>Apply</button></Link>
                     :
                     <Link to="#"> <button className="btn btn-primary btn-sm" onClick={this.toggleRequest.bind(this,'Are you sure you want to quit your offer you consume connect will not return?','Confirm cancel','cancel')}>Cancel</button></Link>
                   
                   }
                  </Link>
                  :<Link to="#"><i className="la la-eye"></i>Views {this.state.applied.length}</Link>
              }
            </div>
									  </div>				
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
										{(this.state.stats.tutionRemaining!=undefined&& this.state.stats.tutionRemaining!=-1)?	<div className="job-info">
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
       )
    }
}
export default Single;