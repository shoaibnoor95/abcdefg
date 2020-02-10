import React from 'react';
import Nav from './Nav';
import History from '../History';
import {Input} from '../../node_modules/@material-ui/core';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap';
import firebase from './firebase';
import axios from 'axios';
import Dots from 'react-activity/lib/Dots'
import { checkStatus } from '../store/action/apiAction';

class Phone extends React.Component{
    constructor(props){
        super(props);
        this.state={
            code:'',
            phone:'',
            error:'',
            confirmationResult:null,
            message:'',
            loading:false
        }
    }
    componentDidMount(){
         this.props.check();
 axios({
     withCredentials:true,
     method:'get',
     url:'/getPhone'
    })
    .then(data=>{
        this.setState({phone:data.data.phone})

    })       
         window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('send-code-button', {
            'size': 'invisible',
            'callback': function(response) {
             this.sendMessage();
            }
        });
            
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
        recaptchaVerifier.render().then(function(widgetId) {
            window.recaptchaWidgetId = widgetId;
          });
            
    }

        submitCode(e){
            this.setState({
                loading:true
            })
            this.state.confirmationResult.confirm(this.state.code)
              .then((result)=>{
                
                if(result.user){
                    var phoneAuth=true;
                    axios({
                        method:'post',
                        withCredentials:true,
                        data:phoneAuth,
                        url:'/phoneAuth'
                    })
                    .then((data)=>{
                        if(data.data.phonesaved=true)
                        History.push('/form');
                        
                    })
                    .catch((error)=>{
                        this.setState({message:error.message,loading:false})
                    })
                } 
                //var user=result.user
                   

                })
            }
                     
        sendMessage(){
            var phoneNumber ="+92"+this.state.phone; 
            var appVerifier = window.recaptchaVerifier;
            firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then((confirmationResult)=> {
                this.setState({confirmationResult})
               console.log(confirmationResult)
            })
            .catch((error)=>{
                this.setState({message:error.message})
            });
        }

    render(){
        return(
            <div> 
            <Nav loggedIn={true}/>
            <br/><br/><br/>
            <div style = {{border : '2px solid #788EA8'  , borderRadius : '5px' ,  margin : '20px' , marginLeft : '12px' } }>
            
            <div style={{width:'100%',height:'100%',textAlign:'center'}}>
            <img src="/phone.png" style={{maxWidth:'350px',width:'auto',height:'350px',float:'none'}}/> <br/><br/>
            Your number <Input type="text" disabled value={"+92"+this.state.phone} />
            <div style={{alignContent:'center',color:'red'}}>
             Keep your phone along with you we will gonna send a confirmation message to your phone<br/>
            <div style={{width: '300px', margin: '0 auto 1em auto'}} id='recaptcha-container'>
            </div>
            </div>
            <br/>
            <div style={{color:'red'}}>{this.state.message}</div>
            <Button bsStyle="primary"  onClick={this.sendMessage.bind(this)} id="send-code-button">Send Code</Button> <br/> 
            <p style={{textAlign:'center',fontWeight:'bold',fontSize:'120%'}}>Enter the code you receive on your mobile phone </p>
            <Input type="Number" onChange={(e)=>{this.setState({code:e.target.value})}} placeholder="Type a code here"/><br/><br/>
            {this.state.loading? <div style={{textAlign:'center'}}>   <Dots color="#007bff" animating={true} size={34} speed={1}  /></div>
            :   
            <Button bsStyle="primary"onClick={this.submitCode.bind(this)} >Continue</Button>
        }
             <br/> <br/>
            </div>
            </div>
            </div>
        )
    }
}
function mapDispatchToProps(dispatch){
    return({
        check:()=>{
            dispatch(checkStatus())
        }
    })
}

export default connect (null,mapDispatchToProps)(Phone);