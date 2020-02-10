<?php

namespace App\Http\Controllers\API;
   
use Illuminate\Http\Request;
use App\Http\Controllers\API\BaseController as BaseController;
use App\User;
use Illuminate\Support\Facades\Auth;
use Validator;
use Hash; 

class AuthController extends BaseController
{
    /**
     * Register api
     *
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
       $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8'
        ]);

       $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
       ]);

       return $this->attemptLogin($request->email, $request->password);
    }
   
    /**
     * Login api
     *
     * @return \Illuminate\Http\Response
     */
    public function login(Request $request)
    {
        return $this->attemptLogin($request->username, $request->password);
    }

    public function attemptLogin($username, $password){
        $http = new \GuzzleHttp\Client();
        try{
            $response = $http->post(config('services.passport.login.endpoint'), [
                'form_params' => [
                    'grant_type' => 'password',
                    'client_id' => config('services.passport.client.id'),
                    'client_secret' => config('services.passport.client.secret'),
                    'username' => $username,
                    'password' => $password
                ]
            ]);

            $access_token  = json_decode((string) $response->getBody(), true)['access_token'];
            $user = $http->get(env('APP_URL').'/api/getUser', [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                    'Authorization' => "Bearer $access_token"
                ]
            ]);

            $result = [
                'name' => json_decode((string) $user->getBody(), true)['name'],
                'email' => json_decode((string) $user->getBody(), true)['email'],
                'accessToken' => $access_token
            ];

            return response()->json($result);

        } catch (\GuzzleHttp\Exception\BadResponseException $e) {
            if($e->getCode() === 400){
                return response()->json('Invalid Request. Please enter a username or a password', $e->getCode());
            }elseif($e->getCode() === 401){
                return response()->json('Your credentials are incorrect. Please try again', $e->getCode());
            }

            return response()->json('Something went wrong on the server.', $e->getCode());
        }
    }

    public function getUser(Request $request){
        return response()->json(Auth::user());
    }

    public function logout()
    {
        auth()->user()->tokens->each(function($token, $key){
            $token->delete();
        });

        return response()->json(['logout' => 'success']);
    }

    public function exitUser(Request $request){
        if(isset($_COOKIE['username']) && ($_COOKIE['username'] == $request->username)){
            setCookie('username', null, time()-(86400 * 30), "/");
        }
        
        return response()->json(['exitUser' => 'success']);
    }

}