/*
* StorePicker
*/
import React from 'react';
import { History } from 'react-router';
import helper from '../helpers';

var StorePicker = React.createClass({
  mixins:[History],
  // mixins:[Navigation],
  goToStore:function(event){
    event.preventDefault();
    //Get the data from the input
    var storeId = this.refs.storeId.value;

    //Transition from <storepicker/> to <App/>
    this.history.pushState(null,'/store/'+storeId);
    // this.transitionTo('/store/'+storeId);
  },
  render:function(){
    var name = "The Central Office";
    return(
      <form className="store-selector" onSubmit={this.goToStore}>
        <h2>Welcome to {name}. Please Select a Store </h2>
        <input type="text" ref="storeId" defaultValue={helper.getFunName()} required />
        <input type="Submit" />
      </form>
    )
  }
});

export default StorePicker;
