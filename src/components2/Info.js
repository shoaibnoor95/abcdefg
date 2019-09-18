import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Dots from 'react-activity/lib/Dots';
export default class Information extends React.Component{
   constructor(props){
       super(props);
       this.state={
          qualification:'',
          from:'',
          institute:'',
          class:'',
          accountFor:'',
          hobby:'',
          gender:'',
          subject:'',
          spec:'',
          study:'',
          teach:[],
          accountFor:'',
          moto:'',
          percentage:'',

       }
   }
   componentDidMount(){
    
    axios({
        withCredentials:true,
        method:'get',
        url:'/info',
        params:{
            id:this.props.ide,
            type:this.props.type
        },
    })
    .then(data=>{
        console.log(data.data)
        if(this.props.type=="student"){
            this.setState({
                from:data.data.user.from,
                accountFor:data.data.user.accountFor,
                subject:data.data.user.favoriteSubjet,
                hobby:data.data.user.hobby,
                moto:data.data.user.moto,
                class:data.data.user.class,
                percentage:data.data.user.percentage,
                institute:data.data.user.institute,
                subject:data.data.user.favoriteSubjet
            })
        }
        else{
            {
                this.setState({
                    from:data.data.user.from,
                    spec:data.data.user.spec1,
                    subject:data.data.user.favoriteSubjet,
                    hobby:data.data.user.hobby,
                    moto:data.data.user.moto,
                    study:data.data.user.study,
                    qualification:data.data.user.qualification,
                    institute:data.data.user.institute,
                    teach:data.data.user.teach,
                    school:data.data.user.school
                })
            }
        }
    })
   }
    render(){
        if(this.props.type=="teacher"){

       return(
            <div className="product-feed-tab active current" id="info-dd">
		
										{/* <!--user-profile-ov end--> */}
										<div className="user-profile-ov">
											<h3><Link to="#"  className="">Education</Link> <Link to="#"  className=""><i className="fa fa-pencil"></i></Link> </h3>
											<h4>{this.state.qualification}</h4>
										{(this.props.friend||this.props.profile)?	<span>From {this.state.institute}</span>:<span/>}
                                            <span>Currently studying: {this.state.study}</span>
                                            <span><b>Specialization: </b>{this.state.spec}</span>
                                            {(this.props.friend||this.props.profile)?  <span><b>Favorite Subject: </b>{this.state.subject}</span>:<span/>}
                                            {(this.props.friend||this.props.profile)?  <span><b>School: </b>{this.state.school}</span>:<span/>}
                                    	</div>
										{/* <!--user-profile-ov end--> */}
										<div className="user-profile-ov">
											<h3><Link to="#"  className="">Residence of</Link> <Link to="#"  className=""><i className="fa fa-home"></i></Link> </h3>
											<p>{this.state.from}</p>
										</div>
                                		{(this.props.profile||this.props.friend)?
                                        <div className="user-profile-ov">
											<h3><Link to="#"  className="">Mindset</Link> <Link to="#"  className=""><i className="fa fa-home"></i></Link> </h3>
										    {(this.props.friend||this.props.profile)?	<span><b>Moto:</b> {this.state.moto}</span>:<span/>}
                                            {(this.props.friend||this.props.profile)?    <span><b>Hobby:</b> {this.state.hobby}</span>:<span/>}
										
                                        </div>:<div/>}
										{/* <!--user-profile-ov end--> */}
								        <div className="user-profile-ov">
											<h3><Link to="#"  className="skills-open">Teaching Interest</Link> <Link to="#"  className=""><i className="fa fa-pencil"></i></Link> <Link to="#"><i className="fa fa-tags" ></i></Link></h3>
											    <ul>
												<li><Link to="#" >{this.state.teach[0]}</Link></li>
												<li><Link to="#" >{this.state.teach[1]}</Link></li>
												<li><Link to="#" >{this.state.teach[2]}</Link></li>
												<li><Link to="#" >{this.state.teach[3]}</Link></li>
												<li><Link to="#" >{this.state.teach[4]}</Link></li>
												</ul>
										</div>
									</div>
        )
    }
    else{
        return(
                    <div className="product-feed-tab active current" id="info-dd">
		
										{/* <!--user-profile-ov end--> */}
										<div className="user-profile-ov">
											<h3><Link to="#"  className="">Education</Link> <Link to="#"  className=""><i className="fa fa-pencil"></i></Link> </h3>
											<span><b> School/College/University attending:</b>  {this.state.institute}</span>
                                            <span><b>Favorite Subject: </b>{this.state.subject}</span>
                                            {(this.props.friend||this.props.profile)?  <span><b>Last Percentage/Grade: </b>{this.state.percentage}</span>:<span/>}
                                
                                        </div>
										{/* <!--user-profile-ov end--> */}
										<div className="user-profile-ov">
											<h3><Link to="#"  className="">Residence of</Link> <Link to="#"  className=""><i className="fa fa-home"></i></Link> </h3>
											<p>{this.state.from}</p>
                                            <span>Account created for: {this.state.class}</span>
                                          
                						</div>
                                        <div className="user-profile-ov">
											<h3><Link to="#"  className="">Mindset</Link> <Link to="#"  className=""><i className="fa fa-home"></i></Link> </h3>
											<span><b>Moto:</b> {this.state.moto}</span>
                                            <span><b>Hobby:</b> {this.state.hobby}</span>
										
                                        </div>
										{/* <!--user-profile-ov end--> */}
									</div>
        )
    }
       
    }
}
