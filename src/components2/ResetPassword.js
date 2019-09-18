import React from 'react';
import {Input,Button }from '../../node_modules/@material-ui/core';
import axios from 'axios';
import Nav from './Nav';
import {encodeHtml} from './filterHtml'
import History from '../History';
export default class Resetpassword extends React.Component{

    constructor(props){
        super(props);
        this.state={
                email:'',
                mailSent:false,
                error:''
        }
    }
    onChangeHandle(event){
        var sym=/<|>/g;
        if(!event.target.value.match(sym)|| event.target.value==""){
            this.setState({
                email:event.target.value
             })
         }
        }
        onRequest(e){
            e.preventDefault();
            
            var email={
                email:encodeHtml(this.state.email)
            };

         try{

             axios({
                 method:'post',
                 withCredentials:true,
                 data:email,
                 url:'/resetPassword'
                }).then(data=>{
                    if(data.data.mail)
                    this.setState({
                        mailSent:true
                    })
                })
                .catch(err=>{
                    this.setState({
                        error:'Could not proceed the request'
                    })
                })
            }
            catch(exc){
                this.setState({
                    error:'Could not proceed the request'
                    
                })
            }
        }
    render(){
        return(
            <div>
                  <Nav logedIn={false} />
                <br/><br/>
                <div style={{textAlign:'center',border : '2px solid #4285f4', marginLeft:'29%',marginRight:'29%',marginTop:'10%',backgroundColor:'#fff'}}>
                <div className="row">
               <div className="col-sm-12">
               <br/>
               <div style={{textAlign:'center',fontSize:'110%'}}>Enter your email address or phone number to verify</div>
                {this.state.mailSent?
                 <div>   
                    {/* <Input  type="text" value={this.state.email} style={{width:'80%'}} onChange={this.onChangeHandle.bind(this)}   placeholder="Code"/> */}
                    <div style={{color:'red',fontSize:'120%'}}>
                        A reset token is sent to your email address check email
                        </div>
                    </div>
                    :  
                    <div>
                    <Input  type="text" value={this.state.email} style={{width:'80%'}} onChange={this.onChangeHandle.bind(this)}   placeholder="Phone number Or Email "/>
                        <div style={{color:'red'}}>{this.state.error}</div>
                        </div>
                }
                    </div>
                 </div>
                <br/>
{!this.state.mailSent?
    <Button className="btn-primary" onClick={this.onRequest.bind(this)} >Check</Button>
:
    <Button className="btn-primary" onClick={()=>{History.push('/')}} >OK</Button>    

}
                    
                    <br/><br/>
                </div>
                </div>
        )
    }
}