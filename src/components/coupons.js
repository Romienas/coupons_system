import React, {Component} from 'react';
import { 
    Container, 
    Paper, 
    Table, 
    TableRow, 
    TableCell, 
    TableBody,
    LinearProgress,
    Checkbox,
    Button
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import PrintIcon from '@material-ui/icons/Print';
import CloseIcon from '@material-ui/icons/Close';
import {PdfGenerator} from '../pdfGenerator';
import { PDFViewer } from '@react-pdf/renderer';

const useStyles = theme => ({
    root: {
        padding: theme.spacing(3, 2),
        margin: '10px 0'
    },
    deleteIcon: {
        cursor: 'pointer',
    },
    doneIconGrey: {
        cursor: 'pointer',
    },
    progress: {
        flexGrow: 1
    },
    tableRow: {
        backgroundColor: '#dcdff1'
    }
});

class Coupons extends Component {

    constructor(props) {
        super(props);
        this.state = {
            couponArray: [],
            loaded: false,
            checked: [],
            print: ''
        }
        this.doneIcon = this.doneIcon.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
    }

    componentDidUpdate(){
        const db = firebase.firestore();
        db.collection('/coupons').get().then(querySnapshot => {
            const data = querySnapshot.docs.map(doc => doc.data());
            this.setState({
                couponArray: data,
                loaded: true
            })
          });
    }

    doneIcon = (number) => {
        const db = firebase.firestore();
        if (number.printedCoupon === false){
            db.collection('/coupons').doc(number.code).update({
                printedCoupon: true
            }).catch((error) => {
                console.log('error: ' + error)
            });
        } else if(number.printedCoupon === true){
            db.collection('/coupons').doc(number.code).update({
                printedCoupon: false
            }).catch((error) => {
                console.log('error: ' + error)
            });
        }
    }

    handleCheck = (event, check) => {
        if(event.target.checked){
        this.setState({
            checked: [...this.state.checked, check]
        })} else {
            let index = this.state.checked.indexOf(check)
            this.setState({
                checked: this.state.checked.filter((_, i) => i !== index)
            })
        }
    }

    print = () => {
        if(this.state.print === ''){
            this.setState({
                print: 
                <div 
                    className='pdf-background'
                    onClick={this.print}
                >
                    <CloseIcon 
                        color='inherit'
                        className='pdf-button--close'    
                    />
                    <div className='pdfBlock'>
                        <PDFViewer 
                            width='100%'
                            height='100%'    
                        >
                            <PdfGenerator data={this.state.checked} />
                        </PDFViewer>
                    </div>
                </div>
            })
        }else{
            this.setState({
                print: ''
            })
        }
    }

    render() {
        const { classes } = this.props;
        let listItem = this.state.couponArray.map((number) => 
            <TableRow 
                key={number.code}
                className={number.printedCoupon ? classes.tableRow : null}
            >
                <TableCell>
                    <Checkbox 
                        onChange={(event) => this.handleCheck(event, number.code)}
                        color='primary'
                    />
                </TableCell>
                <TableCell>
                    {number.discount}%
                </TableCell>
                <TableCell>
                    {number.code}
                </TableCell>
                <TableCell>
                    {number.user}
                </TableCell>
                <TableCell>
                    {number.date}
                </TableCell>
                <TableCell>
                    <DoneIcon
                        className={classes.doneIcon}
                        onClick={() => this.doneIcon(number)}
                    />
                    <DeleteIcon 
                        onClick={ () => {
                            const db = firebase.firestore();
                            db.collection('/coupons').doc(number.code).delete().then(() =>{
                                window.alert('Coupon Deleted!');
                            })}
                        }
                        color='error'
                        className={classes.deleteIcon}
                     />
                </TableCell>
            </TableRow>
        )

        return(
            <Container maxWidth='md'>
                <Paper className={classes.root}>
                    {this.state.couponArray === false ? 
                        <div className={classes.progress}>
                            <LinearProgress />
                        </div> : null }
                    {this.state.print}
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <Button
                                        onClick={this.print}
                                        color='primary'
                                    >
                                        <PrintIcon />
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    Discount
                                </TableCell>
                                <TableCell>
                                    Coupon Code
                                </TableCell>
                                <TableCell>
                                    User
                                </TableCell>
                                <TableCell>
                                    Date
                                </TableCell>
                                <TableCell>
                                </TableCell>
                            </TableRow>
                            {listItem}
                        </TableBody>
                    </Table>
                </Paper>
            </Container>
        );
    }
}

Coupons.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(useStyles)(Coupons);