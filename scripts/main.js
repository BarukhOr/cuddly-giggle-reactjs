var React = require ('react');
var ReactDom = require('react-dom');
var ReactRouter = require('react-router');
var CSSTransitionGroup = require('react-addons-css-transition-group');



var helper = require('./helpers');
var createBrowserHistory= require('history/lib/createBrowserHistory');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
// var Navigation = ReactRouter.Navigation; //mixin
var History = ReactRouter.History;

//Firebase
var Rebase = require('re-base');
var base = Rebase.createClass('https://crackling-inferno-9855.firebaseio.com/');

var Catalyst = require('react-catalyst');

/*
  Import Components
*/
// import App from './components/App';
import NotFound from './components/NotFound';
import StorePicker from './components/StorePicker';
import AddFishForm from './components/AddFishForm';
import Fish from './components/Fish';
import Header from './components/Header';
import Order from './components/Order';
import Inventory from './components/Inventory';
// import Routes from './components/Routes';

var App = React.createClass({
  mixins : [Catalyst.LinkedStateMixin],
  getInitialState : function(){
    return {
      fishes : {},
      order : {}
    }
  },
  componentDidMount : function(){
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
  },
  componentWillUpdate : function (nextProps, nextState){
    {/*localStorage.setItem('key',data)*/}
    localStorage.setItem('order-'+this.props.params.storeId, JSON.stringify(nextState.order));

  },
  addToOrder : function(key){
    //update the state object
    this.state.order[key] = this.state.order[key] + 1 || 1;
    //set the state
    this.setState({order : this.state.order});
  },
  addFish : function(fish){
    var timestamp = (new Date()).getTime();
    //update the state object
    this.state.fishes['fish-'+timestamp]=fish;
    //set the state
    this.setState({fishes : this.state.fishes});
  },
  removeFish : function(key){
    if(confirm("Are you sure that you want to remove this fish?")){
      this.state.fishes[key] = null;
      this.setState({
        fishes : this.state.fishes
      });
    }
  },
  removeFromOrder : function(key){
    delete this.state.order[key];
    this.setState({
      order : this.state.order
    })
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
        <Order removeFromOrder={this.removeFromOrder} fishes={this.state.fishes} order={this.state.order}/>
        <Inventory removeFish = {this.removeFish} linkState={this.linkState} fishes={this.state.fishes} addFish={this.addFish} loadSamples={this.loadSamples}/>
      </div>
    )
  }
});



var routes = (
  <Router history={createBrowserHistory()}>
    <Route path="/" component={StorePicker}/>
    <Route path="/store/:storeId" component={App}/>
    <Route path="*" component={NotFound}/>
  </Router>
)









ReactDom.render(routes,document.querySelector('#main'));
