import React, {Component} from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

Font.register({
  family: 'Roboto',
  src: '/Roboto-Regular.ttf',
  fontStyle: 'normal',
  fontWeight: 'normal',
  
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    flexWrap: 'wrap'
  },
  section: {
    fontFamily: 'Roboto',
    margin: 10,
    padding: 10,
    flexBasis: '45%'
  },
  image: {
    width: 50,
    marginHorizontal: 100,
    marginBottom: 11
  },
  header: {
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 14,
    marginBottom: 7
  },
  code: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 8
  },
  note: {
    textAlign: 'center',
    fontSize: 9
  }
});

export class PdfGenerator extends Component {

  render(){

    let array = this.props.data;

    let couponsList = array.map(coupon => 
          <View 
            style={styles.section}
            key={coupon.code}  
          >
            <Image
              style={styles.image}
              src='/media/meno_muza_logo_BW.png'
            />
            <Text style={styles.header}>
              {coupon.discountValue}% nuolaidų kuponas rėminimo paslaugoms
            </Text>
            <Text style={styles.code}>
              {coupon.code}
            </Text>
            <Text style={styles.note}>
              Nuolaidos kuponas galioja 3 mėn. nuo jo gavimo datos. Nuolaida taikoma vienam užsakymui. Nuolaidos nesumuojamos.
            </Text>
          </View>
      );

    return(
      <Document>
        <Page size="A4" style={styles.page}>
          {couponsList}
        </Page>
      </Document>
    );
  }
}