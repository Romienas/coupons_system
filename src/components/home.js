import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import '../firebase';
import * as firebase from 'firebase';

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200
    },
    dense: {
        marginTop: 19
    },
    button: {
        margin: theme.spacing(1)
    },
    input: {
        display: 'none'
    }
}));

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
        this.emailInput = this.emailInput.bind(this);
        this.passwordInput = this.passwordInput.bind(this);
        this.enterPress = this.enterPress.bind(this);
    }

    emailInput = (event) => {
        this.setState({
            email: event.target.value
            });
    }

    passwordInput = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    enterPress = (event) => {
        if(event.key === 'Enter'){
            this.signIn();
        }
    }

    signIn = () => {
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
            let errorCode = error.code;
            let errorMessage = error.message;
            alert(`Login error: ${errorMessage}`);
            console.log(`Error code: ${errorCode}`);
          });
    }

    render() {
       const { classes } = this.props;

        return (
            <div className='login'>
                <form 
                    className={classes.container} 
                    noValidate 
                    autoComplete='off'
                >
                    <TextField 
                        id='email'
                        label='El. paštas'
                        className={classes.textField}
                        type='text'
                        margin='normal'
                        onChange={this.emailInput}
                        onKeyDown={this.enterPress}
                    />
                    <TextField 
                        id='password'
                        label='Slaptažodis'
                        className={classes.textField}
                        type='password'
                        margin='normal'
                        onChange={this.passwordInput}
                        onKeyDown={this.enterPress}
                    />
                    <Button
                        color='primary'
                        className={classes.button}
                        onClick={this.signIn}
                    >
                        Prisijungti
                    </Button>
                </form>
            </div>
        );
    }
};

Home.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(useStyles)(Home);