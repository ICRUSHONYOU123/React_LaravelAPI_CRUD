import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

function Edit() {
    const { id } = useParams(); // Get ID from URL
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: '',
        status: 'Active',
        content: '',
        image: null,
        existingImage: null // To show the current image preview
    });

    // Fetch the post data when the page loads
    useEffect(() => {
        const fetchPost = async () => {
            try {
                // You might need to create this endpoint in Laravel if it doesn't exist
                // Route::get('/get-post/{id}', ...);
                const result = await axios.get(`http://127.0.0.1:8000/api/get-post/${id}`);
                const post = result.data.post; // Assuming API returns { post: ... }
                
                setFormData({
                    title: post.title,
                    author: post.author,
                    category: post.category,
                    status: post.status,
                    content: post.content,
                    existingImage: post.image,
                    image: null
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching post:", error);
                alert("Could not load post data.");
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = new FormData();
        data.append('title', formData.title);
        data.append('author', formData.author);
        data.append('category', formData.category);
        data.append('status', formData.status);
        data.append('content', formData.content);
        
        // IMPORTANT: Laravel requires _method: PUT for file updates via POST
        data.append('_method', 'PUT'); 

        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            await axios.post(`http://127.0.0.1:8000/api/update-post/${id}`, data);
            alert("Post Updated Successfully!");
            navigate("/"); // Redirect back to Home
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Update failed.");
        }
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-10 flex justify-center">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
                    <h1 className="text-2xl font-bold text-gray-800">Edit Post</h1>
                    <Link to="/" className="text-sm text-blue-600 hover:underline">
                        <i className="fa-solid fa-arrow-left mr-1"></i> Back to Home
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Post Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Author</label>
                            <input type="text" name="author" value={formData.author} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Category</label>
                            <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5"/>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-900">Status</label>
                            <select name="status" value={formData.status} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 block w-full p-2.5">
                                <option value="Active">Active</option>
                                <option value="Published">Published</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">Content</label>
                        <textarea name="content" value={formData.content} onChange={handleInputChange} rows="6" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500"></textarea>
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900">Current Image</label>
                        {formData.existingImage && (
                            <img src={formData.existingImage} alt="Current" className="w-20 h-20 object-cover rounded mb-4 border" />
                        )}
                        <label className="block mb-2 text-sm font-medium text-gray-900">Update Image (Optional)</label>
                        <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"/>
                    </div>

                    <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                        <button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-md w-full md:w-auto">
                            Update Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Edit;