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
            couponCode: [],
            selectedValue: 5,
            user: '',
            mail: '',
            couponsNumber: 1
        }

        this.generator = this.generator.bind(this);
        this.changeSelection = this.changeSelection.bind(this);
        this.getUser = this.getUser.bind(this);
        this.couponsNumber = this.couponsNumber.bind(this);
    }

    componentDidMount() {
        this.generator();
        this.getUser();
    }

    // Ganerate new code
    generator = () => {
        let codeLenght = 8;
        let symbol = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let codeArr = [];

        for(let j = 0; j < this.state.couponsNumber; j++){
            let code = '';
            for(let i = 0; i < codeLenght; i++){
                code += symbol.charAt(Math.floor(Math.random() * symbol.length));
            }
            
            codeArr.push(code);
        }
        this.setState({
            couponCode: codeArr
        }, () => console.log('setState', this.state.couponCode));

        console.log('generator', codeArr)
    }

    // Get user
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

    // Selects discount
    changeSelection = (event) => {
        this.setState({
            selectedValue: event.target.value
        })
    }


    // How much coupons have to be generated
    couponsNumber = (event) => {
        let eventValue = parseInt(event.target.value);

        if (isNaN(eventValue)){
            alert('Įveskite skaičių!')
        } else {
            this.setState({
                couponsNumber: eventValue
            }, () => console.log(this.state.couponsNumber));
        }
        this.generator();
    }

    // Add coupons to database
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

        for( let i = 0; i < this.state.couponCode.length; i++){
            db.collection('/coupons').doc(this.state.couponCode[i]).set({
                discount: this.state.selectedValue,
                code: this.state.couponCode[i],
                user: this.state.mail,
                date: fullDate,
                dateStamp: firebase.firestore.Timestamp.fromDate(new Date()),
                printedCoupon: false,
                used: false
            }).then(() => {
            });
        };
        window.alert('Kuponai sukurti');
        console.log('issaugoti', this.state.couponCode)
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
                            <TextField
                                id="couponsNumber"
                                label="Kuponų skaičius"
                                onChange={this.couponsNumber}
                                type="number"
                                value={this.state.couponsNumber}
                                className={classes.textField}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="normal"
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