import React from 'react';
import {Input} from '../../node_modules/@material-ui/core';
import axios from 'axios';
import {Modal,ModalHeader,ModalFooter,ModalBody} from 'reactstrap'
import Chips,{Chip} from 'react-chips' 
import { encodeHtml } from './filterHtml';
import Dots from 'react-activity/lib/Dots'
class Makepost extends React.Component{
  constructor(props){
    super(props);
    this.state={
      chips:[],
      loading:false,
      text:{
        class:'',
        area:'',
        city:'',
        success:'',
        studentGender:'',
        requiredTeacherSpecification:'',
        offerDetails:'',
        favoriteArea:""
      },
      message:'',
      error:'',      
      suggesstions:["CHEMISTRY","PHYSICS","MATHS","BIOLOGY","PRIMARY","SECONDARY","O/A Levels","INTER COMMERCE","PRE PRIMARY","COMPUTER SCIENCES","BUSINESS ADMINSTRATION","POST GRADUATION","INTER PRE MEDICAL","INTER PRE ENGINEERING","INTER ARTS","FINANCE","MARKETING","ECAT","ONLINE","QURAN KARIM","ENGLISH LANGUAGE"],
      counter:0,
      counter2:0,
     
    }
  }
  onChangeHandle(property,event){
    let text=this.state.text;
    var sym=/<|>/g;
    if(!event.target.value.match(sym) || even.target.value==""){
      text[property]=event.target.value;
      this.setState({
        text
      })
    }
  }
  onMakePost(e){
    e.preventDefault();
if(this.props.type=="student"){

  if(this.state.text.area.trim()=="" || this.state.text.city.trim()=="" ||  this.state.text.class.trim()=="" || this.state.text.studentGender.trim()==""  || this.state.text.requiredTeacherSpecification.trim()==""||this.state.chips.length==0){ 
    this.setState({
      error:'All fields are mendatory to enter'
    })
    event.stopPropagation();
    return;
  }

} else{
  if(this.state.text.city.trim()=="" ||  this.state.text.favoriteArea.trim()==""||this.state.chips.length==0 ){ 
    this.setState({
      error:'All fields are mendatory to enter'
    })
      event.stopPropagation();
      return;
  }
}
  
this.setState({
  loading:true
})

let posts={post:{}};
if(this.props.type=="student"){
  posts.post.class=encodeHtml(this.state.text.class.trim());
  posts.post.requiredTeacherSpecification=encodeHtml(this.state.text.requiredTeacherSpecification.trim());
  posts.post.area=encodeHtml(this.state.text.area.trim()),
  posts.post.studentGender=encodeHtml(this.state.text.studentGender.trim()),
  posts.post.city=encodeHtml(this.state.text.city.trim());
  posts.post.category=this.state.chips
}
else{
  posts.post.offerContent=encodeHtml(this.state.text.offerDetails.trim());
  posts.post.favoriteArea=encodeHtml(this.state.text.favoriteArea.trim());
  posts.post.city=encodeHtml(this.state.text.city.trim());
  posts.post.category=this.state.chips
}    
  posts.post.applied=[];
  axios({
    data:posts.post,
    withCredentials:true,
    url:'/makePost',
    method:'post'  
    }).then(data=>{
      console.log(data)
     if(data.data.save && !data.data.message){
      posts.post.id=data.data.postId
      this.props.insertPost(posts.post)
      this.setState({
          message2:'Posted successfully',
        text:{ 
          class:'',
          offerDetails:'',
          favoriteArea:'',
          studentGender:'',
          requiredTeacherSpecification:'',
          city:'',area:''},
          chips:[],
          loading:false,
          error:'',
        })
      }
      else{
        this.setState({
          error:'You have consumed your tokens for this month!'
          ,loading:false,
        })   
      }
    })
    .catch((error)=>{
        console.log(error)
      this.setState({
        error:'Unable to post the content'
      })
    })
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


    render(){
      return(
          
<Modal isOpen={this.props.posterOpen} centered>
           <ModalHeader >Post {this.props.type=="teacher"?"Offer":"Tuition"}</ModalHeader>
          <ModalBody>
      
       <div className="row">
       <div className="col-sm-12">
       {this.props.type=="teacher"?
       <div style={{width:'100%'}}> 
       <div style={{textAlign:'center',fontSize:'100%'}}>Offer Details</div>
       <Input style={{width:'100%'}} type="text" value={this.state.text.offerDetails} onChange={this.onChangeHandle.bind(this,'offerDetails')}  className="entertext" placeholder="I will teach 3 students in 10 thousands"/>
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
     }}/>
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
      {this.state.loading?
        <div style={{textAlign:'center'}}>   <Dots color="##788EA8" animating={true} size={34} speed={1}  /></div>
      : <div>
           <button className="btn btn-primary"   onClick={this.onMakePost.bind(this)}>Post</button>  {' '}
           <button className="btn btn-secondary" onClick={this.props.toggleModal}>Cancel</button>  
           </div>
      }
        
        
        
       
        

          </ModalFooter>
          <div style={{color:'red'}} >{this.state.error}</div>
          <div style={{color:'green'}}>{this.state.message2} </div>
        </Modal>
          

      )
    }
}
export default Makepost;