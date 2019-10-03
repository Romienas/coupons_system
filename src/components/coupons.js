import React, {Component} from 'react';
import { 
    Container, 
    Paper, 
    Table, 
    TableRow, 
    TableCell, 
    TableBody,
    LinearProgress,
    Checkbox
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = theme => ({
    root: {
        padding: theme.spacing(3, 2),
        margin: '10px 0'
    },
    deleteIcon: {
        cursor: 'pointer',
    },
    progress: {
        flexGrow: 1
    }
});

class Coupons extends Component {

    constructor(props) {
        super(props);
        this.state = {
            couponArray: [],
            loaded: false
        }
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

    render() {
        const { classes } = this.props;
        let listItem = this.state.couponArray.map((number) => 
            <TableRow key={number.code}>
                <TableCell>
                    <Checkbox />
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
                    {/* TODO */}
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
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>
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