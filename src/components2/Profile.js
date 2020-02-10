import React, { Component } from 'react';
import Axios from 'axios';
import History from '../History';
import Nav from './Nav';
import ImageCompressor from 'image-compressor.js'
import {connect} from 'react-redux';
import Dots from 'react-activity/lib/Dots'
import {checkStatus} from '../store/action/apiAction'
class Profile extends Component {
    constructor(props){
        super(props);
        this.state={
            file:"",
            imagePreviewUrl:"",
            validFileType:[".jpeg", ".jpg",".bmp",".png"],
            error:'',
            loading:false
        };
    }


 _handleImagechange(e){
    e.preventDefault();
    var fileT= document.getElementById("file").value;
    if(fileT.length>0){
        var BInvalid=false;
        for (var j = 0; j <this.state.validFileType.length; j++) {
            var sCurExtension = this.state.validFileType[j];
            if (fileT.substr(fileT.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                BInvalid = true;
                break;
            }
        }
        if (!BInvalid) {
            alert("Sorry only zip files are allowed to upload");
        
            return; 
        }


    }
    
    let reader=new FileReader();
     let file=e.target.files[0];
     console.log(file);
     const ImageCompress=new ImageCompressor();
     ImageCompress.compress(file,{
         maxHeight:300,
         maxWidth:300,
         minHeight:190,
         minWidth:270,
         quality:.5
     })
     .then((results)=>{
         reader.onload=()=>{
       
            this.setState({
                file:results,
                imagePreviewUrl:reader.result
            })
        }
            reader.readAsDataURL(file)  
        })
        }
        
    componentDidMount(){
        Axios({
            url:'/checkAuth',
            method:'get',
            withCredentials:true})
            .then((data)=>{
                if(data.data.user.fileAuth){
                    History.push('/'+data.data.user.username)
                }
                else if(!data.data.user.phoneAuth)
                History.push('/phone');
                else if(!data.data.user.form_filed)
                History.push('/form');
 
            })
        
    }
    _handleImageSubmit(e){
        console.log('error');
        e.preventDefault();
        this.setState({loading:true})
       const formData = new FormData()
        formData.append('myFile', this.state.file, this.state.file.name)
        Axios({
            url:'/profile',
            withCredentials:true,
            method:'post',
            data:formData
        }).then((data)=>{
           if(data.data.saved){
               History.push('/files');
           }
        }).catch(err=>{
            this.setState({error:err.message,loading:false})
        })
    }
    render() {
        let {imagePreviewUrl}=this.state;
        let $imagePreview=null;
        if(imagePreviewUrl){
            $imagePreview=(
                
                <a href={imagePreviewUrl} data-size="1600x1067" style={{margin:'0,auto'}}>
                    <img src={imagePreviewUrl} data-size="1600x1067" style={{width:'300px', height:'300px',margin:'0,auto',float:'none'}} className=" w-75 mx-auto mt-5 mb-2 py-3  waves-effect waves-light info-color white-text"/>
                    </a> 
                );
        }
        else{
            $imagePreview=(<a href="default_1.png" data-size="1600x1067" style={{margin:'0,auto'}}>
            <img src="/default_1.png"  data-size="1600x1067" style={{width:'300px', height:'300px',margin:'0,auto',float:'none'}} className=" w-75 mx-auto mt-5 mb-2 py-3  waves-effect waves-light info-color white-text"/>
            </a>)
        }
        return (
            <div >
            <div  >
                    <Nav loggedIn={true}/>
                                                             
                </div>
                <br/><br/><br/><br/> <br/>
                <div className="col-md-4 "  style={{ border: '1px solid #4285f4',  marginTop: 10 , borderRadius: '40px',textAlign:'center',alignSelf:'center',alignContent:'center',margin:'auto'}} >
               
                    
                    <div className=" text-center" >
                    <br/>
                        {/* <!-- Material input --> */}
                        <div style={{ borderRadius: '20px' }} className=" w-70 mx-auto mt-1 mb-2 py-3  waves-effect waves-light info-color white-text">
                            <h5 className="title font-weight-bold">
                                Upload Profile picture
                            </h5>
                        </div>
                        <div className="mt-2 text-center" style={{margin:'0,auto'}}>
                     
                            {$imagePreview}
                           
                        </div>
                      <form >  
                        <input style={{ borderRadius: '10px',maxWidth:'324px' }} type="file" accept="image/* "  id="file" className="btn-lg  btn btn-outline-info waves-effect font-weight-bold"  onChange={(e)=>this._handleImagechange(e)}/>
                        <br /> <br />

                        {this.state.loading? 
                        <div style={{textAlign:'center'}}>   <Dots color="#007bff" animating={true} size={34} speed={1}  /></div>
            :           <button style={{ borderRadius: '10px' }} onClick={this._handleImageSubmit.bind(this)} type="button" className="btn btn-lg py-2 px-5 btn-info btn-rounded waves-effect font-weight-bold">Upload</button>
        }
                
                                              </form>
                    <br/>
                                    {this.state.error}
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
export default connect (null,mapDispatchToProps) (Profile);