<?php

use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

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

Route::group(['prefix' => '/v1'], function () {
    

    Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
    Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
    
    Route::get('/auth_alive', [\App\Http\Controllers\AuthController::class, 'authAlive']);

    Route::get('/unauthorized/user', function (){
        return response()->json(["status"=>false,"message"=>"unauthorized"])->setStatusCode(401);
    })->name("unauthorized");

});


Route::group(['prefix' => '/v1', 'middleware' => 'auth:api'], function () {    
    
    Route::get('todo', [TodoController::class, 'index']);
    Route::post('todo', [TodoController::class, 'store']);
    Route::get('todo/{id}', [TodoController::class, 'show']);
    Route::put('todo', [TodoController::class, 'update']);
    Route::delete('todo/{id}', [TodoController::class, 'destroy']); 

    //logout
    Route::post('/logout', [\App\Http\Controllers\UserController::class, 'logoutUser']);
});
