/*
  App
*/
import React from 'react';
import Catalyst from 'react-catalyst';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import helper from '../helpers';
import autobind from 'autobind-decorator';
import reactMixin from 'react-mixin';
//Firebase
import Rebase from 're-base';
var base = Rebase.createClass('https://crackling-inferno-9855.firebaseio.com/');

@autobind
class App extends React.Component{
  
  constructor(){
    super();
    this.state={
      fishes : {},
      order : {}
    }  
  }

  componentDidMount(){
    //Promises API :O supposedly rebase uses it ... now just have to learn what the heck that means xD
    base.syncState(this.props.params.storeId+'/fishes',{
      context : this,
      state : 'fishes'
    });

    var localStorageRef = localStorage.getItem('order-'+this.props.params.storeId);
    if(localStorageRef){
      //update our component state to reflect what is in localStorage
      this.setState({
        //unstringify
        order : JSON.parse(localStorageRef)
      });
    }
  }

  componentWillUpdate(nextProps, nextState){
    {/*localStorage.setItem('key',data)*/}
    localStorage.setItem('order-'+this.props.params.storeId, JSON.stringify(nextState.order));

  }

  addToOrder(key){
    //update the state object
    this.state.order[key] = this.state.order[key] + 1 || 1;
    //set the state
    this.setState({order : this.state.order});
  }

  addFish(fish){
    var timestamp = (new Date()).getTime();
    //update the state object
    this.state.fishes['fish-'+timestamp]=fish;
    //set the state
    this.setState({fishes : this.state.fishes});
  }

  removeFish(key){
    if(confirm("Are you sure that you want to remove this fish?")){
      this.state.fishes[key] = null;
      this.setState({
        fishes : this.state.fishes
      });
    }
  }

  removeFromOrder(key){
    delete this.state.order[key];
    this.setState({
      order : this.state.order
    })
  }

  loadSamples(){
    this.setState({
      fishes : require('../sample-fishes')
    });
  }

  renderFish(key){
    return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>
  }

  render(){
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market" />
          <ul className="list-of-fishes">
            {/*Get all the fishes available in the state and create an array
              for each one using map? i dont really get this part
              Afterwards for each 'array'/object/fish run "this.renderFish"
             */}
            {Object.keys(this.state.fishes).map(this.renderFish)}
          </ul>
        </div>
        <Order removeFromOrder={this.removeFromOrder} fishes={this.state.fishes} order={this.state.order}/>
        <Inventory removeFish = {this.removeFish} linkState={this.linkState.bind(this)} fishes={this.state.fishes} addFish={this.addFish} loadSamples={this.loadSamples} {...this.props}/>
      </div>
    )
  }
}

reactMixin.onClass(App, Catalyst.LinkedStateMixin);

export default App;
