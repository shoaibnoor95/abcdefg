import React from 'react';
import axios from 'axios';
import {Input} from '../../node_modules/@material-ui/core'
import History from '../History';
import {encodeHtml} from './filterHtml';
export default class EmailConfirm extends React.Component{
   constructor(props){
       super(props);
       this.state={
           sucess:false,
         text:{ 
                password:'',
                confirmPassword:'',
                mobileNumber:''
            },
            id:'',  
            danger:false,
            message2:'',
            messageA:'',
            btnText:'Change Password',
            message3:'',
            option:1
       }
   }
   componentDidMount(){
       
    var id={
        id:this.props.match.params.id
    }
    axios({
        withCredentials:true,
        method:'get',
        url:'/passwordResetToken',
        params:id
    })
    .then(data=>{
        if(data.data.success){
        this.setState({
        sucess:true,
        id:this.props.match.params.id
        })
    }
    else if(data.data.verified){
        History.push('/')
    }
    })
    .catch(error=>{
        console.log(error)
    })
   }
   _onSubmit(e){
    e.preventDefault();
    if(this.state.option==2){
        History.push('/')
        }
    else{

        let data={
            password:encodeHtml(this.state.text.password.trim()),
            phoneNumber:encodeHtml(this.state.text.mobileNumber.trim()),
            code:encodeHtml(this.state.id)
        }    
        axios({
        method:'post',
        url:'/forgetPassword',
        data:data,
        withCredentials:true
        
    })
    .then(data=>{
    if(data.data.passwordChange){
        this.setState({
            btnText:'Continue',
            text:{
                phoneNumber:'',
                confirmPassword:'',
                password:'',
              
            },
                 message:'',
                 message2:'',
                 messageA:'',
                 message3:'',
                 option:2
                })
            }
            else if (data.data.error){
                this.setState({message3:data.data.error})
            }
            
        })
    } 
}
   _onChange(property,event){
    var sym=/<|>/g;
    if(!event.target.value.match(sym)|| event.target.value===""){
   if(property=="mobileNumber"){
       this.setState({
           message2:'Number should be with out the starting 0 eg 3111234567 '
       })
   }
  
        let text=this.state.text;
        text[property]=event.target.value
        this.setState({
                text
                })
                if(property==="confirmPassword"){
                    if(this.state.text.confirmPassword!==this.state.text.password && this.state.text.password!=""){
                        this.setState({
                            messageA:'',
                            message:'password does not match',
                            
                        })

                    }
                else if(this.state.text.confirmPassword ===this.state.text.password && this.state.text.confirmPassword!==""){
                    this.setState({
                        message:'',
                        messageA:'Password match'
                    })
                }
                }          
     }

   }

    render(){
        const style= {
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '50%',
            maxWidth:'100px',
            minWidth:'50px', 
            maxHeight:'100px', 
            minHeight:'50px'
            }
        return(
            <div>
               {this.state.sucess?
                <div style={{textAlign:'center', position:'absolute', margin:'10% 25%',padding:'1%', border: '2px solid #58D68D', borderRadius:'15px 10px 15px 10px'}}>
                    <img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeD0iMHB4IiB5PSIwcHgiIHZpZXdCb3g9IjAgMCA0MjYuNjY3IDQyNi42NjciIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQyNi42NjcgNDI2LjY2NzsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxwYXRoIHN0eWxlPSJmaWxsOiM2QUMyNTk7IiBkPSJNMjEzLjMzMywwQzk1LjUxOCwwLDAsOTUuNTE0LDAsMjEzLjMzM3M5NS41MTgsMjEzLjMzMywyMTMuMzMzLDIxMy4zMzMgIGMxMTcuODI4LDAsMjEzLjMzMy05NS41MTQsMjEzLjMzMy0yMTMuMzMzUzMzMS4xNTcsMCwyMTMuMzMzLDB6IE0xNzQuMTk5LDMyMi45MThsLTkzLjkzNS05My45MzFsMzEuMzA5LTMxLjMwOWw2Mi42MjYsNjIuNjIyICBsMTQwLjg5NC0xNDAuODk4bDMxLjMwOSwzMS4zMDlMMTc0LjE5OSwzMjIuOTE4eiIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K" style={style}/>
                    <br/><br/>
                    <div className="alert alert-success" role="alert">
                        <h4 className="alert-heading">Well done!</h4>
                        <p>You have successfully verify your email now please enter the new password.</p>
                        <hr/>
                        <p className="mb-0"> </p>
                    </div>
                    <div> Enter your password </div>
                    <Input type='password' value={this.state.text.password} onChange={this._onChange.bind(this,"password")}/>
                
                    <br/><br/>
                    <div>Enter your confirm password </div>
                    <div style={{color:'red'}}> {this.state.message}</div>
                    <div style={{color:'green'}}>{this.state.messageA}</div>
                    
                    <Input type='password' value={this.state.text.confirmPassword} onChange={this._onChange.bind(this,"confirmPassword")}/>
                    <hr/>
                    <div style={{textAlign:'center',fontWeight:'bold',color:'red'}}>Enter your phone number associated with this account</div>
                    <Input type='number' value={this.state.text.mobileNumber} onChange={this._onChange.bind(this,"mobileNumber")}/>
                    
                      <div style={{color:'green'}}>{this.state.message2}</div>
                 <button type="button" className="btn btn-success" onClick={this._onSubmit.bind(this)}>{this.state.btnText}</button>
                 <br/>
                <div style={{color:'red'}}> {this.state.message3}</div>
                </div>          
            :
                     <div style={{textAalign:'center', position: 'absolute', margin:'10% 25%',padding:'1%', border: '2px solid #C0392B', borderRadius:'15px 10px 15px 10px'}}>
                     <div style={{textAlign:'center',margin:'0 auto'}}>
                        <img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUwIDUwIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MCA1MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxjaXJjbGUgc3R5bGU9ImZpbGw6I0Q3NUE0QTsiIGN4PSIyNSIgY3k9IjI1IiByPSIyNSIvPgo8cG9seWxpbmUgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2U6I0ZGRkZGRjtzdHJva2Utd2lkdGg6MjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDsiIHBvaW50cz0iMTYsMzQgMjUsMjUgMzQsMTYgICAiLz4KPHBvbHlsaW5lIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlOiNGRkZGRkY7c3Ryb2tlLXdpZHRoOjI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7IiBwb2ludHM9IjE2LDE2IDI1LDI1IDM0LDM0ICAgIi8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=" style={{maxWidth:'100px', minWidth:'50px',  maxHeight:'100px', minHeight:'50px'}}/>
                      </div>
                        <br/><br/>
                        <div className="alert alert-danger" role="alert">
                            <h4 className="alert-heading">Ohhhh!</h4>
                            <p>It seems you have an invalid token or you are clicking the after 15 minutes.</p>
                            <hr/>
                            <p className="mb-0">No worries Please goto the confirmation by clicking the button.</p>
                        </div>
                        <div style={{textAlign:'center',margin:'0 auto'}}>
                        <button type="button" onClick={(e)=>{History.push('/passwordReset')}} className="btn btn-success">Goto reset page</button>
                  </div>     
                    </div>
            }
                </div>
        )
    }
}