import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Product from './Product';

class Products extends Component {
	constructor(props){
		super(props);
		this.props.handleRedirectNotLoggedIn(this.props.isLoggedIn, this.props.history);
		this.state = {
			products: []
		};

		this.fetchProducts = this.fetchProducts.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.broadCastingListener = this.broadCastingListener.bind(this);
		this.broadCastingListener();
	}


	componentDidMount(){
		if(this.props.isLoggedIn){
			this.fetchProducts();
		}
	}

	broadCastingListener(){
		var username = this.props.username;
		this.props.socket.on('product', function(data){
			if((username !== undefined) && (username !== data.pusher)){
				document.getElementById('row_'+data.product.id).remove();
			}
		});
	}

	fetchProducts(){
		let accesToken = Cookies.get('access_token');
		if(accesToken !== undefined){
			axios.get('/api/getProducts', {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer '+accesToken
				}
			})
			.then(response => {
				this.setState({
					products: response.data
				});
			})
			.catch(error => {
				console.log(error.response);
			});
		}
	}

	handleRemove(product){
		let accesToken = Cookies.get('access_token');
		axios.post('/api/removeProduct', {
			prod_id: product.id
		}, 
		{
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+accesToken
			}
		})
		.then(response => {		
			let key = response.data.id;
			document.getElementById('row_'+key).remove();
			this.props.socket.emit('product', {product: response.data, pusher: this.props.username});
		})
		.catch(error => {
			console.log(error.response);
		});
		
	}

	render() {
		return (
		    <div className="container">
		    	<div className="row">
		    		<div className="col-md-10"><h2>Products</h2></div>
		    		<div className="col-md-2"></div>
		    	</div>
		      
		      <table className="table">
		      	<thead>
		      		<tr>
		      			<th>Name</th>
		      			<th>Detail</th>
		      			<th>Created At</th>
		      			<th>Action</th>
		      		</tr>
		      	</thead>
		      	<tbody>{this.state.products.map(product => { return <Product item={product} handleRemove={this.handleRemove} key={product.id}/>})}</tbody>
		      </table>
		    </div>
		);
	}
}

export default Products;