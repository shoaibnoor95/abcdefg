import {Modal,ModalBody,ModalFooter} from 'reactstrap'
import React from 'react';
import ImageCompressor from 'image-compressor.js'
import {Link} from 'react-router-dom'
import Axios from 'axios'
class Modalview extends React.Component{
	constructor(props){
		super(props);
		this.state={
            cover:'',
            file:"",
            imagePreviewUrl:"",
            validFileType:[".jpeg", ".jpg",".bmp",".png"],
            error:'',
            message:'',
            maxHeight:170,
            maxWidth:170,
            minHeight:170,
            minWidth:150,
            quality:0.7,
			pictureModal:false,
			size:''
		};
	}
	componentWillReceiveProps(nextProps){
		console.log(nextProps)
		if(nextProps.size=='lg'){
			this.setState({
				maxHeight:350,
				maxWidth:1100,
				minHeight:250,
				minWidth:600,
				size:'lg'
				     
			})
		}
		else{
			this.setState({
				size:'sm'
			})
		}
		this.setState({
			pictureModal:nextProps.open,
			pic:nextProps.img,
			

		})   
		   
		}
		onFileUpload(e){
			e.preventDefault();
	
			document.getElementById('fileU').click();
		  }
	 _handleImagechange(e){
		e.preventDefault();
		var fileT= document.getElementById("fileU").value;
		console.log(fileT)
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
				alert("Sorry only image files are allowed to upload");
				return; 
			}
		}
	
		let reader=new FileReader();
		 let file=e.target.files[0];
		 console.log(file);
		 const ImageCompress=new ImageCompressor();
		 ImageCompress.compress(file,{
			 maxHeight:this.state.maxHeight,
			 maxWidth:this.state.maxWidth,
			 minHeight:this.state.minHeight,
			 minWidth:this.state.minWidth,
			 quality:this.state.quality
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
				
		_handleImageSubmit(e){
			e.preventDefault();
			if(this.state.file!==""){
				
			
			let url='/profile';
			if(this.state.size!="sm"){
			url="/cover"
			}
		   const formData = new FormData()
			formData.append('myFile', this.state.file, this.state.file.name)
			Axios({
				url:url,
				withCredentials:true,
				method:'post',
				data:formData
			}).then((data)=>{
			   if(data.data.saved){
				this.setState({message:'Image Uploaded successfully'});
				window.location.reload();
			}
			}).catch(err=>{
				this.setState({error:'Could not proceed with the request'})
			})
			}
			else{
				this.setState({message:'Image already uploaded'})
			}
		}
    render(){
		let {imagePreviewUrl}=this.state;
        let $imagePreview=null;
        if(imagePreviewUrl){
            $imagePreview=(
                
                <Link to={imagePreviewUrl} data-size="1600x1067">
                    <img src={imagePreviewUrl}  data-size="1600x1067" style={{width:'100%', height:'250px'}} />
                    </Link> 
                );
        }
        else{
            $imagePreview=(<Link to="#" data-size="1600x1067">
            <img src={`data:image/jpeg;base64,${this.props.img}`}  data-size="1600x1067" style={{width:'100%', height:'250px'}} />
            </Link>)
        }

        return(
            <div>
				{this.state.pictureModal?
				<input type="file" accept="image/*" id="fileU" style={{width:"0px",height:'0px'}} name='profile' style={{visibility:'hidden'}} onChange={this._handleImagechange.bind(this)}/>
		:	<div/>
}
		<Modal isOpen={this.state.pictureModal} size={this.state.size}  style={{textAlign:'center',alignItems:'center',alignContent:'center',width:'82%',paddingLeft:'1.3%'}}>
		<h5 style={{marginTop:'7px'}}> Change picture </h5>
		<hr/>
		<ModalBody>
		{$imagePreview}
			</ModalBody><hr/>
		<button style={{width:'42%',margin:'2px auto',marginBottom:'0px'}} onClick={this.onFileUpload.bind(this)} className="btn btn-outline-primary btn-sm"  title="" ><i className="fa fa-upload"></i> Upload picture </button><br/>
		<div style={{color:'green'}}>{this.state.message}</div>
		<ModalFooter>
		<button className="btn btn-primary" onClick={this._handleImageSubmit.bind(this)} > {' '}<i className="fa fa-save">Save</i> </button>

		<button className="btn btn-secondary"  onClick={this.props.changeModal.bind(this)}>{' '}<i className="fa fa-cut">Cancel</i> </button>
		</ModalFooter>
			</Modal>
		
		   </div>
        )
    }
}
export default Modalview;