import React from 'react';
import {Input} from '../../node_modules/@material-ui/core';
import axios from 'axios';
import { Link } from 'react-router-dom';
//import {Button} from 'react-bootstrap';
import Chips,{Chip} from 'react-chips';
import {ModalHeader,ModalFooter,ModalBody,Modal,Button} from 'reactstrap'
import { encodeHtml } from './filterHtml';
import {base64ArrayBuffer} from './base64';
import Poster from './Poster';
import TimeAgo from 'timeago-react';
import { notifier,messenger } from './main';
import Dots from 'react-activity/lib/Dots';
class Dataposter extends React.Component {
  constructor(props) {
    super(props);
    this.insertPost=this.insertPost.bind(this);
    this.toggleModal=this.toggleModal.bind(this);
    this.state = {
      dataPoster:false,
      posts:[],
      editId:'',
      chips:[],
      updateOk:false,
      loading:true,
      loading2:false,
      message:'',
      operation:'',
      posterOpen:false,

      text:{
        class:'',
        area:'',
        city:'',
        studentGender:'',
        requiredTeacherSpecification:'',
        error:'',
        offerContent:'',
        favoriteArea:''
      },
        showCandidates:false,
        candidates:[],
        openInterest:'',
        suggesstions:["CHEMISTRY","PHYSICS","MATHS","BIOLOGY","PRIMARY","SECONDARY","O/A Levels","INTER COMMERCE","PRE PRIMARY","COMPUTER SCIENCES","BUSINESS ADMINSTRATION","POST GRADUATION","INTER PRE MEDICAL","INTER PRE ENGINEERING","INTER ARTS","FINANCE","MARKETING","ECAT","ONLINE","QURAN KARIM","ENGLISH LANGUAGE"],
        counter:0,
        dialogOpen:false,
        deleteId:'',
        userIde:'',
        modalOpen:false,
        modalOpen2:false,
        counter2:0,
        id:'',
        pid:'',
        selectedTab:-1
      }
  }
  componentDidMount() {
      console.log(this.props)
    var userId=this.props.id
    axios({
      method: 'get',
      withCredentials: true,
      url: '/selfPosts',
        params:{
          userId
        }
        })
        .then(data => {
          this.setState({
            posts:data.data.posts,
            userIde:data.data.id,
            loading:false
          })
          if(this.props.profile){
            axios({
            method:'post',
            withCredentials:true,
            url:'/updateStats'
          })
          .then(data=>{
          })
        }
        })
  }
  onToggleRequest(message,operation,id,counter,event){

    event.preventDefault();
    this.setState({
      message:message,
      operation:operation,
      id:id,
      counter2:counter,
      dialogOpen:true,
      selectedTab:-1
    }) 
  }
  onOperation(event){
    event.preventDefault();
   
    switch(this.state.operation){
      case 'onApply':
      let text={
        pId:this.state.id,
        userId:this.state.posts[0]._userId
      }
      let post=this.state.posts;
      post[this.state.counter2].applied.push(this.state.userIde)
        this.setState({
          posts:post,
          dialogOpen:false
        })
      axios({
       withCredentials:true,  
       data:text,
       method:'post',
       url:'/applyTuition'
       })
       .then(data=>{
       if(!data.data.received){
        let post=this.state.posts;
        let applied=post[this.state.counter2].applied.filter((element)=>{
          return element!=this.state.userIde
        });
        post[this.state.counter2].applied=applied;
        this.setState({
        posts:post, 
        })
       }
       this.props.consumption();
       notifier.emit("applyTuitions",{id:this.state.posts[this.state.counter2]._id,
                                      userId:this.state.posts[this.state.counter2]._userId})
       })
       .catch(error=>{
        let post=this.state.posts;
          let applied=post[this.state.counter2].applied.filter((element)=>{
            return element!=this.state.userIde
          });
        post[this.state.counter2].applied=applied;
        this.setState({
          posts:post
        })
       })
      break;
      case 'onCancle':
      let text2={
        pId:this.state.id
      }
      let post2=this.state.posts;
          let applied=post2[this.state.counter2].applied.filter((element)=>{
            return element!=this.state.userIde
          });
        post2[this.state.counter2].applied=applied;
          this.setState({
            posts:post2,
            dialogOpen:false
          })
      axios({
        withCredentials:true,  
        data:text2,
        method:'post',
        url:'/unApply'
        })
        .then(data=>{ 
        if(!data.data.received){
          let post=this.state.posts;
          post[this.state.counter2].applied.push(this.state.userIde)
            this.setState({
              posts:post
            })
          
        }
        })
        .catch(error=>{
          let post=this.state.posts;
          let applied=post[this.state.counter2].applied.filter((element)=>{
            return element!=this.state.userIde
          });
        post[this.state.counter2].applied=applied;
          this.setState({
            posts:post
          })
        })  
      break;
      case 'onDelete':
      let id={
        pId:this.state.id,
      }
      axios({
        method:'post',
        withCredentials:true,
        data:id,
        url:'/deletePost'
      })
      .then(data=>{
        if(data.data.deletePost){
          let post=this.state.posts
       post.splice(this.state.counter2,1)
        
        this.setState({
          posts:post,
          deleteId:'',
          dialogOpen:false,
        })
      }
      })
      break;
    }
    
  }
  onViewInterest(property,i,event){
    event.preventDefault();
    let pId={
      pId:property
    }
          this.setState({
            loading2:true,
            showCandidates:true,
          })
    axios({
    withCredentials:true,
    url:'/appliedCandidates',
    method:'post',
    data:pId
  })
  .then(data=>{
if(data.data.candidates){
console.log(data.data.candidates)
  this.setState({
    candidates:data.data.candidates,
    loading2:false,
    openInterest:property,
    pid:i
  })
}

  })
  .catch(error=>{
    let text=this.state.text
    text['error']='Could not proceed the request'; 
    this.setState({
      text,
      loading2:false
     })
  })

  }
    AddInCircle(id,event){
    event.preventDefault();
    messenger.emit('addition',{postId:this.state.openInterest,id:id})
    let post=this.state.posts
    post[this.state.pid].invited.push(id);
    this.setState({
      post
      })
    }
    toggleModal(){
     
      this.setState({posterOpen:false})
    }
onUpdate(event){
  event.preventDefault();
  let text={
    category:this.state.chips,
    city:this.state.text.city
  }
  if(this.props.type=="teacher"){
    
      text.favoriteArea=               encodeHtml(this.state.text.favoriteArea.trim());
      text.offerContent=               encodeHtml(this.state.text.offerContent.trim());
      }
      else{ 
  
   text.area=                          encodeHtml(this.state.text.area.trim());
   text.studentGender=                 encodeHtml(this.state.text.studentGender.trim());
   text.requiredTeacherSpecification=  encodeHtml(this.state.text.requiredTeacherSpecification.trim());
   text.className=                     encodeHtml(this.state.text.class.trim());
    }
  
  text.pId=this.state.editId,
  axios({
      method:'post',
      withCredentials:true,
      url:'/updatePost',
      data:text
    })
    .then(data=>{
    
      if(data.data.updatePost==true){
        this.setState({
          updateOk:true,
          posts:data.data.posts
        })
      }
    })
    .catch(error=>{
      this.setState({
        error:'Could not proceed the request'
      })
    })
}

onChangeHandle(property,event){
 event.preventDefault();
 var sym=/<|>/g;
 if(!event.target.value.match(sym)|| event.target.value==""){
{
  let text=this.state.text;
  text[property]=event.target.value;
  this.setState({
    text,
  })
}
}
}
onChange=text=>{
  if(text[this.state.counter]!=undefined)  
  { 
    if(text[this.state.counter].search(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/)==-1)
    
    {
      text[this.state.counter]=encodeHtml(text[this.state.counter]);
      let count=this.state.counter;
      count++;
      this.setState({
        chips:text,
        counter:count
       }) 
    }
  }
    else{
       if(this.state.counter==0){
        text[0]=encodeHtml(text[0])
         this.setState({
           chips:text
          })
        }
        else{
          this.setState({
            chips:text,
            counter:this.state.counter-1
          })
        } 
      }   
}
// onDelete(property,event){
//   let id={
//     pId:property,
//   }
//   axios({
//     method:'post',
//     withCredentials:true,
//     data:id,
//     url:'/deletePost'
//   })
//   .then(data=>{
//     this.setState({
//       posts:data.data.posts,
//       deleteId:'',
//       dialogOpen:false,

//     })

//   })
// }
  insertPost(post){

    let posts=this.state.posts;
    posts.unshift(post)
    this.setState({
      post
    }) 
  this.props.consumption()
  }
  render(){
      const Posting=()=>{
      const listing=this.state.posts.map((el,i)=>{
       if(this.props.type=="student"){  
       return(
        
            <div key={i} className="post-bar">
            <div className="post_topbar">
                <div className="usy-dt">
                    <img src={`data:image/jpeg;base64,${this.props.img}`} style={{width:'50px',height:'50px'}} alt=""/>
                    <div className="usy-name">
                        <h3>{this.props.fullname}</h3>
                        <span><img src="images/clock.png" alt=""/><TimeAgo datetime={el.date}/></span>
                    </div>
                </div>
              {this.state.profile?  <div className="ed-opts">
                    <Link to="#" title="" className="ed-opts-open" onClick={()=>{this.setState({selectedTab:(this.state.selectedTab==i?-1:i)})}}><i className="la la-ellipsis-v"></i></Link>
                    {this.state.selectedTab==i? <ul className="ed-options active">
                        <li><Link to="#" title="" onClick={()=>{
              
              let text=this.state.text
              text['area']=el['area'];
              text['city']=el['city'];
              text['class']=el['class'];
              text['requiredTeacherSpecification']=el['requiredTeacherSpecification'];
              text['studentGender']=el['studentGender'];
                 this.setState({
                   text,
                   editId:el['_id'],
                   chips:el['category'],
                   modalOpen:true,
                   selectedTab:-1
                  })
                
                
               }}>Edit Post</Link></li>
                       <li><Link to="#" title=""  onClick={this.onToggleRequest.bind(this,'Are you sure you want to delete the post?','onDelete',el['_id'],i)} >Delete</Link></li>
                        <li><Link to="#" title="">Close</Link></li>
                          </ul>:<div/>}
                </div>:<div/>}  
            </div>
            <div className="epi-sec" onClick={()=>{this.setState({selectedTab:-1})}}>
            </div>
            <div className="job_descp">
            
            <div  style={{textAlign:'center',fontSize:'100%'}}>Class and board{' '} <Link to="#"><i className='fa fa-file-text' > </i> </Link></div>
            <div  style={{border:'1px solid #efefef'}}>{el['class']}</div> 
            <div  style={{textAlign:'center',fontSize:'100%'}}>Student gender{' '}<Link to="#"><i className='fa fa-female' style={{color:'red'}}> </i></Link> {' '}<Link to="#"><i className='fa fa-male'> </i></Link> </div>
            <div  style={{border:'1px solid #efefef'}}>{el['studentGender']}</div> 
            <div  style={{textAlign:'center',fontSize:'100%'}}>Required teacher specification{' '}<Link to="#"><i className='fa fa-group' style={{color:'#53d690'}}> </i></Link> </div>
            <div  style={{border:'1px solid #efefef'}}>{el['requiredTeacherSpecification']}</div>  
            <div  style={{textAlign:'center',fontSize:'100%'}}>City{' '}<Link to="#"><i className='fa fa-building' style={{color:'red'}}> </i></Link> </div>
            <div  style={{border:'1px solid #efefef'}}>{el['city']}</div> 
            <div  style={{textAlign:'center',fontSize:'100%'}}>Area{' '}<Link to="#"><i className='fa fa-home' style={{color:'#53d690'}}> </i></Link> </div>
            <div  style={{border:'1px solid #efefef'}}>{el['area']}</div>  
            <div  style={{textAlign:'center',fontSize:'100%'}}>Category{' '}<Link to="#"><i className='fa fa-tags' style={{color:'#007bff' }}> </i></Link> </div>
                <ul className="skill-tags">
                    <li><Link to="#" title="">{el['category'][0]}</Link></li>
                    <li><Link to="#" title="">{el['category'][1]}</Link></li>
                    <li><Link to="#" title="">{el['category'][2]}</Link></li>
                    	
                </ul>
            </div>
            <div className="job-status-bar">
                <ul className="like-com">
                            
              {this.props.profile?
                    <li><Link to="#"  onClick={this.onViewInterest.bind(this,el['_id'],i)}  className="com"><img src="images/com.png" alt=""/> Interested {el['applied'].length}</Link></li>
                :
                <li><Link to="#" className="com"><img src="images/com.png" alt=""/> Interested {el['applied'].length}</Link></li>
               
                }
                </ul>{!this.props.profile?
                  <Link to="#">
                     {el['applied'].indexOf(this.state.userIde)==-1?
                   <Link to="#"> <button className="btn btn-outline-primary btn-sm" onClick={this.onToggleRequest.bind(this,'Are you sure you want to apply for this offer / tuition?','onApply',el['_id'],i)}>Apply</button></Link>
                     :
                     <Link to="#"> <button className="btn btn-primary btn-sm" onClick={this.onToggleRequest.bind(this,'Are you sure you want to quit your offer you consume connect will not return?','onCancle',el['_id'],i)}>Cancel</button></Link>
                   
                   }
                  </Link>
                  :<Link to="#"><i className="la la-eye"></i>Views {el['views']}</Link>
              }
            </div>
        </div>
          )
        }
        else{
            {  
                return(
                 
                     <div key={i} className="post-bar">
    
                     <div className="post_topbar">
                         <div className="usy-dt">
                             <img src={`data:image/jpeg;base64,${this.props.img}`} style={{width:'50px',height:'50px'}} alt=""/>
                             <div className="usy-name">
                                 <h3>{this.props.fullname}</h3>
                                 <span><img src="images/clock.png" alt=""/><TimeAgo datetime={el.date}/></span>
                             </div>
                         </div>
                         <div className="ed-opts">
                    <Link to="#" title="" className="ed-opts-open" onClick={()=>{this.setState({selectedTab:(this.state.selectedTab==i?-1:i)})}}><i className="la la-ellipsis-v"></i></Link>
                    {this.state.selectedTab==i? <ul className="ed-options active">
                        <li><Link to="#" title="" onClick={()=>{
              
              let text=this.state.text
        
              text['favoriteArea']=el['favoriteArea'];
              text['city']=el['city'];
              text['offerContent']=el['offerContent'];
         
                 this.setState({
                   text,
                   editId:el['_id'],
                   chips:el['category'],
                   modalOpen:true,
                   selectedTab:-1
                  })
                
                
               }}>Edit Post</Link></li>
                        <li><Link to="#" title=""  onClick={this.onToggleRequest.bind(this,'Are you sure you want to delete the post?','onDelete',el['_id'],i)} >Delete</Link></li>
                        <li><Link to="#" title="">Close</Link></li>
                          </ul>:<div/>}
                </div>
                     </div>
                     <div className="epi-sec">
                     </div>
                     <div className="job_descp">
                     <div  style={{textAlign:'center',fontSize:'100%'}}>Offer Description{' '} <Link to="#"><i className='fa fa-file-text' > </i> </Link></div>
                     <div  style={{border:'1px solid #efefef'}}>{el['offerContent']}</div> 
                     <div  style={{textAlign:'center',fontSize:'100%'}}>Favorite Area{' '}<Link to="#"><i className='fa fa-heart' style={{color:'red'}}> </i></Link></div>
                     <div  style={{border:'1px solid #efefef'}}>{el['favoriteArea']}</div> 
                     <div  style={{textAlign:'center',fontSize:'100%'}}>City{' '}<Link to="#"><i className='fa fa-building' style={{color:'red'}}> </i></Link> </div>
                     <div  style={{border:'1px solid #efefef'}}>{el['city']}</div> 
                     <div  style={{textAlign:'center',fontSize:'100%'}}>Category{' '}<Link to="#"><i className='fa fa-tags' style={{color:'#007bff' }}> </i></Link> </div>
                         <ul className="skill-tags">
                             <li><Link to="#" >{el['category'][0]}</Link></li>
                             <li><Link to="#" >{el['category'][1]}</Link></li>
                             <li><Link to="#" >{el['category'][2]}</Link></li>
                            
                         </ul>
                     </div>
                     <div className="job-status-bar">
                         <ul className="like-com">              
                           {this.props.profile?
                             <li><Link to="#"  onClick={this.onViewInterest.bind(this,el['_id'],i)}  className="com"><img src="images/com.png" alt=""/>Interested {el['applied'].length}</Link></li>
                           : <li><Link to="#"  className="com"><img src="images/com.png" alt=""/>Interested {el['applied'].length}</Link></li>
                           
                           }
                         </ul>{!this.props.profile?
                  <Link to="#">
                     {el['applied'].indexOf(this.state.userIde)==-1?
                   <Link to="#"> <button className="btn btn-outline-primary btn-sm" onClick={this.onToggleRequest.bind(this,'Are you sure you want to apply for this offer / tuition?','onApply',el['_id'],i)}>Apply</button></Link>
                     :
                     <Link to="#"> <button className="btn btn-primary btn-sm" onClick={this.onToggleRequest.bind(this,'Are you sure you want to quit your offer you consume connect will not return?','onCancle',el['_id'],i)}>Cancel</button></Link>
                   
                   }
                  </Link>
                  :<Link to="#"><i className="la la-eye"></i>Views {el['views']}</Link>
              }
                     </div>
                 </div>
                   )
                 }   
        }
        })
        return listing;
      }
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
              {this.state.posts[this.state.pid].invited.indexOf(el._id)==-1?
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
        <div className="product-feed-tab current" id="feed-dd">
        <div className="posts-section">
        {this.props.profile ?
           <div className="post-topbar">
										<div className="user-picy">
											<img src={`data:image/jpeg;base64,${this.props.img}`} width="40px" height="40px" className="rounded-circle" alt=""/>
										</div>
										<div className="post-st" onClick={(e)=>{e.preventDefault();console.log('done'); this.setState(prevState=>({posterOpen:true}))}}>
											<ul>
												<li><Link className="post-jb active" to="#"  >Post {this.props.type=="student"?"Tuition":"Offer"}</Link></li>
											</ul>
										</div>
										{/* <!--post-st end--> */}
                  </div>:<div/>}

            <Modal isOpen={this.state.modalOpen}  centered>
           <ModalHeader >Edit Post</ModalHeader>
          <ModalBody>
      
       <div className="row">
       <div className="col-sm-12">
       {this.props.type=="teacher"?
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
        value={this.state.chips}
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
{this.props.type=="teacher"?
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
       <Input style={{width:'100%'}} type="text" value={this.state.text.requiredTeacherSpecification} onChange={this.onChangeHandle.bind(this,'requiredTeacherSpecification')}   className="entertext" placeholder="Eg. Should not be a student too,  should be an engineer"/>
     </div>

}
</div>
       </div>
       </ModalBody>      
       <ModalFooter>
       {(this.state.updateOk==false)? 
       <div>
           <Button color="primary"  onClick={this.onUpdate.bind(this)}>Update</Button> {' '}  
           <Button color="secondary"     onClick={()=>{this.setState({modalOpen:false})}}>Cancle</Button>  
          </div>
           :
        <div>
          <div style={{color:'green'}}>Post updated sucessfully </div>
        <Button color="primary"  onClick={(e)=>{
         this.setState({
           modalOpen:false,
           text:{
             studentGender:'',
             requiredTeacherSpecification:'',
             city:'',
             area:'',
             class:'',
             favoriteArea:'',
             offerContent:''
            },
            editId:'',
            updateOk:false,
            chips:[],
         })
          }} >Ok</Button>  
       </div>
        }

          </ModalFooter>
        </Modal>
        <Modal
         centered
          isOpen={this.state.dialogOpen}>

          <ModalHeader>{"Confirm ?"}</ModalHeader>
          <ModalBody>

         {this.state.message}
          </ModalBody>
          <ModalFooter>
            <Button onClick={()=>{
              this.setState({
                  dialogOpen:false,
                  id:''
              })
            }} color="primary" autoFocus>
              No
            </Button>
            <Button onClick={this.onOperation.bind(this)} color="secondary">
              Yes
            </Button>
          </ModalFooter>
        </Modal>
        <Poster  posterOpen={this.state.posterOpen} type={this.props.type} toggleModal={this.toggleModal} insertPost={this.insertPost}/>
       {this.state.loading?
                <div style={{textAlign:'center'}}>   <Dots color="#788EA8" animating={true} size={34} speed={1}  /></div>
        :<Posting/>
       }
        {/* <!--post-bar end--> */}
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
   
        <div className="process-comm">
            <Link to="#" title=""><img src="images/process-icon.png" alt=""/></Link>
        </div>
        {/* <!--process-comm end--> */}
    </div>
    {/* <!--posts-section end--> */}
</div>
    )
  }
}
export default Dataposter