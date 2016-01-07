/*
  Order
*/
import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import helper from '../helpers';
// var CSSTransitionGroup = require('react-addons-css-transition-group');

var Order = React.createClass({
  renderOrder :function(key){
    var fish = this.props.fishes[key];
    var count = this.props.order[key];
    var removeButtn = <button onClick={this.props.removeFromOrder.bind(null,key)}>X</button>

    if(!fish){
      return <li key={key}>Sorry, fish is no longer available! {removeButtn}</li>
    }

    return(
      <li key={key}>
        <CSSTransitionGroup
          component="span"
          transitionName="count"
          transitionLeaveTimeout={250}
          transitionEnterTimeout={250}
        >
          <span key={count}>{count}</span>
        </CSSTransitionGroup>
        lbs {fish.name} {removeButtn}
        <span className="price">{helper.formatPrice(count*fish.price)}</span>
      </li>
    )
  },
  render:function(){
    var orderIds = Object.keys(this.props.order);
    var total = orderIds.reduce((prevTotal, key)=>{
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      var isAvailable = fish && fish.status === 'available';

      if(fish && isAvailable){
        return prevTotal + (count * parseInt(fish.price) || 0);
      }
      return prevTotal;
    }, 0);
    return(
      <div>
        <h2 className="order-title">Your Order</h2>
        <CSSTransitionGroup
          className="order"
          component="ul"
          transitionName="order"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {helper.formatPrice(total)}
          </li>
        </CSSTransitionGroup>
      </div>
    )
  },

  protoTypes:{
    fishes : React.PropTypes.object.isRequired,
    removeFromOrder : React.PropTypes.func.isRequired,
    order : React.PropTypes.object.isRequired
  }
});

export default Order;