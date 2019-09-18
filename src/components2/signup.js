import React, { Component } from 'react';
import { connect } from 'react-redux';
import Nav from './Nav';
import {Link } from 'react-router-dom'; 
import History from '../History';
import {signup} from '../store/action/normalAction';
import { checkStatus } from '../store/action/apiAction';
import { Button } from 'react-bootstrap';
import Footer from './Footer'
import Dots from 'react-activity/lib/Dots';
class Signup extends Component {

    constructor(props) {
        super(props);
     this.state = {
        text:{
            firstName:'',
            lastName:"",
            username: "",
            password: "",
            confirm: "",
            email: "",
            phone: "+92",
        },
            message:'',
            message2:'',
            checked:false,
            loading:false
        }    
    }

       
   
    componentDidMount(){
     this.props.check();  
    }

    changeHandle2(type, event) {
       
   var sym=/<|>/g;
        let text = this.state.text;
        if(!event.target.value.match(sym)||event.target.value===""){
            switch(type){

            case "confirm":
            text[type] = event.target.value;
         
            if(this.state.text.password!==this.state.text.confirm){
                    text[type] = event.target.value;
                    this.setState({
                        message2:'',
                        message:'Password do not match'
                        ,text
                    })
                }
                else if(this.state.text.confirm.length===0){
                    this.setState({
                        message:'',
                        message2:''
                        ,text
                    })
                }
                else {
                    this.setState({
                        message:'',
                        text,
                        message2:'Password match'
                    })
                }
                                
                        break;
               case "username":
               let symbols=/^[a-zA-Z0-9-/\s]*$/;
               if(event.target.value.match(symbols)){
                let text=this.state.text
                    text[type]=event.target.value
                this.setState({
                    text
                   })
               }
               break;
               
                        case "phone":
                if((event.target.value!=0 ||event.target.value=="")&& event.target.value.length<14  ){
                    
                    text[type] = event.target.value;
                    this.setState({
                        message2:'Type number without 0 e.g. 3123456789',
                        text
                    })
                }
                        break;
                case "firstName":
                text[type] = event.target.value;
                var letters = /^[a-zA-Z\s]*$/;
                if(text[type].match(letters)){
                this.setState({
                    text            
                    })
                }
                    break;
                case "lastName":
                text[type] = event.target.value;
                var letters = /^[a-zA-Z\s]*$/;
                if(text[type].match(letters)){
                this.setState({
                    text            
                    })
                }
                    break;
                        
                    default:
                    text[type] = event.target.value;
                    this.setState({
                        text
                    })
                }   
                }  
                }
    
    
    submit2(e) {
        if(this.state.checked){
            if(this.state.text.confirm.length<7 || this.state.text.phone.length<10 || this.state.text.email.length<10 || this.state.text.username.length<6 ){
                this.setState({
                    message2:'',
        
                    message:'Username and password should be greater than 6 length'
                })
                    e.stopPropagation();
                return;
            }
            
            else{

                if(this.state.text.password !== this.state.text.confirm){
                    this.setState({
                    message2:'',
                    message:'Password did not match'
                })
                e.stopPropagation();
                return;
            }
            this.setState({loading:true}) 
            let f1=this.state.text.firstName.substr(0,1).toUpperCase();
            let fR=this.state.text.firstName.substr(1,this.state.text.firstName.length-1).toLocaleLowerCase();
            let l1=this.state.text.lastName.substr(0,1).toUpperCase();
            let lR=this.state.text.lastName.substr(1,this.state.text.lastName.length-1).toLocaleLowerCase();
            let text=this.state.text;
            text['firstName']=f1+fR;
            text['lastName']=l1+lR;
           
         this.props.userSignup(text)
        
         this.setState({loading:false})
        }
        
        }
        else{
        this.setState({
            message:'Kindly accept the license agreement'
            })
        }
            
     }
    componentWillReceiveProps(nextProps){
     
    console.log(nextProps)
    if(nextProps.loggedin.user){
            History.push('/phone')
        
    }
    else if(nextProps.loggedin.message){
        this.setState({
            message2:'',
            message:nextProps.loggedin.message
        })
    }
    else if(nextProps.loggedin.error){
        this.setState({
            message2:'',
            message:nextProps.loggedin.error
        })
    }
}
onCheck(e){
    e.preventDefault();
    this.setState({checked:e.target.checked})
}
    render() {
        return (
            <div>
                <div>
                <Nav
                   />

                <div className="mainn">

 
<br/>
<br/>
<br/>
<img className="book" src={'/books.gif'} />
<center><div className="formm" >
<center><h3 className="login">Sign Up</h3></center> 
<br></br>
<center><label><h6 className="name"> First Name &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="text" value={this.state.text.firstName} placeholder="First Name" className="un" onChange={this.changeHandle2.bind(this,"firstName")}/></h6></label> </center>
<center><label><h6 className="name"> Last Name  &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="text" placeholder="Type here" value={this.state.text.lastName} className="un" onChange={this.changeHandle2.bind(this,"lastName")}/></h6></label> </center>
<center><label><h6 className="name"> Username &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type="text" onChange={this.changeHandle2.bind(this,"username")} value={this.state.text.username} placeholder="Username" className="un"/></h6></label> </center>
<center><label><h6 className="name"> Email  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;<input type="text" placeholder="Email" className="un" value={this.state.text.email} onChange={this.changeHandle2.bind(this,"email")}/></h6></label> </center>
<center><label><h6 className="name"> Phone Number  &nbsp;&nbsp;&nbsp;&nbsp; <input type="text" placeholder="Phone Number" value={this.state.text.phone} onChange={this.changeHandle2.bind(this,"phone")} className="un"/></h6></label> </center>
<center><label><h6 className="name"> Password &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp; <input type="password" value={this.state.text.password}  placeholder="Password" onChange={this.changeHandle2.bind(this,"password")} className="un"/></h6></label> </center>
<center><h6>Confirm Password <input type="password"  id="myInput" className="un" placeholder="Confirm password" onChange={this.changeHandle2.bind(this,"confirm")} value={this.state.text.confirm}/></h6></center>
<center><h6><input type="checkbox" onChange={this.onCheck.bind(this)}  id="myInput" className="un"  />I accept the<Link to="/terms_and_agreement" target="_blank"><u> terms and conditions</u></Link></h6></center>
<div style={{color:'red'}}>{this.state.message}</div>
<div style={{color:'green'}}>{this.state.message2}</div>
<Button variant="warning" onClick={this.submit2.bind(this)} >Sign Up</Button> <br></br> <br></br>

</div> </center>
<br></br>
<div className="signup">

</div>
<div>
    <br/><br/><br/>
</div>
<Footer/>

            </div>
            </div>
            </div>
        )
    }
}

function mapStateToProps(state){
    return({
        loggedin:state.normalReducer.user
    })
}
function mapDispatchToProps(dispatch){
    return({
       
        userSignup:(value)=>{
            dispatch(signup(value))
        },
        check:()=>{
            dispatch(checkStatus())
        }

    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);