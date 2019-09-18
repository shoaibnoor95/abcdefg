import React, { Component } from 'react';
import axios from 'axios';
import Nav from './Nav';
import StudentOrTeacher from './StudentOrTeacher';
//import History from '../History';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import firebase from './firebase';
import { Button as ModalButton, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { changePassword, changeEmail, changePhoneNumber, changeSettings, viewSetting } from '../store/action/apiAction'
import { Col, Form, FormGroup, Label, Input} from 'reactstrap';
class MySetting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestType:'',
      text: {    
        email: '',
        percentage: '',
        class: '',
        school: '',
        subject: '',
        learn: '',
        moto: '',
        hobby: '',
        study: '',
        spec1: '',
        teach: '',
        type: '',
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
        newEmail: '',
        oldEmail: '',
        newEmailConfirm: '',
        oldPhone: '',
        newPhone: '',
        newPhoneConfirm: '',
        type: { value: '' },
      },
      suggesstions:["CHEMISTRY","PHYSICS","MATHS","BIOLOGY","PRIMARY","SECONDARY","O/A Levels","INTER COMMERCE","PRE PRIMARY","COMPUTER SCIENCES","BUSINESS ADMINSTRATION","POST GRADUATION","INTER PRE MEDICAL","INTER PRE ENGINEERING","INTER ARTS","FINANCE","MARKETING","ECAT","ONLINE","QURAN KARIM","ENGLISH LANGUAGE"],
      btnName:'Proceed',
      modal: false,
      message:'',
      message2:'',
      messageE:'',
      messageE2:'',
      messageM:'',
      messageM2:'',
      messageP:'',
      messageP2:'',
      confirmationResult:null,
      code:'',
      stats:{},
      Chips:[],
      counter:0,
    }

  }
  componentDidMount() {
    this.props.getSetting();
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
  //  e.preventDefault();
    this.state.confirmationResult.confirm(this.state.code)
    .then((result)=>{
      console.log(result)
      if(result.user){
        console.log(result.user)
        let user2={
            password:this.state.text.oldPassword,
            newPhone:this.state.text.newPhone,
            oldPhone:this.state.text.oldPhone
          }
        axios({
              url:'/changePhone',
              method:'post',
              withCredentials:true,
              data:user2,
          })
          .then((data)=>{
            console.log(data.data)
              if(data.data.phonesaved=true)
          {this.setState({
            messageP2:'Phone number updated!'
          })}
              else{
                this.setState({
                  messageP:'You have inserted a code'
                })
              }
                    
          })
          .catch((error)=>{
              this.setState({message:error.message})
          })
      } 
      })
  }
  sendMessage(){
    console.log('in send message')
    var phoneNumber ="+92"+this.state.text.newPhone; 
    var appVerifier = window.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult)=> {
        this.setState({confirmationResult,
        message:'A confirmation message is sent to your number',
      requestType:'',
      btnName:'OK'})
       console.log(confirmationResult)
    })
    .catch((error)=>{
        this.setState({message:error.message})
    });
}

  handleChange3(property, event) {

    let text3 = this.state.text;
    switch(property){
      case "newPhone":
      var symbols=/^[0-9-/\s]*$/;  
      if(event.target.value.match(symbols) ||  event.target.value === ""){
       
        text3[property]=event.target.value;
          this.setState({
          text: text3,
          messageP2:'Write number without starting 0  eg. 3111234567'
        })  

      }
    
         break;
    case "oldPhone":
    var symbols=/^[0-9-/\s]*$/;
      if(event.target.value.match(symbols) ||  event.target.value === ""){
       
        text3[property]=event.target.value;
          this.setState({
          text: text3,
          messageP2:'Write number without starting 0  eg. 3111234567'
        })  
      }
      break;
      case "newPhoneConfirm":
      var symbols=/^[0-9-/\s]*$/;
      if(event.target.value.match(symbols) ||  event.target.value === ""){
       
        text3[property]=event.target.value;
          this.setState({
          text: text3
        })  
      
      if(this.state.text.newPhoneConfirm!=this.state.text.newPhone && this.state.text.newPhone!==""){
        this.setState({
          messageP2:'',
          messageP:'Phone number does not match'
        })
      }
      else if(this.state.text.newPhoneConfirm==this.state.text.newPhone && this.state.text.newPhone!=""){
       this.setState({
         messageP:'',
         messageP2:'Phone number match'
       })   
      }
      else{
        this.setState({
          messageP:'',
          messageP2:'',
        })
        }
}
       break;

      case "newEmailConfirm":
      var symbols=/<|>/g;
      
      if (!event.target.value.match(symbols) || event.target.value === "") {
        text3[property]=event.target.value;
        this.setState({
          text: text3
        })
        if(this.state.text.newEmail!=this.state.text.newEmailConfirm && this.state.text.newEmail!==""){
          this.setState({
            messageE2:'',
            messageE:'Email does not match',
          })   
         }
         else if(this.state.text.newEmail===this.state.text.newEmailConfirm && this.state.text.newEmail!=""){
          this.setState({
            messageE:'',
            messageE2:'Email match',
          })
         }else {
          
            this.setState({
              messageE:'',
              messageE2:'',
            })
            }
         
        }
      break;
    case "newEmail":
      var symbols=/<|>/g;
      if (!event.target.value.match(symbols) || event.target.value === "") {
        text3[property]=event.target.value;
        this.setState({
          text: text3,
          messageE2:'Write email address in lower case'
        })
}
        break;
        case "newPassword":
        var symbols=/<|>/g;
      
        if (!event.target.value.match(symbols) || event.target.value === "") {
          text3[property]=event.target.value;
          this.setState({
            text: text3
          })
          }
          break;
      case "oldPassword":
      var symbols=/<|>/g;
      
      if (!event.target.value.match(symbols) || event.target.value === "") {
        text3[property]=event.target.value;
        this.setState({
          text: text3
        })
        
        }
        break;
      case "newPasswordConfirm":
      var symbols=/<|>/g;
      
      if (!event.target.value.match(symbols) || event.target.value === "") {
        text3[property]=event.target.value;
        this.setState({
          text: text3
        })
       
         if(this.state.text.newPassword!=this.state.text.newPasswordConfirm && this.state.text.newPassword!="" ){
          this.setState({
            messageM2:'',
            messageM:'Password does not match',
          })   
         }
         else if(this.state.text.newPassword===this.state.text.newPasswordConfirm && this.state.text.newPasswordConfirm!==""){
          this.setState({
            messageM:'',
            messageM2:'Password match',
          })
         }
         else{
          this.setState({
            messageM:'',
            messageM2:'',
          })
          }
         
   
        }
        break;               
  
  }  
}
  

  
  toggle(property,event) {
    let reqType=this.state.requestType;
    reqType=property;
    this.setState({
      modal: !this.state.modal,
      requestType:reqType 
    });
 
  }
  requestToggle(event){
    
    switch(this.state.requestType){
      case "changeSetting":
      if(this.state.text.oldPassword.length<6){
        this.setState({
          message:'Password length must be greater than 5',
          message2:''
        })
        break;
      }
      let user={
        spec1:this.state.text.spec1,
        hobby:this.state.text.hobby,
        password:this.state.text.oldPassword,        
        moto:this.state.text.moto,
        school:this.state.text.school, 
        teach:this.state.Chips,
        subject:this.state.text.subject
      };
        this.props.postSetting(user);
        break;
      case "changeEmail":
      if(this.state.text.newEmail!=this.state.text.newEmailConfirm ||this.state.text.newEmail.length<10){
        this.setState({
          messageE2:'',
          messageE:'Email length must be greater than 10'
        })
        break;
      }
        let user2={
        newEmail:this.state.text.newEmail,
        password:this.state.text.oldPassword
      }
      this.props.postEmail(user2)
      break;
      case "changePassword":
      if(this.state.text.newPassword!=this.state.text.newPasswordConfirm ||this.state.text.newPasswordConfirm.length<6){
        this.setState({
          messageM2:'',
          messageM:'Password length must be greater than 5'
        })
        break;
      }
      let user3={
        newPassword:this.state.text.newPassword,
        password:this.state.text.oldPassword
      }
   let text2= this.state.text;
   text2.newPassword="";
   text2.newPasswordConfirm="";
   this.setState({
     text:text2
   })
      this.props.postPassword(user3);
        break;
      case "changePhoneNumber":
      
        if(this.state.text.newPhone!=this.state.text.newPhoneConfirm ||this.state.text.newPhoneConfirm.length<10 ){
          this.setState({
            messageP2:'',
            messageP:'Phone number length must be equal to 10'
          })
          break;
        }

          axios({
            url:'/getPhone',
            withCredentials:true,
            method:'get',
        })
            .then((data)=>{
            
                if(data.data.phone===this.state.text.oldPhone){
                   this.sendMessage()       
                }
                else{
                  this.setState({messageP:'Sorry you have insert wrong phone number'})
                }   
            })  
            .catch((err)=>{
            })
          break;
        default:
        this.toggle(this,"");
        this.setState({
          btnName:'Proceed',
          message:'',
          message2:'',
          messageE:'',
          messageE2:'',
          messageM:'',
          messageM2:'',
          messageP:'',
          messageP2:''
        })
    
  }
}


  
  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (nextProps.setting.user) {
      if(nextProps.setting.stats){
        this.setState({
          stats:nextProps.setting.stats
        })
      }
      if (nextProps.setting.user.type) {
        console.log(nextProps.setting)
        let text = this.state.text;
        text.oldPassword=""
        text.email = nextProps.setting.user.email;
        text.hobby = nextProps.setting.user.hobby;
        text.moto = nextProps.setting.user.moto;
        text.type.value = nextProps.setting.user.type;
        text.spec1 = nextProps.setting.user.spec1;
        text.study = nextProps.setting.user.study;
        text.school = nextProps.setting.user.school;
        text.subject = nextProps.setting.user.subject;
        text.email = nextProps.setting.user.email;
        var Chips=nextProps.setting.user.teach;
        console.log(Chips)
        if(nextProps.setting.savedSetting){
            let message="",message2=""
            if(nextProps.setting.message){
              message=nextProps.setting.message;
            }
            else{
              message2='Setting has been saved';
            }
          this.setState({
            text,
            Chips,
            message:message,
            message2:message2,
            password:'',
            requestType:'',
            btnName:'OK'
        })
      }
        else{
           
            this.setState({
              text,
              message:nextProps.setting.message,
              message2:'',
              Chips,
               })
           }
      }
    }
  }


  render() {


    return (
      <div>
        
        <Nav verify={true} loggedIn={true} counter={this.state.stats.notifyCounter} showMessageCounter={true} />
<br/><br/><br/><br/>

        <div style={{ border: '2px solid #788EA8', borderRadius: '5px', margin: '20px', marginLeft: '12px' }}>
          
          <Modal isOpen={this.state.modal} centered toggle={this.toggle.bind(this,"")} className={this.props.className}>
              <ModalHeader toggle={this.toggle.bind(this,"")} charCode="X">Authenticate your self</ModalHeader>
              <ModalBody>
              Enter password
                <div style={{color:'red',fontWeight:'bold'}}>{this.state.message}</div>
                <div style={{color:'green',fontWeight:'bold'}}>{this.state.message2}</div>
               </ModalBody>
              <ModalFooter>
                <Input type="password" value={this.state.text.oldPassword} onChange={this.handleChange3.bind(this,"oldPassword")}  />
                <ModalButton color="primary" onClick={this.requestToggle.bind(this)} >{this.state.btnName}</ModalButton>{' '}
                <ModalButton color="secondary" onClick={this.toggle.bind(this,"")} >Cancel</ModalButton>
              </ModalFooter>
            </Modal>
          <Form className="col-md-10 mt-3" >

            <StudentOrTeacher StudentOrTeacher={this} />

            <div style={{ textAlign: 'center' }}  > <Button onClick={this.toggle.bind(this,"changeSetting")} bsStyle="primary">Change Settings</Button> </div>
          </Form>
          <br />
          <div style={{ fontSize: '110%', textAlign: 'center', fontWeight: 'bold' }}>
            Change Email  </div>

          <Form className="col-md-10 mt-3" >
            <FormGroup row>
              <Label sm={6}>Email address</Label>
              <Col sm={6}>
                <Input type="text" disabled onChange={this.handleChange3.bind(this, "email")} required value={this.state.text.email} placeholder="Email address" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={6}>New email</Label>
              <Col sm={6}>
                <Input type="text" onChange={this.handleChange3.bind(this, "newEmail")} required value={this.state.text.newEmail} placeholder="New Email" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={6}>Confirm new email</Label>
              <Col sm={6}>
                <Input type="text" onChange={this.handleChange3.bind(this, "newEmailConfirm")} required value={this.state.text.newEmailConfirm} placeholder="Confirm Email" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={6}></Label>
              <Col sm={6}>
               <div style={{color:'red'}}>{this.state.messageE}</div>
               <div style={{color:'green'}}>{this.state.messageE2}</div>
              </Col>
            </FormGroup>
           
            <div style={{ textAlign: 'center' }}  >  <Button bsStyle="primary" onClick={this.toggle.bind(this,"changeEmail")} >Change Email</Button> </div>
          </Form>
          <br />
          <div style={{ fontSize: '110%', textAlign: 'center', fontWeight: 'bold' }}>
            Change Password  </div>
          <Form className="col-md-10 mt-3" >
            <FormGroup row>
              <Label sm={6}>New password</Label>
              <Col sm={6}>
                <Input type="password" onChange={this.handleChange3.bind(this, "newPassword")} required value={this.state.text.newPassword} placeholder="New Password" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={6}>Confirm new password</Label>
              <Col sm={6}>
                <Input type="password" onChange={this.handleChange3.bind(this, "newPasswordConfirm")} required value={this.state.text.newPasswordConfirm} placeholder="Confirm Password" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={6}></Label>
              <Col sm={6}>
               <div style={{color:'red'}}>{this.state.messageM}</div>
               <div style={{color:'green'}}>{this.state.messageM2}</div>
              </Col>
            </FormGroup>
           
            <div style={{ textAlign: 'center' }}  >  <Button bsStyle="primary" onClick={this.toggle.bind(this,"changePassword")} >Change Password</Button> </div>
          </Form>
          <br />
          <div style={{ fontSize: '110%', textAlign: 'center', fontWeight: 'bold' }}>
            Change Phone Number  </div>
          <Form className="col-md-10 mt-3" >
            <FormGroup row>
              <Label sm={6}>Old Phone Number</Label>
              <Col sm={6}>
                <Input type="text" onChange={this.handleChange3.bind(this, "oldPhone")} required value={this.state.text.oldPhone} placeholder="Old Phone Number" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={6}>New Phone Number</Label>
              <Col sm={6}>
                <Input type="text" onChange={this.handleChange3.bind(this, "newPhone")} required value={this.state.text.newPhone} placeholder="New Phone Number" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={6}>Confirm New Phone Number</Label>
              <Col sm={6}>
                <Input type="text" onChange={this.handleChange3.bind(this, "newPhoneConfirm")} required value={this.state.text.newPhoneConfirm} placeholder="Confirm Phone Number" />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={6}></Label>
              <Col sm={6}>
               <div style={{color:'red'}}>{this.state.messageP}</div>
               <div style={{color:'green'}}>{this.state.messageP2}</div>
              </Col>
            </FormGroup>
            <div style={{width: '300px', margin: '0 auto 1em auto'}} id='recaptcha-container'></div>
            <div style={{ textAlign: 'center' }}  >  <Button bsStyle="primary" id='send-code-button' onClick={this.toggle.bind(this,"changePhoneNumber")} >Send Code</Button> </div>
            <br/>
            <FormGroup row>
              <Label sm={6}>Enter the code you receive</Label>
              <Col sm={6}>
                <Input type="Number" onChange={(e)=>{this.setState({code:e.target.value})}} required value={this.state.code} placeholder="Enter confirmation code" />
              </Col>
            </FormGroup>
            <div style={{ textAlign: 'center' }}  >  <Button bsStyle="primary"  onClick={this.submitCode.bind(this)} >Chamge Number</Button> </div>
          </Form>
          <br />
        </div>
      </div>

    )
  }
}
function mapStateToProps(state) {
  return ({
    setting: state.apiReducer.user
  })
}
function mapDispatchToProps(dispatch) {
  return ({
    getSetting: () => {
      dispatch(viewSetting())
    },
    postSetting: (value) => {
      dispatch(changeSettings(value))
    },
    postEmail:(value)=>{
      dispatch(changeEmail(value))
    },
    postPassword:(value)=>{
      dispatch(changePassword(value))
    },
    postPhone:(value)=>{
      dispatch(changePhoneNumber(value))
    }
  })
}
export default connect(mapStateToProps, mapDispatchToProps)(MySetting);