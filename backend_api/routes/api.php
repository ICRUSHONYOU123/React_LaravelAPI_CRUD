<?php

use App\Http\Controllers\PostController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::controller(PostController::class)->group(function(){
    route::get("/get-all-posts","getAllPosts");
    route::post("/create-new-post","createNewPost");
    Route::get("/get-post/{id}", "getPost");
    route::put("/Update-post/{id}","UpdatePost");
    route::delete("/delete-post/{id}","DeletePost");
    route::get("Search-post/{title}","SearchPost");
});
