import React from 'react';
import axios from 'axios';
import {decrypt} from '../../../models/encr'
import Admin_nav from './Admin_nav';
class Information extends React.Component{
   constructor(props){
       super(props);
       this.state={
        firstName:'',
        lastName:'',
        email:'',
        area:'',
        city:'',
        dOb:'',
        institue:'',
        ans1:'',
        ans2:'',
        ans3:'',
        hobby:'',
        moto:'',
        phone_Number:'',
        teach:[],
        hobby:'',
        postCode:'',
        qualification:'',
        spec1:'',
        createdAt:'',
        country:'',
        cnic:'',
        username:'',
        emailAuth:false,
        phoneAuth:false,
        formFiled:false,
        approved:false,
        gender:'',
        school:'',
        learn:''
       }
   }
    componentDidMount(){
        var self=this
        axios({
        url:'/ddskjfsdklfsfskljfsdreuewiw',
        method:'get',
        withCredentials:true,
        
        params:{
            user:this.props.match.params.id.trim()}
    })
    .then(data=>{
        console.log(data.data.user)
        self.setState({
            firstName:data.data.user.firstName,
            lastName:data.data.user.lastName,
            // ans1:decrypt(data.data.user.ans1),
            // ans2:decrypt(data.data.user.ans2),
            // ans3:decrypt(data.data.user.ans3),
            email:data.data.user.email,
            cnic:data.data.user.cnic,
            country:data.data.user.country,
            gender:data.data.user.gender,
            postCode:data.data.user.postalCode,
            phoneNumber:data.data.user.phone_Number,
            createdAt:data.data.user.createdAt,
            approved:data.data.user.approved,
            area:data.data.user.area,
            hobby:data.data.user.hobby,
            moto:data.data.user.moto,
            fileAuth:data.data.user.fileAuth,
            emailAuth:data.data.user.emailAuth,
            formFiled:data.data.user.formFiled,
            phoneAuth:data.data.user.phoneAuth,
            approved:data.data.user.approved,

        })
        if(data.data.user.type=='teacher'){

            this.setState({
            study:data.data.user.study,
            teach:data.data.user.teach,  
            spec1:data.data.user.spec1,
            school:data.data.user.spec1,
            subject:data.data.user.subject 
            
        })
        }
        
    })
   }
   componentWillReceiveProps(nextProps){
       console.log(nextProps)
//     var self=this
//     axios({
//     url:'/ddskjfsdklfsfskljfsdreuewiw',
//     method:'get',
//     withCredentials:true,
    
//     params:{
//         user:this.props.match.params.id}
// })
// .then(data=>{
//     console.log(data.data.user)
//     self.setState({
//         firstName:data.data.user.firstName,
//         lastName:data.data.user.lastName,
//         ans1:decrypt(data.data.user.ans1),
//         ans2:decrypt(data.data.user.ans2),
//         ans3:decrypt(data.data.user.ans3),
//         email:data.data.user.email,
//         cnic:data.data.user.cnic,
//         country:data.data.user.country,
//         gender:data.data.user.gender,
//         postCode:data.data.user.postalCode,
//         phoneNumber:data.data.user.phone_Number,
//         createdAt:data.data.user.createdAt,
//         approved:data.data.user.approved,
//         area:data.data.user.area,
//         hobby:data.data.user.hobby,
//         moto:data.data.user.moto,
//         fileAuth:data.data.user.fileAuth.toString(),
//         emailAuth:data.data.user.emailAuth.toString(),
//         formFiled:data.data.user.formFiled.toString(),
//         phoneAuth:data.data.user.phoneAuth.toString(),
//         approved:data.data.user.approved.toString(),

//     })
//     if(data.data.user.type=='teacher'){

//         this.setState({
//         study:data.data.user.study,
//         teach:data.data.user.teach,  
//         spec1:data.data.user.spec1,
//         school:data.data.user.spec1,
//         subject:data.data.user.subject 
        
//     })
//     }
    
// })
}
    render(){
        return(
            <div>
                <br/>
                <Admin_nav/>
                <br/>
                <div style={{border: '1px solid #efefef', width:'90%',height:'90%'}}>
                    <div style={{fontSize:'130%'}} >First Name <span style={{fontWeight:'bold'}}>{this.state.firstName} </span></div>
                    <div style={{fontSize:'130%'}} >Last Name <span style={{fontWeight:'bold'}}> {this.state.lastName} </span></div>
                    <div style={{fontSize:'130%'}} >Area <span style={{fontWeight:'bold'}}> {this.state.phone_Number} </span></div>
                    <div style={{fontSize:'130%'}} >City <span style={{fontWeight:'bold'}}>{this.state.city} </span></div>
                    <div style={{fontSize:'130%'}} >Country <span style={{fontWeight:'bold'}}>{this.state.country} </span></div>
                    <div style={{fontSize:'130%'}} >Email <span style={{fontWeight:'bold'}}> {this.state.country} </span></div>
                    <div style={{fontSize:'130%'}} >Cnic <span style={{fontWeight:'bold'}}> {this.state.cnic} </span></div>
                    <div style={{fontSize:'130%'}} >Hoby <span style={{fontWeight:'bold'}}> </span></div>
                    <div style={{fontSize:'130%'}} >Institute <span style={{fontWeight:'bold'}}>{this.state.institue} </span></div>
                    <div style={{fontSize:'130%'}} >Moto <span style={{fontWeight:'bold'}}> {this.state.moto} </span></div>
                    <div style={{fontSize:'130%'}} >Phone Number <span style={{fontWeight:'bold'}}> {this.state.phone_Number} </span></div>
                    <div style={{fontSize:'130%'}} >Qualification <span style={{fontWeight:'bold'}}> {this.state.qualification} </span></div>
                    <div style={{fontSize:'130%'}} >Teach <span style={{fontWeight:'bold'}}>{this.state.teach} </span></div>
                    <div style={{fontSize:'130%'}} >Username <span style={{fontWeight:'bold'}}> {this.state.username} </span></div>
                    <div style={{fontSize:'130%'}} >CNIC <span style={{fontWeight:'bold'}}> {this.state.cnic} </span></div>
                    <div style={{fontSize:'130%'}} >Ans 1 <span style={{fontWeight:'bold'}}> {this.state.ans1} </span></div>
                    <div style={{fontSize:'130%'}} >Ans 2 <span style={{fontWeight:'bold'}}> {this.state.ans2} </span></div>
                    <div style={{fontSize:'130%'}} >Ans 3 <span style={{fontWeight:'bold'}}> {this.state.ans3} </span></div>
                    <div style={{fontSize:'130%'}} >Email Auth <span style={{fontWeight:'bold'}}> {this.state.emailAuth} </span></div>
                    <div style={{fontSize:'130%'}} >File Auth <span style={{fontWeight:'bold'}}> {this.state.fileAuth} </span></div>
                    <div style={{fontSize:'130%'}} >Phone Auth <span style={{fontWeight:'bold'}}> {this.state.phoneAuth} </span></div>
                    <div style={{fontSize:'130%'}} >Form filed <span style={{fontWeight:'bold'}}> {this.state.formFiled} </span></div>
                    {/* <div style={{fontSize:'130%'}} >Change Email<span style={{fontWeight:'bold'}}> </span></div>
                    <div style={{fontSize:'130%'}} >Change Phone<span style={{fontWeight:'bold'}}> </span></div> */}
                    <div style={{fontSize:'130%'}} >Subject <span style={{fontWeight:'bold'}}>{this.state.subject} </span></div>
                    <div style={{fontSize:'130%'}} >Learn <span style={{fontWeight:'bold'}}>{this.state.learn} </span></div>
                    <div style={{fontSize:'130%'}} >School <span style={{fontWeight:'bold'}}> {this.state.school} </span></div>
                    <div style={{fontSize:'130%'}} >Gender <span style={{fontWeight:'bold'}}> {this.state.gender} </span></div>
                    <div style={{fontSize:'130%'}} >Approved <span style={{fontWeight:'bold'}}>{this.state.approved}  </span></div>
                 
                    </div>
                </div>
        )
    }
}
export default Information;