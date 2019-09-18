import React from "react";
import { Input, Button } from 'reactstrap'
import Axios from 'axios';
import History from '../../History';
import {encrypt} from '../../../models/encr'
class AdminPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            abc:false,
            message:'',
            password:'',
        }
    }
        onAdminProceed(event){
            event.preventDefault();
            Axios({
                url:'/shoaibmnooradminportals',
                method:'post',
                data:{
                    username:encrypt(this.state.username)
                }
            })
            .then(data=>{
                console.log(data.data)
                if(data.data.done=='abc'){
                    this.setState({
                        abc:true,
                        message:'',
                    })

                }
                else{
                    this.setState({
                        message:'Incorrect try to remember username or password'
                    })
                }
            })
            .catch(err=>{
                console.log(err)
            })
        }

    onChangeHandle(event) {
        this.setState({
            username: event.target.value
        })
    }    
    onChangeHandle2(event) {
        this.setState({
            password: event.target.value
        })
    }    
   
    onLoginProceed(event){
   event.preventDefault();
    
   Axios({
       withCredentials:true,
       url:'/239802839sdkjlsdajlkdsajlksdajklsadkjlasdkjlasjklasd',
       method:'post',
       data:{
           username:encrypt(this.state.username),
           password:this.state.password
       }
   })
   .then(data=>{
    console.log(data.data) 
    if(data.data.userinc){
        History.push('/khjadsshjasdasdasdjasdeewwqehjtrjkhrjkwiuewruiowe/logie')
       }
       else{
           this.setState({message:'User not found'})
       }
   })

    }
    render() {
        return (
            <div style={{ background: "#fff", border: '2px solid #4285f4', maxWidth: '600px', borderRadius: '5px', margin: '200px auto 50px', textAlign: 'çenter', padding: "20px" }}>
                {this.state.abc?
                
            
            <div>
            Password
                <input  type="text" value={this.state.password} onChange={this.onChangeHandle2.bind(this)} style={{ display: 'block', margin: '0 auto 10px', padding:'4px 10px', maxWidth: '400px', fontSize: '15px', color: "#333", fontFamily: 'sans-serif' }}  />
                <div style={{color:'green'}}>{this.state.message}</div>
                <Button style={{ display: 'block', margin: '0 auto' }} onClick={this.onLoginProceed.bind(this)} color="primary">Login</Button>
                </div>
                :<div>
                username
            <input  type="text" value={this.state.username} onChange={this.onChangeHandle.bind(this)} style={{ display: 'block', margin: '0 auto 10px', padding:'4px 10px', maxWidth: '400px', fontSize: '15px', color: "#333", fontFamily: 'sans-serif' }}  />
            <div style={{color:'green'}}>{this.state.message}</div>
            <Button style={{ display: 'block', margin: '0 auto' }} onClick={this.onAdminProceed.bind(this)} color="primary">Go</Button>
            </div>
                     }

            </div>
        )
    }
}
export default AdminPanel;