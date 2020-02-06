<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
    	'user_id',
    	'name',
    	'detail'
    ];

    public function user(){
    	return $this->belongsTo('App\User', 'user_id');
    }
}
