<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PostModel extends Model
{
    protected $table = 'students';
    protected $fillable = [
    'title',
    'author',
    'category',
    'status',
    'content',
    'image'
];

}
