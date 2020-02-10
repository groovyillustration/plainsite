<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('register', 'API\AuthController@register');
Route::post('login', 'API\AuthController@login');

Route::group(['middleware' => 'auth:api'], function(){
	Route::get('getUser', 'API\AuthController@getUser');
	Route::get('getProducts', 'API\ProductController@index');
	Route::post('removeProduct', 'API\ProductController@remove');
	Route::post('logout', 'API\AuthController@logout');
});

Route::middleware('auth:api')->group(
	function(){
		Route::resource('products', 'API\ProductController');
	}
);

/*->get('/user', function (Request $request) {
    return $request->user();
});*/
