<?php

namespace App\Http\Controllers;

use App\Models\PostModel;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function getAllPosts()
    {
        $show = PostModel::query()->orderBy('id', 'ASC')->get();
        return response([
            "message" => "All posts retrieved successfully",
            "posts" => $show
        ]);
    }
    public function createNewPost(Request $request)
    {
        $requestData = $request->validate([
            'title' => 'required|string|max:100',
            'author' => 'required|string|max:50',
            'category' => 'required|string|max:100',
            'status' => 'required|string|max:20',
            'content' => 'required|string|max:500',
        ]);
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = time() . '_' . $file->getClientOriginalExtension();
            // Make sure the folder name matches below
            $file->move(public_path('images'), $fileName);
            $requestData['image'] = url('images/' . $fileName);
        }
        $insert = PostModel::create($requestData);
        if ($insert) {
            return response()->json([
                'message' => 'Post created successfully',
                'post' => $requestData
            ], 201);
        } else {
            return response()->json([
                'message' => 'Failed to create post'
            ], 500);
        }
    }
    public function UpdatePost($id, Request $request)
    {
        // 1. Find the post first. If it doesn't exist, stop immediately.
        $post = PostModel::find($id);

        if (!$post) {
            return response()->json([
                "message" => "Update failed, post not found"
            ], 404);
        }
        // 2. Use 'sometimes' instead of 'required'
        $validatedData = $request->validate([
            'title'    => 'sometimes|string|max:100',
            'author'   => 'sometimes|string|max:50',
            'category' => 'sometimes|string|max:100',
            'status'   => 'sometimes|string|max:20',
            'content'  => 'sometimes|string|max:500',
            'image'    => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048' // Good to validate the image type too
        ]);
        // 3. Handle Image Upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalExtension();
            $image->move(public_path('images'), $imageName);

            // Add the new image path to the data to be updated
            $validatedData['image'] = url('images/' . $imageName);

            // Optional: Delete the old image file from the folder here if necessary
        }

        // 4. Update the post with ONLY the validated data sent
        $post->update($validatedData);

        return response()->json([
            "message" => "Post updated successfully",
            "post" => $post // Return the updated model
        ], 200);
    }
    public function DeletePost($id)
    {
        $insert = PostModel::where('id', $id)->delete();
        if(!$insert){
            return response()->json([
                "message" => "Delete failed, post not found"
            ],404);
        }
        return response()->json([
            "message" => "Post deleted successfully"
        ]);
    }
    public function searchPost($title)
    {
        $post = PostModel::find($title);
        if (!$post) {
            return response()->json([
                'message' => 'Post not found'
            ], 404);
        }
        return response()->json([
            'message' => 'Post retrieved successfully',
            'post' => $post
        ]);
    }
    // Add this function inside your class
    public function getPost($id)
    {
        $post = PostModel::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // React expects the data inside a "post" key
        return response()->json(['post' => $post], 200);
    }
}
