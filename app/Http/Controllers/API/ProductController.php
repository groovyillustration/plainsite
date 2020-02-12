<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Controllers\API\BaseController as BaseController;
use Illuminate\Http\Request;
use App\Product;

class ProductController extends BaseController
{
    public function index(Request $request){
    	$keyword = $request->keyword;
    	$lastId = $request->lastId;
    	$products = new Product;

    	if(!empty($keyword)){
    		$products = $products->where(function ($query) use ($keyword){
                $query->where('name', 'like', '%'.str_replace(' ', '%', $keyword).'%')
                      ->orWhere('detail', 'like', '%'.str_replace(' ', '%', $keyword).'%');
            });
    	}

    	if(!empty($lastId)){
    		$products = $products->where('id', '<', $lastId);
    	}

    	$products = $products->orderBy('id', 'desc')->limit(50)->get();

    	return response()->json($products);
    }

    public function getProduct($id){
    	$product = Product::where('id', $id)->first();

    	return response()->json($product);
    }

    public function updateProduct(Request $request, $id){
    	$product = Product::where('id', $id)->first();
    	$upd = false;
    	if(isset($request->name) && ($product->name != $request->name)){
    		$product->name = $request->name;
    		$upd = true;
    	}

    	if(isset($request->detail) && ($product->detail != $request->detail)){
    		$product->detail = $request->detail;
    		$upd = true;
    	}

    	if($upd){
    		$product->save();
    	}

    	return response()->json($product);
    }

    public function remove(Request $request){
    	$product = Product::find($request->prod_id);
    	Product::find($request->prod_id)->delete();

    	return response()->json($product);
    }
}
