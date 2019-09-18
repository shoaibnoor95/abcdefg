import React from 'react';
import {Link} from 'react-router-dom';
export default class Footer extends React.Component{
render(){


return(
    <footer>
			<div className="footy-sec mn no-margin">
				<div className="container">
					<ul>
						<li><Link to="#" title="">Help Center</Link></li>
						<li><Link to="#" title="">Privacy Policy</Link></li>
						<li><Link to="#" title="">Cookies Policy</Link></li>
						<li><Link to="#" title="">Copyright Policy</Link></li>
					</ul>
					<p><img src="images/copy-icon2.png" alt=""/>Copyright 2019</p>
					<img className="fl-rgt" src="/tutors.png" style={{width:'40px',height:'20px'}}  alt="tutors-logo"/>
				</div>
			</div>
		</footer>
            )
        }
}