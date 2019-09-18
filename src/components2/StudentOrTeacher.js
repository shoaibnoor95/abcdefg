import React, { Component } from 'react';
import { Col,  FormGroup, Label, Input} from 'reactstrap';
import Chips,{Chip} from 'react-chips' 
class  StudentOrTeacher extends Component{
  handleInput(property,event){
      
     let text3=this.props.StudentOrTeacher.state.text;
    let that=this.props.StudentOrTeacher;
    
    var letters = /^[a-zA-Z\s]*$/;
    
    if(property=='percentage' || property=='class'|| property=='school'|| property=='subject'|| 
    property=='learn'|| property=='moto' || property=='hobby'  || property=='study' || property=='spec1' )
    {
       if(event.target.value.match(letters)||event.target.value==""){
        
            text3[property]=event.target.value;
            that.setState({
                text:text3
            }) 

       }
   }
 }
 _onChange=text=>{
  let that=this.props.StudentOrTeacher;
 
  if(text[that.state.counter]!=undefined && text.length<6)  
   { 
     if(text[that.state.counter].search(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/)==-1 && text.length<=5)
     {
       console.log(text.length)
       let count=that.state.counter;
       count++;
       that.setState({
         Chips:text,
         counter:count
        }) 
     }
   }
     else{
        if(that.state.counter==0 && text.length<6){

          that.setState({
            Chips:text
           })
         }
         else{
          if(text.length<6 )
           that.setState({
             Chips:text,
             counter:that.state.counter-1
           })
         } 
       }   
 }
    
   render(){
     
        const that=this.props.StudentOrTeacher;
      if(that.state.text.type.value && that.state.text.type.value!=''){

        if(that.state.text.type.value=="student"){
          return(
            <div>
        <FormGroup row>
      <Label  sm={6}>Last Grade Or percentage</Label>
      <Col sm={6}>
        <Input type="text" value={that.state.text.percentage} onChange={this.handleInput.bind(this,"percentage")} placeholder="Percentage" />
      </Col>
    </FormGroup>
    <FormGroup row>
      <Label  sm={6}>For whom you are creating this account</Label>
      <Col sm={6}>
            <select defaultValue={that.state.text.class} value={that.state.text.class} onChange={(e)=>{let text=that.state.text; text['class']=e.target.value; that.setState({text})}}>
            <option value="" >Select</option>
              <option value="Myself" >My Self</option>
              <option value="Relative" >My Relative</option>
              <option value="Organization" >Organization</option>
              </select>
      </Col>
</FormGroup>        

    <FormGroup row>
      <Label  sm={6}>What is your favorite subject</Label>
      <Col sm={6}>
        <Input type="text" onChange={this.handleInput.bind(this,"subject")} value={that.state.text.subject} placeholder="Favorite subject" />
      </Col>
    </FormGroup>   
    
    <FormGroup row>
      <Label  sm={6}>What are your hobbies?</Label>
      <Col sm={6}>
        <Input type="text" value={that.state.text.hobby} onChange={this.handleInput.bind(this,"hobby")}  placeholder="Hobbies" />
      </Col>
    </FormGroup>
    <FormGroup row>
      <Label  sm={6}>What is  your motto in life?</Label>
      <Col sm={6}>
        <Input type="text" value={that.state.text.moto} onChange={this.handleInput.bind(this,"moto")} placeholder="Moto" />
      </Col>
    </FormGroup>
    
    </div>
    )
  }
  else if(that.state.text.type.value=="teacher"){
    
    return(
      <div>
               <FormGroup row>
      <Label  sm={6}>Specialization</Label>
      <Col sm={6}>
        <Input type="text" value={that.state.text.spec1} onChange={this.handleInput.bind(this,"spec1")} placeholder="Specialization" />
      </Col>
    </FormGroup>

    <FormGroup row>
      <Label  sm={6}>Are you still studying</Label>
      <Col sm={6}>
      <select defaultValue={that.state.text.study} value={that.state.text.study} onChange={(e)=>{let text=that.state.text; text['study']=e.target.value; that.setState({text})}}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
        </select>
      </Col>
</FormGroup>

<FormGroup row>
      <Label  sm={6}>From which school/college did you read </Label>
      <Col sm={6}>
        <Input type="text" value={that.state.text.school} onChange={this.handleInput.bind(this,"school")} placeholder="Your school" />
      </Col>
    </FormGroup>        
     <FormGroup row>
      <Label  sm={6}>What is your favorite subject</Label>
      <Col sm={6}>
        <Input type="text" value={that.state.text.subject} onChange={this.handleInput.bind(this,"subject")} placeholder="Favorite subject" />
      </Col>
    </FormGroup>   
    <FormGroup row>
      <Label  sm={6}>What would you like to teach (Any 5 Catogories)?</Label>
      <Col sm={6}>
        <Chips 
        value={that.state.Chips}
        onChange={this._onChange}
        placeholder='Kindly select any 5'
        suggestions={that.state.suggesstions}/>
       </Col>
    </FormGroup>
    <FormGroup row>
      <Label  sm={6}>What are your hobbies?</Label>
      <Col sm={6}>
        <Input type="text" value={that.state.text.hobby} onChange={this.handleInput.bind(this,"hobby")}  placeholder="Hobbies" />
      </Col>
    </FormGroup>
    <FormGroup row>
      <Label  sm={6}>What is the moto of your life?</Label>
      <Col sm={6}>
        <Input type="text" value={that.state.text.moto} onChange={this.handleInput.bind(this,"moto")}  placeholder="Moto" />
      </Col>
    </FormGroup>
        </div>
    )
  }
  } else{
    return(
      <div/>
    )
  }
  }
}
export default StudentOrTeacher;