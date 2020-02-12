import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

class Product extends Component {
	constructor(props){
		super(props);
	}

    handleViewProduct(pId){
        this.props.history.push('/products/'+pId);    
    }

	render() {
		return (
			<tr id={ `row_${this.props.item.id}` }>
				<td>{this.props.item.name}</td>
				<td>{this.props.item.detail}</td>
				<td>{this.props.item.created_at}</td>
				<td>
					<div className="btn-group" role="group" aria-label="actions">
					  <button type="button" className="btn btn-primary" onClick={() => { this.handleViewProduct(this.props.item.id)}}><i className="fa fa-eye" aria-hidden="true"></i></button>
					  <button type="button" className="btn btn-secondary" onClick={() => {this.props.handleRemove(this.props.item)}}><i className="fa fa-trash" aria-hidden="true"></i></button>
					</div>
				</td>
			</tr>
		);
	}
}

export default Product;