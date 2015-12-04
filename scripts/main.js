var React = require ('react');
var ReactDom = require('react-dom');
var ReactRouter = require('react-router');
var createBrowserHistory= require('history/lib/createBrowserHistory');

var helper = require('./helpers');

var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation; //mixin
var History = ReactRouter.History;



/*
  App
*/
var App = React.createClass({
  getInitialState:function(){
    return {
      fishes : {},
      order : {}
    }
  },
  addFish : function(fish){
    var timestamp = (new Date()).getTime();
    //update the state object
    this.state.fishes['fish-'+timestamp]=fish;
    //set the state
    this.setState({fishes : this.state.fishes});
  },
  render:function(){
    return (
      <div className="catch-of-the-day">
        <div>
          <Header tagline="Fresh :) Seafood Market" />
        </div>
        <Order/>
        <Inventory addFish={this.addFish}/>
      </div>
    )
  }
});

/*
  Add Fish Form
*/
var AddFishForm = React.createClass({
  createFish:function(event){
    //1. Stop the form from submitting
    event.preventDefault();
    //2. Take the data from the form and create an object
    var fish = {
      name : this.refs.name.value,
      price : this.refs.price.value,
      status :this.refs.status.value,
      desc : this.refs.desc.value,
      image :this.refs.image.value
    }
    //3. Add the fish to the App State
    console.log(fish);
    this.props.addFish(fish); //asdf
    this.refs.fishForm.reset();
  },
  render:function(){
    return(
      <form className="fish-edit" refs="fishForm" onSubmit={this.createFish}>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price"/>
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to image"/>
        <button type="submti">+ Add Item </button>
      </form>
    )
  }
})

/*
  Header
*/
var Header = React.createClass({
  render:function(){
    return(
      <header className="top">
        <h1>Catch
        <span className="ofThe">
          <span className="of">of</span>
          <span className="the">the</span>
        </span>
        Day</h1>
        <h3 className="tagline">{this.props.tagline}</h3>
      </header>
    )
  }
});

/*
  Order
*/
var Order = React.createClass({
  render:function(){
    return(
      <p>Order</p>
    )
  }
});

/*
  Inventory
*/
var Inventory = React.createClass({
  render:function(){
    return(
      <div>
        <h2>Inventory</h2>
        <AddFishForm {...this.props}/>
        {/*<AddFishForm addFish={this.addFish}/>*/}
      </div>
    )
  }
});

/*
* StorePicker
*/
var StorePicker = React.createClass({
  mixins:[History],
  goToStore:function(event){
    console.log("Oracle: This is Ora to Robin. A Form has been submitted. I Repeat a form has been submitted!");
    console.log("Batman: Confirmed. Object Type: "+this.refs.storeId+". For the record the value of said object is: "+this.refs.storeId.value);

    event.preventDefault();
    //Get the data from the input
    var storeId = this.refs.storeId.value;
    //Transition from <storepicker/> to <App/>
    this.history.pushState(null,'/store/'+storeId);
  },
  render:function(){
    var name = "The Central Office";
    return(
      <form className="store-selector" onSubmit={this.goToStore}>
        {/*Just testing Comment Functionality*/}
        <h2>Welcome to {name}. Please Select a Store </h2>
        <input type="text" ref="storeId" defaultValue={helper.getFunName()} required />
        <input type="Submit" />
      </form>
    )
  }
});

/*
  Not Found
*/
var NotFound = React.createClass({
  render:function(){
    return(
      <h1>Page Not Found</h1>
    )
  }
});

/*
  Routes
*/
var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
)

ReactDom.render(routes,document.querySelector('#main'));
