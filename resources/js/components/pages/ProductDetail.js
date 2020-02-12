import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

class ProductDetail extends Component {
	constructor(props){
		super(props);
		this.state = {
			product: {}
		};

		this.nameHandler = this.nameHandler.bind(this);
		this.detailHandler = this.detailHandler.bind(this);
	}

	componentDidMount(){
		let accesToken = Cookies.get('access_token');
		let pId = this.props.location.pathname.replace('/products/', '');
		axios.get('/api/getProduct/'+pId, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer '+accesToken
			}
		})
		.then(response => {
			this.setState({
				product: response.data
			});
		})
		.catch(error => {
			console.log(error.response);
		});
	}

	nameHandler(event){
		let pId = this.props.location.pathname.replace('/products/', '');
		let nameVal = event.target.value;

		this.updateProduct(pId, {name: nameVal});
	}

	detailHandler(event){
		let pId = this.props.location.pathname.replace('/products/', '');
		let detailVal = event.target.value;

		this.updateProduct(pId, {detail: detailVal});
	}

	updateProduct(pId, params){
		let accesToken = Cookies.get('access_token');
		Object.keys(params).map(objKey => {
			this.setState(prevState => {
				prevState.product[objKey] = params[objKey];
				return {
					product: prevState.product
				};
			});

			axios.post('/api/products/'+pId+'/update', params,
			{
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer '+accesToken
				}
			})
			.then(response => {
				console.log(response.data);
			})
			.catch(error => {
				console.log(error.response);
			});
		});
	}

	render() {
		return (
		    <div className="container">
		    	<div className="row">
		    		<div className="col-md-12"><h2>Product</h2></div>
		    	</div>

				<div className="form-group">
					<label htmlFor="name">Name</label>
					<input type="text" className="form-control" id="name" placeholder="Enter Name" onChange={this.nameHandler} value={ (this.state.product.name !== undefined) ? this.state.product.name : '' } />
				</div>

				<div className="form-group">
					<label htmlFor="detail">Detail</label>
					<textarea className="form-control" id="detail" placeholder="Enter Detail" onChange={this.detailHandler} value={ (this.state.product.detail !== undefined) ? this.state.product.detail : '' }></textarea>
				</div>
		    </div>
		);
	}
}

export default ProductDetail;