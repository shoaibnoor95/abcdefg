import React, { Component } from 'react';
import axios from 'axios';
import { Col, Button, Form, FormGroup, Label, Input} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {encodeHtml} from './filterHtml';
import Select from 'react-select';
import {connect} from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';
import Nav from './Nav';
import StudentOrTeacher from './StudentOrTeacher';
import History from '../History';
import {encrypt} from '../../models/encr';
import Dots from 'react-activity/lib/Dots'
import {checkStatus} from '../store/action/apiAction'
class Formed extends Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleAnswer = this.handleAnswer.bind(this);
    this.handleInterface=this.handleInterface.bind(this)
  }
componentDidMount(){
 
 this.props.check();
}
  state={
    loading:false,
    Chips:[],
    counter:0,
    suggesstions:["CHEMISTRY","PHYSICS","MATHS","BIOLOGY","PRIMARY","SECONDARY","O/A Levels","INTER COMMERCE","PRE PRIMARY","COMPUTER SCIENCES","BUSINESS ADMINSTRATION","POST GRADUATION","INTER PRE MEDICAL","INTER PRE ENGINEERING","INTER ARTS","FINANCE","MARKETING","ECAT","ONLINE","QURAN KARIM","ENGLISH LANGUAGE"],
    text:{
    qualification:"",
    institute:"",
    area:"",
    city:"",
    startDate: moment(),
    country:"",
    postalCode:"",
    houseNumber:"",
    gender:"",
    percentage:'',
    class:'',
    school:'',
    subject:'',
    type:"",
    cnic:"",
    ans1:"",
    ans2:moment(),
    ans3:"",
    spec1:"", 
    study:"",
    hobby:"",
    moto:"",
    
  },
  message:''
}
handleChange3(property,event){
   
    let text3=this.state.text;
    var letters = /^[a-zA-Z\s]*$/;
    
    if(property=='qualification' || property=='institute'|| property=='area'|| property=='city' || property=='country'|| 
    property=='ans1' || property=='ans3')
    {
        if(event.target.value.match(letters)||event.target.value==""){
            
            text3[property]=event.target.value;
            this.setState({
                text:text3
            }) 

        }
    }
    else if( property=='cnic'|| property=='postalCode'|| property== "ans2"){
      
      text3[property]=event.target.value;       
      var numbers=/^[0-9]*$/;    
      if(event.target.value.match(numbers)|| event.target.value==""){
        if(text3[property].length<=13 || event.keyCode === 8 ){
          this.setState({
            text:text3
          })
          
        }  
            }
        } 
        else{
            var symbols=/^[a-zA-Z0-9-/\s]*$/;
            text3[property]= event.target.value;
            if(event.target.value.match(symbols)||event.target.value===""){

                this.setState({
                    text:text3
                }) 
            }
        }
   
}

handleInterface(type){
  let text=this.state.text;
  text["type"]=type;
           this.setState({
              text:text
           })
          }
handleAnswer(date2){
  let text=this.state.text;
  text["ans2"]=date2
            this.setState({
              text
            }) 
          }         
