import React, {Component} from 'react';
import './firebase';
import * as firebase from 'firebase';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './components/home';
import Admin from './components/admin';
import Navigation from './components/Navigation';
import Coupons from './components/coupons';

export default class Main extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            user: {},
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted){
            this.checkUserStatus();
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    checkUserStatus = () => {
        firebase.auth().onAuthStateChanged((user) =>{
            if(user) {
                this.setState({
                    user,
                });
            }else {
                this.setState({
                    user: null
                });
            }
        });
    }

    render() {
        return(
            <BrowserRouter>
                {this.state.user ? <Navigation /> : null }
                {this.state.user ? 
                <div>
                    <Route path='/' component={Admin} exact />
                    <Route path='/coupons' component={Coupons} /> 
                </div> :
                <Route path='/' component={Home} />}
            </BrowserRouter>
        );
    }
};