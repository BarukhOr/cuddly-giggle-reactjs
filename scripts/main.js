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
  addToOrder : function(key){
    // console.log("Key value = "+key);
    //update the state object
    this.state.order[key] = this.state.order[key] + 1 || 1;
    // console.log("Order State: "+this.state.order[key]);

    //set the state
    // console.log(this.state.order);
    // console.log(this.state.fishes);
    this.setState({order : this.state.order});
  },
  addFish : function(fish){
    var timestamp = (new Date()).getTime();
    //update the state object
    this.state.fishes['fish-'+timestamp]=fish;
    //set the state
    this.setState({fishes : this.state.fishes});
  },
  loadSamples : function(){
    this.setState({
      fishes : require('./sample-fishes')
    });
  },
  renderFish :function(key){
    return <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>
  },
  render:function(){
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
        <Order fishes={this.state.fishes} order={this.state.order}/>
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples}/>
      </div>
    )
  }
});

/*
  Add Fish
  <Fish />
*/
var Fish = React.createClass(({
  onButtonClick : function(){
    {/*console.log("Going to use "+this.props.index+ " at some point");*/}
    var key = this.props.index;
    this.props.addToOrder(key);
  },
  render : function(){
    var details = this.props.details;
    var isAvailable = (details.status === 'available' ? true : false);
    var ButtonText = (isAvailable ? ' Add To Order' : 'Sold Out!');

    return (
      <div>
        {/*<li>Index: {this.props.index}</li>*/}
        <li className="menu-fish">
          {/*<img src={this.props.details.image} />*/}
          <img src={details.image} alt={details.name}/>
          <h3 className="fish-name">
            {details.name}
            {/*<span className="price">{details.price}</span>*/}
            <span className="price">{helper.formatPrice(details.price)}</span>
          </h3>
          <p>{details.desc}</p>
          <button disabled={!isAvailable} onClick={this.onButtonClick}>{ButtonText}</button>
        </li>
      </div>
    )
  }
}))

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
        <h3 className="tagline"><span>{this.props.tagline}</span></h3>
      </header>
    )
  }
});

/*
  Order
*/
var Order = React.createClass({
  renderOrder :function(key){
    var fish = this.props.fishes[key];
    var count = this.props.order[key];

    if(!fish){
      return <li key={key}>Sorry, fish is no longer available!</li>
    }

    return(
      <li>
        {count} lbs
        {fish.name}
        <span className="price">{helper.formatPrice(count*fish.price)}</span>
      </li>
    )
  },
  render:function(){
    var orderIds = Object.keys(this.props.order);
    console.log("These are the keys in the order array: "+orderIds);

    var total = orderIds.reduce((prevTotal, key)=>{
      // console.log(this.props.fishes);
      // console.log(this.props.fishes[fish1]);
      var fish = this.props.fishes[key];
      var count = this.props.order[key];
      var isAvailable = fish && fish.status === 'available';

      if(fish && isAvailable){
        return prevTotal + (count * parseInt(fish.price) || 0);
      }
      console.log("previous total shenanigans: " + prevTotal);
      return prevTotal;
    }, 0);
    return(
      <div>
        <h2 className="order-title">Your Order</h2>
        <ul className="order">
          {/*{orderIds.map(this.renderOrder)}*/}
          {orderIds.map(this.renderOrder)}
          <li className="total">
            <strong>Total:</strong>
            {helper.formatPrice(total)}
          </li>
        </ul>
      </div>
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
        <h5>Dear Please Dare the Deer to click the button</h5>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
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
