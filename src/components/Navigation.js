import React, { Component } from 'react' ;
import '../firebase';
import * as firebase from 'firebase';
import { BrowserRouter, Route, NavLink } from 'react-router-dom';
import { AppBar, Typography, Button, Toolbar, Container } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';


import Home from './home';


const useStyles = theme => ({
    root: {
        flexGrow: 1
    },
    userMail: {
        flexGrow: 1,
        padding: '0 30px',
    },
    topLink: {
        color: 'inherit',
        margin: '0 5px',
    }
});

class Navigation extends Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            mail: ''
        }
        this.signout = this.signout.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        if(this._isMounted) {
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
                    mail: user.email
                });
            }else {
                this.setState({
                    user: null
                });
            }
        });
    }

    signout = () =>{
        firebase.auth().signOut().then(function() {
            return(
                <BrowserRouter>
                    <Route path='/' Component={Home} />
                </BrowserRouter>
            )
          }).catch(function(error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            alert(`Login error: ${errorMessage}`);
            console.log(`Error code: ${errorCode}`);
          });
    }

    render() {
        const { classes } = this.props;
        return(
            <Container maxWidth='md' className={classes.root}>
                <AppBar position='static' color='primary'>
                    {/* TODO: pdaryti elementu lygiavima mazame ekrane */}
                    <Toolbar>
                        <Typography 
                            variant='subtitle2' 
                            align='left' 
                            className={classes.userMail}
                        >
                            <NavLink className={classes.topLink} to='/'>Admin</NavLink>
                        </Typography>
                        <Typography variant='subtitle2' align='right' className={classes.userMail}>
                            {this.state.mail}
                        </Typography>

                        <Button onClick={this.signout} color='inherit'>
                            Atsijungti
                        </Button>
                    </Toolbar>
                </AppBar>
            </Container>
        );
    }
}

Navigation.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(useStyles)(Navigation);