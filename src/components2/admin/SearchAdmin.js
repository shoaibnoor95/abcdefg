import React from 'react';
import Admin_nav from './Admin_nav';
import {Button} from 'react-bootstrap';
import Axios from 'axios';
import {Modal,ModalBody,ModalHeader, ModalFooter} from 'reactstrap';
class SearchAdmin extends React.Component{
constructor(props){
    super(props);
    this.state={
        search:'',
        message2:'',
        message3:'',
        showModal:false,
        user:{username:'',
        firstName:'',
        lastName:'',
        _id:'',}
    }
}
onDownloadFile(event){
    event.preventDefault();
    axios({
      url:'/khjadsshjasdaslassldasdjasdeellkwwqehjtrjkhrjkwiuewruiowes/logie',
      method:'post',
      data:{
            fId:this.state.user._id,
            username:this.state.user.username
     },
      withCredentials:true
    })
    .then(data=>{
     if(data.data.download){
         this.setState({
             showModal:true,
             message2:'File downloaded in root folder'
         })
     }
    })
  }
 onViewInformation(event){
   event.preventDefault();
   var win =window.open('/information/'+this.state.user.username,"_blank");
   win.focus();
 }
 onDeleteRequest(event){
   event.preventDefault();
   let userIde={
     userIde:this.state.user.id,
   }
   axios({
     url:'/lkjaweqwqupiew231oweiopqeqopeeqwkqeopiqeoiqeopzxcbv/aslkjads',
     method:'post',
     data:userIde,
     withCredentials:true,
   })
   .then(data=>{
     if(data.data.profileDelete){
        this.setState({
            showModal:true,
            message2:'Profile deleted successfully'
        })
       
     }
   })
   .catch(err=>{
     console.log(err)
   })
 }
 onViewProfile(event){
   event.preventDefault();
   var win=window.open('/'+this.state.user.username);
   win.focus();
 }
onSeachAdmin(event){
    event.preventDefault();
    Axios({
        url:'/lkjaweqwqupiew231oweiopqeqopeeqwkqeopiqeoiqeopzxcbvsearch/deletes',
        method:'post',
        withCredentials:true,
        data:{search:this.state.search}
    }).then(data=>{
        console.log(data.data)
    let user=this.state.user;
    user=data.data.user
        this.setState({
            user
        })
    })
}
onChangeHandle(event){
    this.setState({search:event.target.value})
}
onDeactivateProfile(event){
event.preventDefault();
    Axios({
    url:'/dihaddjksanmdkdjlmvbkvjckvlkvbklkfldeoirwreoiprowiwrpeoasddaseropr',
    method:'post',
    withCredentials:true,
    data:{id:this.state.user._id}
})
.then(data=>{
    console.log(data.data)
    if(data.data.deactivate){
        this.setState({
            message2:'Profile deactivate',
            showModal:true
        })
    }
})
}
    render(){
return (
<div>


<br/>

<Admin_nav/>

<Modal isOpen={this.state.showModal} >
<ModalHeader>Confirmation </ModalHeader>
<ModalBody>{this.state.message2}</ModalBody>
<ModalFooter>
<Button bsStyle="primary" bsSize="small" onClick={()=>{this.setState({showModal:false})}}>Ok </Button>
</ModalFooter>
</Modal>

<div className="container">
<div className="row">
<div className="col-12 col-border">
<div className="text-center"><b>Search Profile</b></div>
<br/>
{/* <!-- data start !--> */}
<div className="container">
<div className="row">
<div className="col-12">



<div className="container">
<form>
<div className="row">
<div className="col-md-6 ">

<div className="form-group">
<input type="text" value={this.state.search} onChange={this.onChangeHandle.bind(this)} className="form-control" placeholder="Search by phone/ Search by email/Search by username" name="Search"/>
</div>
</div>

<div className="col-md-2 ">
<Button bsStyle="link" onClick={this.onSeachAdmin.bind(this)}>&nbsp;Search&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</Button>
</div>

</div>
</form>
</div>
<div style={{color:'green'}}> {this.state.message} </div>

<span>Search Results</span>
<br/>
<br/>
<table className="table table-borderless table-responsive">
<tbody>
    {this.state.user.username!=""?

<tr height="55" className="req-num row_bor">
<td>1)</td>
<td>Name: <span>{this.state.user.firstName +" "+this.state.user.lastName}</span></td>
<td><Button bsStyle="primary" onClick={this.onViewInformation.bind(this)}>VIEW</Button></td>
<td><Button bsStyle="info" onClick={this.onDownloadFile.bind(this)}>File</Button></td>
<td><Button  onClick={this.onDeactivateProfile.bind(this)}>Deactivate</Button></td>
<td><Button bsStyle="danger" onClick={this.onDeleteRequest.bind(this)}>Delete</Button></td>
<td><Button bsStyle="success" onClick={this.onViewProfile.bind(this)}>PROFILE</Button></td>

<td></td>
</tr>
:<tr/>
    }




</tbody>
</table>

</div>
</div>
</div>
{/* <!-- data end!--> */}

</div>
</div>
</div>
</div>
)
}
}
export default SearchAdmin;