<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\API\BaseController as BaseController;
use Illuminate\Http\Request;
use App\Product;

class ProductController extends BaseController
{
    public function index(){
    	$products = Product::orderBy('id', 'desc')->limit(50)->get();

    	return response()->json($products);
    }

    public function remove(Request $request){
    	$product = Product::find($request->prod_id);
    	Product::find($request->prod_id)->delete();

    	return response()->json($product);
    }
}
