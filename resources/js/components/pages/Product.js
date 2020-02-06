import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

class Product extends Component {
	constructor(props){
		super(props);
	}

	render() {
		return (
			<tr id={ `row_${this.props.item.id}` }>
				<td>{this.props.item.name}</td>
				<td>{this.props.item.detail}</td>
				<td>{this.props.item.created_at}</td>
				<td><button className="btn btn-primary" onClick={() => {this.props.handleRemove(this.props.item)}}><i className="fa fa-trash" aria-hidden="true"></i></button></td>
			</tr>
		);
	}
}

export default Product;