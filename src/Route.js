import React, { Component } from 'react';
import { Route, Router,Switch } from 'react-router-dom';
import history from './History';
import Form from './components2/Form';
import phone from './components2/phone';
import Settings from './components2/Settings';
import profile from './components2/Profile'; 
import ResetPassword from './components2/Password_reset';
import EmailConfirm  from './components2/Emailconfirm';
import Email_confirm from './components2/Email_confirm';
import Adminpanel from "./components2/admin/admin_panel";
import ApprovalRequest from "./components2/admin/approval_request";
import SearchAdmin from  './components2/admin/SearchAdmin';
import Information from './components2/admin/Information';
import AdminSignIn from './components2/admin/AdminSignIn';
// import Help from './components/help';
import Sign from './components2/signin';
import Home from './components2/dashboard';
import Search from './components2/search';
// import Signup from './components2/signup'
import Files from './components2/Files';
// import Video from './components2/video/containers/RoomPage'
import Messages from './components2/messages';
import Single from './components2/postSingle';
class Routers extends Component {
    render() {
        return (
            <Router history={history}>
                    <Switch>
                    <Route exact path="/"               component={Sign}/>
                    <Route exact path="/search"         component={Search} /> 
                    <Route exact path="/form"           component={Form} />
                    <Route exact path="/photo"          component={profile}/>
                    <Route exact path="/files"          component={Files}/>
                    <Route exact path="/phone"          component={phone} />
                    <Route exact path="/passwordReset"  component={ResetPassword}/>
                    <Route exact path="/settings"       component={Settings} />
                    <Route exact path="/messanger"      component={Messages} />
                    <Route exact path="/midtownmaddnessn4sgta" component={AdminSignIn}/>
                    <Route exact path='/khjadsshjasdaslassldasdjasdeellkwwqehjtrjkhrjkwiuewruiowes' component={SearchAdmin}/>
                    <Route exact path="/:id"            component={Home} />
                    {/* <Route exact path="/video/:id"      component={Video}/>  */}
                    <Route exact path='/khjadsshjasdasdasdjasdeewwqehjtrjkhrjkwiuewruiowe/logie' component={Adminpanel}/>
                    <Route exact path='/239802839sdkjlsdajlkdsajlksdajklsadkjlasdkjlasjklasd/logo' component={ApprovalRequest}/>
                    <Route exact path="/email_confirmation/asdjashdjkashasdioiqwuewoqunxhasdhsajdkasdhjksadjkhasdhjashdkjasdioiqwuewoqunxhashasjdhhsadjkshasjhasdioiqwuewoqunxh/:code" component={Email_confirm}/>
                    <Route exact path="/posts/:id"   component={Single}/>
                    <Route exact path='/information/:id' component={Information}/>
                    <Route exact path="/password_Reset/274sakldajdaskjaskld23280923089213893kdasjklasjddljkdslskdsladkjasklasdjdssjdkls2398023sknasddasjasdgdas/:id" component={EmailConfirm}/>
                   
                    </Switch>
                
            </Router>
        )
    }
}


export default Routers;