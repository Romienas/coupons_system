import React, {Component} from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

// Create Document Component
export class PdfGenerator extends Component {
  render(){
    let array = this.props.data;
    return(
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>{array[0]}</Text>
          </View>
          <View style={styles.section}>
            <Text>Section #2</Text>
          </View>
        </Page>
      </Document>
    );
  }
}