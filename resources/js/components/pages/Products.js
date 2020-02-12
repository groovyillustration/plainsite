import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Product from './Product';

class Products extends Component {
	constructor(props){
		super(props);
		this.props.handleRedirectNotLoggedIn(this.props.isLoggedIn, this.props.history);
		this.state = {
			products: [],
			search: '',
			fetching: false
		};

		this.fetchProducts = this.fetchProducts.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.broadCastingListener = this.broadCastingListener.bind(this);
		this.filterProducts = this.filterProducts.bind(this);
		this.scrollHandler = this.scrollHandler.bind(this);
		this.scrollHandler();
	}


	componentDidMount(){
		if(this.props.isLoggedIn){
			this.fetchProducts('', '');
		}
	}

	scrollHandler(){
		let self = this;
        $(window).scroll(function(){
            if(($(window).scrollTop() + $(window).height() == $(document).height()) && (self.state.fetching === false)){
                if(self.state.products.length > 0){
	                self.setState({
	                	fetching: true
	                });

                	let lastData = self.state.products[self.state.products.length-1];
                	self.fetchProducts(self.state.search, lastData.id);
                }
            }
        });
	}

	filterProducts(event){
		let keyPhrase = event.target.value;
		this.setState({
			search: keyPhrase
		});
		this.fetchProducts(keyPhrase, '');
	}

	broadCastingListener(){
		var username = this.props.username;
		this.props.socket.on('product', function(data){
			if((username !== undefined) && (username !== data.pusher)){
				document.getElementById('row_'+data.product.id).remove();
			}
		});
	}

	fetchProducts(keyword, lastId){
		let accesToken = Cookies.get('access_token');
		if(accesToken !== undefined){
			axios.get('/api/getProducts?keyword='+keyword+'&lastId='+lastId, {
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer '+accesToken
				}
			})
			.then(response => {
				let stateData = {
					products: (lastId > 0) ? this.state.products.concat(response.data) : response.data
				};

				if(this.state.fetching === true){
					stateData['fetching'] = false;
				}

				this.setState(stateData);
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
		    		<div className="col-md-12"><h2>Products</h2></div>
		    	</div>
		      
                <div className="form-group row">
                    <div className="col-md-12">
                        <input type="text" className="form-control" id="product_detail_search" name="product_detail_search" onChange={this.filterProducts} placeholder="Search..." value={this.state.search}/>
                    </div>
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
		      	<tbody id="product_wrap">{this.state.products.map(product => { return <Product item={product} history={this.props.history} handleRemove={this.handleRemove} key={product.id}/>})}</tbody>
		      </table>
		    </div>
		);
	}
}

export default Products;