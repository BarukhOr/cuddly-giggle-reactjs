/*
  Add Fish
  <Fish />
*/
import React from 'react';
import helper from '../helpers';
import autobind from 'autobind-decorator';

class Fish extends React.Component{
  @autobind
  onButtonClick(){
    var key = this.props.index;
    this.props.addToOrder(key);
  }

  render(){
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
}
export default Fish;