handleChange(date){
  let text=this.state.text;
  text["startDate"]=date;
  this.setState({
    text
  });
}
handleSubmit(e){
   e.preventDefault();
   if(this.state.text.type=="")
  {    this.setState({
        message:'Kindly Select a category'
      })
      return;
    }
    // if(this.state.loading){}
    let user={
      postalCode:     encodeHtml(this.state.text.postalCode.trim()),
      qualification:  encodeHtml(this.state.text.qualification.trim()),
      institute:      encodeHtml(this.state.text.institute.trim()),
      area:           encodeHtml(this.state.text.area.trim()),
      city:           encodeHtml(this.state.text.city.trim()),
      country:        encodeHtml(this.state.text.country.trim()),
      dOb:            encodeHtml(this.state.text.startDate),
      gender:         encodeHtml(this.state.text.gender.trim()),
      houseNumber:    encodeHtml(this.state.text.houseNumber.trim()),
      hobby:          encodeHtml(this.state.text.hobby.trim()),
      moto:           encodeHtml(this.state.text.moto.trim()),
      spec1:          encodeHtml(this.state.text.spec1.trim()),
      school:         encodeHtml(this.state.text.school.trim()),
      subject:        encodeHtml(this.state.text.subject.trim()),
      cnic:           encodeHtml(this.state.text.cnic.trim()),
      ans1:           encrypt(encodeHtml(this.state.text.ans1.trim())),
      ans2:           encrypt(encodeHtml(this.state.text.ans2)),
      ans3:           encrypt(encodeHtml(this.state.text.ans3.trim())),
      type:           encodeHtml(this.state.text.type.value.trim()),
      }
      if(this.state.text.type=="student"){
        user.learn=this.state.text.learn.trim();
        user.class=this.state.text.class.trim();
        user.percentage=this.state.text.percentage.trim();
      }
      if(this.state.text.type.value=="teacher"){
        user.study=this.state.text.study.trim();
        user.teach=this.state.Chips;
        user.spec1=encodeHtml(this.state.text.spec1.trim());
     
      }
      
      if(user.postalCode=="" ||user.qualification=="" || user.institute=="" || user.area=="" || user.city==""
      ||user.country=="" || user.country=="" || user.city=="" || user.dOb=="" || user.gender=="" || user.houseNumber==""
      || user.cnic=="" || user.ans1=="" 
      || user.ans2=="" || user.ans3=="" || user.type==""){
        this.setState({
          message:'Kindly Fill all the fields for your own security'
,         loading:false
        })
      }
      else{

      return axios({
      withCredentials:true,
      url:'/form',
        method:'post',
        data:user,
        withCredentials:true
      })
    .then((data)=>{
      if(data.data.proceed)
      History.push('/photo');
    })
    .catch((err)=>{
      this.setState({
        message:'Could not proceed with the request', 
        loading:false
      })
    })  
}
}
componentDidMount(){
 
    this.props.check();
  }
  
    render() {
  const options = [
        { value: 'student', label: 'Student' },
        { value: 'teacher', label: 'Teacher' },
      ];
      
        return (
            <div>
            
            <Nav loggedIn={true}  />
          <br/> <br/><br/><br/>
            <div style = {{border : '2px solid #788EA8'  , borderRadius : '5px' ,  margin : '20px' , marginLeft : '12px' } }>
            <Form  className = "col-md-10 mt-3" >
              <p style={{textAlign:'center',fontWeight:'bold',fontSize:'120%'}}>Kindy select a catogory you are applying for </p>   
              <div style={{textAlign:'center',fontWeight:'bold',fontSize:'100%',width:'100%',height:'100%'}}>
              <Select
              required={true}
              value={this.state.text.type}
                onChange={this.handleInterface}
                options={options}/>
           <br/>
          </div> 
         <FormGroup row>
          <Label  sm={6}>Qualification</Label>
          <Col sm={6}>
            <Input type="text" onChange={this.handleChange3.bind(this,"qualification")} value={this.state.text.qualification} id="Qualification"  placeholder="Qualification" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label sm={6}>Last institute attended</Label>
          <Col sm={6}>
            <Input type="text" required  onChange={this.handleChange3.bind(this,"institute")} value={this.state.text.institute}  placeholder="Last institute attended" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label  sm={6}>Date of birth</Label>
          <Col sm={6}>
          <DatePicker
          required
          selected={this.state.text.startDate}
          onChange={this.handleChange}
      />
      </Col>
        </FormGroup>
        <FormGroup row>
          <Label  sm={6}>Area</Label>
          <Col sm={6}>
            <Input type="text" required  onChange={this.handleChange3.bind(this,"area")} required value={this.state.text.area}  placeholder="Area" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label  sm={6}>City</Label>
          <Col sm={6}>
            <Input type="text" required  onChange={this.handleChange3.bind(this,"city")} required value={this.state.text.city}  placeholder="City" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label  sm={6}>Country</Label>
          <Col sm={6}>
            <Input type="text" required onChange={this.handleChange3.bind(this,"country")} required value={this.state.text.country}  placeholder="Country" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label  sm={6}>Postal Code</Label>
          <Col sm={6}>
            <Input type="text" required onChange={this.handleChange3.bind(this,"postalCode")}  required value={this.state.text.postalCode} placeholder="Postal Code" />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label sm={6}>House along with street No.</Label>
          <Col sm={6}>
            <Input type="text" required onChange={this.handleChange3.bind(this,"houseNumber")} required value={this.state.text.houseNumber} placeholder="House address" />
          </Col>
        </FormGroup>
    <FormGroup   row>
    <Label  sm={6}>Gender</Label>
      <Col sm={5}>
          <select defaultValue={this.state.text.gender} onChange={(e)=>{let text=this.state.text; text['gender']=e.target.value; this.setState({text})}}>
             <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option> 
          </select>
         
          </Col>
    </FormGroup>
    <p style = {{fontWeight : 'bold',color:'red' }}>This data will not be revealed to anyone its just for your own security be careful with this information we will verify your answers </p>
        <FormGroup row>
      <Label sm={6}>CNIC No or B.form No.</Label>
      <Col sm={6}>
        <Input type="text"   required onChange={this.handleChange3.bind(this,"cnic")} value={this.state.text.cnic} placeholder="CNIC No or B.form No" />
      </Col>
    </FormGroup>
    <FormGroup row>
      <Label  sm={6}>Name Of your father</Label>
      <Col sm={6}>
        <Input type="text" placeholder="Father`s full name"
        onChange={this.handleChange3.bind(this,"ans1")} required value={this.state.text.ans1} />
      </Col>
    </FormGroup>
    <FormGroup row>
      <Label  sm={6}>What is the date of birth of your Father according to his CNIC</Label>
      <Col sm={6}>
      <DatePicker
      required
          selected={this.state.text.ans2}
          onChange={this.handleAnswer}
      />
      </Col>
    </FormGroup>
    <FormGroup row>
      <Label  sm={6}>What is your district according  to CNIC</Label>
      <Col sm={6}>
     
      <select defaultValue={this.state.text.ans3} onChange={(e)=>{let text=this.state.text; text['ans3']=e.target.value; this.setState({text})}}>
        <option value="" >District</option>
        <option value="central">Central</option>
        <option value="south">South</option>
        <option value="west">West</option>
        <option value="malir">Malir</option>
        <option value="east">East</option>
        </select>
          </Col>
    </FormGroup>
    <div>  <p style={{fontWeight:'bold'}}>For better understanding you can also edit or set them later </p></div>
            <StudentOrTeacher StudentOrTeacher={this}/>
 
            <div style={{color:'red'}}>{this.state.message} </div>
            {/* <FormGroup check row > 
      <Col sm={{ size: 6  , offset: 6 }}> */}
    {this.state.loading? <div style={{textAlign:'center'}}>   <Dots color="#788EA8" animating={true} size={34} speed={1}  /></div>:
       <div style={{textAlign:'center'}}>
        <Button color="primary"  onClick={this.handleSubmit.bind(this)} >Submit</Button>
        </div>}
      {/* </Col>
    </FormGroup>*/}
      </Form> 
      <br/>
             {/* <div>   </div>       */}
      </div>
      </div>     
        )
    }
}
function mapDispatchToProps(dispatch){
  return ({
    check:()=>{
      dispatch(checkStatus());
    }
  })
}
export default connect(null,mapDispatchToProps) (Formed);