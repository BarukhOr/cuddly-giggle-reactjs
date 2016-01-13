
/*
  Inventory
*/
import React from 'react';
import AddFishForm from './AddFishForm';
import autobind from 'autobind-decorator';
import Firebase from 'firebase';
const ref = new Firebase('https://crackling-inferno-9855.firebaseio.com/');

@autobind
class Inventory extends React.Component{
  constructor(){
    super();
    this.state={
      uid:''
    }
  }

  authenticate(provider){
    console.log("Trying to auth with: "+provider);
    ref.authWithOAuthPopup(provider, this.authHandler);
  }

  componentWillMount(){
    console.log("Checking to see if we can log them in");
    var token = localStorage.getItem('token');
    if(token){
      ref.authWithCustomToken(token,this.authHandler);
    }
  }

  logout(){
    ref.unauth();
    localStorage.removeItem('token');
    this.setState({
      uid : null
    });
  }


  authHandler(err,authData){
    if(err){
      console.err(err);
      return;
    }

    //save the login token in the browser so that it can be fetched on page reload
    localStorage.setItem('token',authData.token);

    // console.log(this.props.params.storeId);
    const storeRef = ref.child(this.props.params.storeId);
    storeRef.on('value',(snapshot)=>{
      var data = snapshot.val() || {};

      if (!data.owner){
        //claim it as our own if there is not owner already
        storeRef.set({
          owner : authData.uid
        });
      }

      //update our state to reflect the current store owner and user
      this.setState({
        uid : authData.uid,
        owner : data.owner || authData.uid //set owner to the data.owner or to authData.uid if there is no prior owner
      })
    })
  }
  
  renderLogin(){
    return(
      <nav className="login">
        <h2></h2>
        <p>Sign in to manage your store's Inventory</p>
        <button className="github" onClick={this.authenticate.bind(this,'github')}>Log In with Github</button>
        <button className="facebook" onClick={this.authenticate.bind(this,'facebook')}>Log In with Facebok</button>
        <button className="twitter" onClick={this.authenticate.bind(this,'twitter')}>Log In with Twitter</button>
      </nav>
    )
  }

  renderInventory(key){
    var linkState = this.props.linkState;
    return (
      <div className="fish-edit" key={key}>
        <input type="text" valueLink={linkState('fishes.'+key+'.name')} />
        <input type="text" valueLink={linkState('fishes.'+key+'.price')} />
        <select valueLink={linkState('fishes.'+key+'.status')}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <input type="text" valueLink={linkState('fishes.'+key+'.image')} />
        <textarea valueLink={linkState('fishes.'+key+'.desc')}>
        </textarea>
        <button onClick={this.props.removeFish.bind(null,key)}>Remove Fish</button>
      </div>
    )
  }
  render(){
    let logoutButton = <button onClick={this.logout}>Log Out!</button>
    
    //first check if the user is logged in
    if(!this.state.uid){
      return(
        <div>{this.renderLogin()}</div>
      )
    }

    //check if the uesr is the owner of the current store
    if(this.state.uid !== this.state.owner){
      return(
        <div>
          <p>Sorry, you arent the owner of this store</p>
          {logoutButton}
        </div>
      )
    }



    return(
      <div>
        <h2>Inventory</h2>
        {logoutButton}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm {...this.props}/>
        <h5>Dear Please Dare the Deer to click the button</h5>
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
}


Inventory.protoTypes = {
  removeFish : React.PropTypes.func.isRequired,
  linkState : React.PropTypes.func.isRequired,
  fishes : React.PropTypes.object.isRequired,
  addFish : React.PropTypes.func.isRequired,
  loadSamples : React.PropTypes.func.isRequired
}

export default Inventory;