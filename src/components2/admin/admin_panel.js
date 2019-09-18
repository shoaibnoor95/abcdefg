import React from 'react';
import Admin_nav from "./Admin_nav";
import axios from 'axios';


class Admin_panel extends React.Component{
constructor(props){
  super(props);
  this.state={
    approvedRequest:'',
    offer:'',
    studentCount:'',
    teacherCount:'',
    temporaryUser:'',
    totalUser:'',
    tuition:'',
    error:''    
  }
}
  componentDidMount(){
  axios({
    url:'/243adssssdasdsadsadsaaddsadsadsacsadsdsdsadsadsadsadsadsacx/sdaasddsa',
    method:'get',
    withCredentials:true,
  })
  .then(data=>{
    console.log(data.data)
    this.setState({
      approvedRequest:data.data.countings.approvedRequest,
      offer:data.data.countings.offer,
      studentCount:data.data.countings.studentCount,
      tuition:data.data.countings.tuition,
      temporaryUser:data.data.countings.temporaryUser,
      teacherCount:data.data.countings.teacherCount,
      totalUser:data.data.countings.totalUser
    })
  })
  .catch(error=>{
    this.setState({
      error:'Could not proceed with the request'
    })
  })
}
  render(){
  
return(
  <div>
  <br/>

  <Admin_nav/>

<div className="container">
<div className="row">
<div className="col-12 col-border">
<div className="text-center"><b>Statistics</b></div>
<br/>
{/* <!-- data start !--> */}
<div className="container">
<div className="row">
<div className="col-12">

<table className="table table-borderless table-responsive">
<tbody>
<tr height="55" className="req-num">
<td>Approval Requests:</td>
<td>{this.state.approvedRequest}</td>
</tr>

<tr height="55" className="req-num">
<td>Fake Users:</td>
<td>{this.state.temporaryUser}</td>
</tr>

<tr height="55" className="req-num">
<td>Total Approved User:</td>
<td>{this.state.approvedRequest}</td>
</tr>


<tr height="55" className="req-num">
<td>Teachers Account:</td>
<td>{this.state.teacherCount}</td>
</tr>

<tr height="55" className="req-num">
<td>Students Account:</td>
<td>{this.state.studentCount}</td>
</tr>


<tr height="55" className="req-num">
<td>Tution Posted:</td>
<td>{this.state.tuition}</td>
</tr>


<tr height="55" className="req-num">
<td>Teacher's Offer:</td>
<td>{this.state.offer}</td>
</tr>

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
export default Admin_panel