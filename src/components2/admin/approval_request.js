import React from 'react';
import {Button} from 'react-bootstrap';
import Admin_nav from './Admin_nav';
import axios from 'axios';
import {Modal,ModalBody,ModalHeader, ModalFooter} from 'reactstrap';

class Approval_request extends React.Component{
 constructor(props){
   super(props);
  this.state={
    approvalRequests:[],
    error:'',
    message:'',
    delete:false,
    approved:false,
    showModal:false,
    message2:''
  }
  }
   onDownloadFile(property,username,event){
     event.preventDefault();
     axios({
       url:'/khjadsshjasdaslassldasdjasdeellkwwqehjtrjkhrjkwiuewruiowes/logie',
       method:'post',
       data:{fId:property,
        username:username
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
  onViewInformation(property,event){
    event.preventDefault();
    var win =window.open('/information/'+property,"_blank");
    win.focus();
  }
  onDeleteRequest(property,index,event){
    event.preventDefault();
    let userIde={
      userIde:property,
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
  onViewProfile(profile,event){
    event.preventDefault();
    var win=window.open('/'+profile);
    win.focus();
  }
  onApproveRequest(property,index,event){
    event.preventDefault();
    axios({
      url:'/lkjaweqwqupiew231oweiopqeqopeeqwkqeopiqeoiqeopzxcbv/aslkjads',
      method:'post',
      data:{userIde:property},
      withCredentials:true
    })
    .then(data=>{
      if(data.data.profileApprove){
        var approval=this.state.approvalRequests
        
        approval.splice(index,1);
        this.setState({
          approvalRequests:approval
        })  
      }
      })
    .catch(err=>{error:'Could not proceed with the request'})
  }
  componentDidMount(){
  
    axios({
    url:'/khjadsshjasdasdasdjasdeewwqehjtrjkhrjkwiuewruiowes/logie',
    method:'get',
    withCredentials:true
  })
  .then(data=>{
    console.log(data)
    if(data.data.user){
      this.setState({
      approvalRequests:data.data.user
  })
  }
    else {
      this.setState({
        message:'No request found'
      })
    }
  })
.catch(err=>{
  this.setState({
    error:'Could not proceed with the request'
  })
})

 }
  render(){
    const Requests=()=>{
      const lists=this.state.approvalRequests.map((el,i)=>{
      return(
        <tr key={i} height="55" className="req-num row_bor">
       <td>{i+1}</td>
        <td>Name: <span>{el['firstName'] +" "+ el['lastName']}</span></td>
        <td><Button  bsStyle="danger" className="btn-main btn-primary1" onClick={this.onDeleteRequest.bind(this,el['_id'],i)}>Delete</Button></td>
        <td>Personal Documents: <span style={{cursor:'pointer'}} onClick={this.onDownloadFile.bind(this,el['_id'],el['username'])} ><u>{el['username']}</u></span></td>
        <td><Button  bsStyle="primary" className="btn-main btn-primary1" onClick={this.onViewProfile.bind(this,el['username'])}>View</Button></td>
        <td><Button  bsStyle="success" className="btn-main btn-success1" onClick={this.onApproveRequest.bind(this,el['_id'],i)}>Approved</Button></td>
        <td><Button className="btn-main btn-success1" onClick={this.onViewInformation.bind(this,el['username'])}>Information</Button></td>  
       <td></td>
       </tr>
      )  
      })
      if(this.state.approvalRequests!=[])
      return lists;
    
    else{
      return <div/>
    }
  }
   return(
     <div> 
     <br/>
     <Admin_nav />
     
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
     <div className="text-center"><b>Approval Request</b></div>
     <br/>
     {/* <!-- data start !--> */}
     <div className="container">
     <div className="row">
     <div className="col-12">

<table className="table table-borderless table-responsive">
    <tbody>
   {/* <Approval_request/>    */}
       <Requests/>
       {/* <!-- 2row start !--> */}
      

       {/* <!-- 3row end !--> */}
       
       
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
export default Approval_request;