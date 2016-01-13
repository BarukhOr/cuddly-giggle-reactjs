/*
* StorePicker
*/
import React from 'react';
import { History } from 'react-router';
import helper from '../helpers';
import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

class StorePicker extends React.Component{

  @autobind
  goToStore(event){
    event.preventDefault();
    //Get the data from the input
    var storeId = this.refs.storeId.value;
    this.history.pushState(null,'/store/'+storeId);
  }

  render(){
    var name = "The Central Office";
    return(
      <form className="store-selector" onSubmit={this.goToStore.bind(this)}>
      <h2>Welcome to {name}. Please Select a Store </h2>
      <input type="text" ref="storeId" defaultValue={helper.getFunName()} required />
      <input type="Submit" />
      </form>
    )
  }
}
 
reactMixin.onClass(StorePicker, History);

export default StorePicker;
