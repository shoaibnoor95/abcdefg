import React from 'react';
import {Link} from 'react-router-dom';
import History from '../History'
class Notfound extends React.Component{

    render(){
        return(
            <div id="notfound">
		<div className="notfound">
			<div className="notfound-bg">
				<div></div>
				<div></div>
				<div></div>
			</div>
			<h1>oops!</h1>
			<h2>Error 404 : Page Not Found</h2>
			<Link to="#" onClick={()=>{History.goBack()}}>go back</Link>
			<div className="notfound-social">
				<Link to="#"><i className="fa fa-facebook"></i></Link>
				<Link to="#"><i className="fa fa-twitter"></i></Link>
				
			</div>
		</div>
	</div>
        )
    }
}
export default Notfound;