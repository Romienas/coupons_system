import React, { Component } from 'react';
import { 
    Container, 
    Paper, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem,
    TextField,
    Button,
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import Coupons from './coupons';

const useStyles = theme => ({
    root: {
        padding: theme.spacing(3, 2),
        margin: '10px 0'
    },
    formRoot: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: 'auto',
        maxWidth: 600
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 200,
        padding: '8px 0 0 0'
    },
    inputLabel: {
        padding: '9px 0 0 0'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    button: {
        margin: theme.spacing(1)
    }
});

class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            couponCode: '',
            selectedValue: 5,
            user: '',
            mail: ''
        }

        this.generator = this.generator.bind(this);
        this.changeSelection = this.changeSelection.bind(this);
        this.getUser = this.getUser.bind(this);
    }

    componentDidMount() {
        this.generator();
        this.getUser();
    }

    generator = () => {
        let codeLenght = 8;
        let code = '';
        let symbol = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for(let i = 0; i < codeLenght; i++){
           code += symbol.charAt(Math.floor(Math.random() * symbol.length));
        }
        this.setState({
            couponCode: code
        });
    }

    getUser = () => {
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
                console.log('user null');
            }
        });
    }


    changeSelection = (event) => {
        this.setState({
            selectedValue: event.target.value
        })
        this.generator();
    }

    saveCoupon = () => {
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        if(month < 10) {
            month = '0'+month;
        }
        let day = date.getDate();
        if(day < 10) {
            day = '0' + day;
        }
        const fullDate = year + '-' + month + '-' + day;

        const db = firebase.firestore();
        db.collection('/coupons').doc(this.state.couponCode).set({
            discount: this.state.selectedValue,
            code: this.state.couponCode,
            user: this.state.mail,
            date: fullDate,
            dateStamp: firebase.firestore.Timestamp.fromDate(new Date()),
            printedCoupon: false
        }).then(() => {
            window.alert('Coupon created');
        });
        this.generator();
    }

    render(){

        const { classes } = this.props;

        return(
            <div>
                <Container maxWidth='md'>
                    <Paper className={classes.root}>
                        <form className={classes.formRoot}>
                            <FormControl className={classes.formControl}>
                                <InputLabel 
                                    htmlFor='discount' 
                                    className={classes.inputLabel}>
                                    Nuolaidos dydis
                                </InputLabel>
                                <Select
                                    value={this.state.selectedValue}
                                    onChange={this.changeSelection}
                                    inputProps={{
                                        name: 'discount',
                                        id: 'discount'
                                    }}
                                >
                                    <MenuItem value={5}>5%</MenuItem>
                                    <MenuItem value={10}>10%</MenuItem>
                                    <MenuItem value={20}>20%</MenuItem>
                                    <MenuItem value={30}>30%</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                id='couponCode'
                                label='Kodas'
                                className={classes.textField}
                                value={this.state.couponCode}
                                margin='normal'
                            />
                            <Button 
                                color='primary' 
                                className={classes.button}
                                onClick={this.saveCoupon}
                            >
                                Išsaugoti
                            </Button>
                        </form>
                    </Paper>
                </Container>
                <Coupons />
            </div>
        );
    }
}

Admin.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(useStyles)(Admin);