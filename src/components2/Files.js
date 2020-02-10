import React from 'react';
import Nav from './Nav';
import History from '../History';
import {connect} from 'react-redux';
import {Input} from '../../node_modules/@material-ui/core';
import {Button} from 'react-bootstrap';
import { FormGroup, Label,Col} from 'reactstrap';
import axios from 'axios';
import Dots from 'react-activity/lib/Dots'
import { checkStatus } from '../store/action/apiAction';
class Files extends React.Component{
    constructor(props){
        super(props);
        this.state={
            file:'',
            message:'',
            validFileType:[".zip",".rar"],
            route:'',
            loading:false
          
        }
    }
    componentDidMount(){
   this.props.check();
        axios({url:'/getUsernme',
        withCredentials:true,
        method:'get'})
        .then(data=>{
            this.setState({route:data.data.data.username})

    })
    .catch(error=>{
        this.setState({message:'Could not proceed with your request'})
    })
    }
    onFileUpload(e){
        e.preventDefault();
        if(this.state.file==""){
           this.setState({
               message:'Above mention files are neccesary to attach'
           })
            e.stopPropagation();
            return; 
  
        }
        this.setState({loading:true})
       const formData = new FormData()
        formData.append('myFile', this.state.file, this.state.file.name)
        axios({
            url:'/filing',
            withCredentials:true,
            method:'post',
            data:formData
        }).then((data)=>{
           if(data.data.fileSaved){ 
               History.push('/'+this.state.route);
           }
        }).catch(err=>{
            this.setState({message:'Could not proceed with your request',loading:false})
        })
    }
    onFileChange(e){
        e.preventDefault();
        var fileT= document.getElementById("file-upload").value;
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
                  e.stopPropagation();
                  return; 
              }
          }
        let file=e.target.files[0];
        this.setState({
          file:file
        })
      
      }
    
    render(){
        return(
            <div> 
            <Nav  loggedIn={true} />
            <br/><br/><br/><br/>
            <div style = {{border : '2px solid #788EA8'  , borderRadius : '5px' ,  margin : '20px' , marginLeft : '12px' } }> 
            <p style={{paddingLeft:'1.5%'}}>Kindly Attach these files with your application combined in a zip/winrar <b style={{fontWeight:'bold'}}>(max size 15 MB)</b> </p>
             <ul>
               <li>1 Copy of your CNIC / Form B. </li>
               <li>1 Copy of your Father CNIC</li>
               <li>1 Copy of utility bill </li>
               <li>(If you are applying for teachers account) 1 Copy of transcript (Screenshot of your transcript could be attach from webportal university name and your registeration number should be mentioned in it )</li>
               </ul>
               <div style={{fontSize:"110%",color:'red',paddingLeft:'2%',paddingRight:'2%'}}><b>Note: </b>Your files will be deleted from our server with in 40 days its just for verification as you submit your document to any tuition/tutor provider we will responsible for any misuse of your files</div> 
            <div style={{textAlign:'center'}} >
            <img  src="/samples.png" style={{maxWidth:"350px",width:'auto',height:"350px",float:'none'}}/>
            </div>
            <div style={{color:'red',textAlign:'center'}}>{this.state.message} </div>
         <div>
            <div style={{color:'red',fontWeight:'bold',textAlign:'center'}}>Make a cross over every document and write "For Tutorns verification"</div>
         <FormGroup row>
      <Label style={{paddingLeft:'5.5%'}}  sm={6}><b>Upload your files</b></Label>
      <Col sm={6}>
        <Input type="file" id="file-upload" accept="zip/*"  required  onChange={(e)=>this.onFileChange(e)}   />
      </Col>
    </FormGroup>
            <FormGroup check row > 
      <Col sm={{ size: 5    , offset: 5 }}>
      <form>
      {this.state.loading? <div style={{textAlign:'center'}}>   <Dots color="#788EA8" animating={true} size={34} speed={1}  /></div>:
          <Button bsStyle="primary" onClick={this.onFileUpload.bind(this)} >Continue</Button>
      
            }  
    </form>
      </Col>
            </FormGroup>
            <br/>
        <div>
            <div style={{color:'red',textAlign:'center'}}>{this.state.message}</div>
            </div>
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

export default connect (null,mapDispatchToProps)(Files);