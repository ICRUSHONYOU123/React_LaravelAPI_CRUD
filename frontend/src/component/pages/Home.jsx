import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function Home() {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    // 1. Dark Mode State (Default: Light Mode)
    const [isDarkMode, setIsDarkMode] = useState(false);

    // 2. Modal States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // 3. Form Data State
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: '',
        status: 'Active',
        content: '',
        image: null
    });

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const result = await axios.get("http://127.0.0.1:8000/api/get-all-posts");
            setPosts(result.data.posts); 
        } catch (error) {
            console.error("Error loading posts:", error);
        }
    };

    // --- Filter Logic ---
    const filteredPosts = posts.filter((post) => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- Modal Handlers ---
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

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
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/create-new-post", data);
            loadPosts();
            toggleModal();
            setFormData({ title: '', author: '', category: '', status: 'Active', content: '', image: null });
            alert("Post Created Successfully!");
        } catch (error) {
            console.error("Error creating post:", error);
            alert("Failed to create post. Check console.");
        }
    };

    // --- DELETE LOGIC ---
    const confirmDelete = (id) => {
        setDeleteId(id);
        setIsDeleteOpen(true);
    };

    const executeDelete = async () => {
        if (!deleteId) return;

        try {
            await axios.delete(`http://127.0.0.1:8000/api/delete-post/${deleteId}`);
            setPosts(posts.filter(post => post.id !== deleteId));
            setIsDeleteOpen(false);
            setDeleteId(null);
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete.");
            setIsDeleteOpen(false);
        }
    };

    // --- THEME CONFIGURATION ---
    // This object makes it easy to switch styles
    const theme = {
        bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
        card: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
        text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
        subText: isDarkMode ? 'text-gray-400' : 'text-gray-500',
        input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900',
        tableHeader: isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-300 text-gray-700',
        tableRow: isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-white hover:bg-blue-50 text-gray-900',
        buttonSecondary: isDarkMode ? 'bg-gray-700 text-white border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
    };

    return (
        <div className={`flex flex-col max-h-[80vh] min-h-screen p-10 transition-colors duration-300 ${theme.bg}`}>
            
            {/* --- HEADER --- */}
            <div className={`flex flex-col md:flex-row justify-between items-center mb-8 gap-4 p-5 rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-blue-950'}`}>
                <h1 className="text-3xl font-extrabold text-white tracking-tight">
                    <span className="text-blue-500">Laravel & React</span> CRUD
                </h1>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto items-center">
                    {/* Search */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <i className="fa-solid fa-magnifying-glass text-gray-400"></i>
                        </div>
                        <input 
                            type="text" 
                            className={`text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-64 pl-10 p-2.5 shadow-sm border ${theme.input}`} 
                            placeholder="Search by title..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* --- DARK MODE TOGGLE BUTTON --- */}
                    <button 
                        onClick={() => setIsDarkMode(!isDarkMode)} 
                        className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all shadow-sm border ${isDarkMode ? 'bg-gray-700 text-yellow-300 border-gray-600 hover:bg-gray-600' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'}`}
                    >
                        {isDarkMode ? <i className="fa-solid fa-sun text-lg"></i> : <i className="fa-solid fa-moon text-lg"></i>}
                    </button>

                    <Link to="/" className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all shadow-sm border ${theme.buttonSecondary}`}>
                        <i className="fa-solid fa-house"></i>
                    </Link>
                    
                    {/* TRIGGER BUTTON */}
                    <button 
                        onClick={toggleModal} 
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md transform hover:scale-105 whitespace-nowrap"
                    >
                        <i className="fa-solid fa-plus"></i>
                        New Post
                    </button>
                </div>
            </div>

            {/* --- CREATE MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm p-4 overflow-y-auto transition-all duration-100">
                    <div className={`relative w-full max-w-2xl rounded-xl shadow-2xl border ${theme.card}`}>
                        
                        {/* Modal Header */}
                        <div className={`flex items-center justify-between p-5 border-b rounded-t-xl ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                            <h3 className={`text-xl font-bold ${theme.text}`}>
                                Create New Post
                            </h3>
                            <button onClick={toggleModal} type="button" className={`rounded-lg text-sm w-8 h-8 flex justify-center items-center transition-all ${isDarkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-400 hover:bg-gray-200 hover:text-gray-900'}`}>
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>

                        {/* Modal Body (Form) */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Title */}
                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${theme.text}`}>Post Title</label>
                                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} required className={`block w-full p-2.5 text-sm rounded-lg border focus:ring-blue-500 focus:border-blue-500 ${theme.input}`} placeholder="Enter title"/>
                                </div>
                                {/* Author */}
                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${theme.text}`}>Author</label>
                                    <input type="text" name="author" value={formData.author} onChange={handleInputChange} required className={`block w-full p-2.5 text-sm rounded-lg border focus:ring-blue-500 focus:border-blue-500 ${theme.input}`} placeholder="Enter author name"/>
                                </div>
                                {/* Category */}
                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${theme.text}`}>Category</label>
                                    <input type="text" name="category" value={formData.category} onChange={handleInputChange} required className={`block w-full p-2.5 text-sm rounded-lg border focus:ring-blue-500 focus:border-blue-500 ${theme.input}`} placeholder="e.g. Technology"/>
                                </div>
                                {/* Status */}
                                <div>
                                    <label className={`block mb-2 text-sm font-medium ${theme.text}`}>Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange} className={`block w-full p-2.5 text-sm rounded-lg border focus:ring-blue-500 focus:border-blue-500 ${theme.input}`}>
                                        <option value="Active">Active</option>
                                        <option value="Published">Published</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Content */}
                            <div>
                                <label className={`block mb-2 text-sm font-medium ${theme.text}`}>Content</label>
                                <textarea name="content" value={formData.content} onChange={handleInputChange} required rows="4" className={`block p-2.5 w-full text-sm rounded-lg border focus:ring-blue-500 focus:border-blue-500 ${theme.input}`} placeholder="Write your post content here..."></textarea>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className={`block mb-2 text-sm font-medium ${theme.text}`}>Upload Image</label>
                                <input type="file" onChange={handleFileChange} className={`block w-full text-sm border rounded-lg cursor-pointer focus:outline-none ${theme.input}`}/>
                            </div>

                            {/* Modal Footer */}
                            <div className={`flex items-center space-x-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <button type="submit" className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-md transition-all">
                                    Create Post
                                </button>
                                <button onClick={toggleModal} type="button" className={`focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 ${theme.buttonSecondary}`}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- DELETE CONFIRMATION DIALOG --- */}
            <Dialog open={isDeleteOpen} onClose={setIsDeleteOpen} className="relative z-50">
                <DialogBackdrop transition className="fixed inset-0 bg-gray-900/50 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in" />
                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <DialogPanel transition className={`relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className={`px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="sm:flex sm:items-start">
                                    <div className={`mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10 ${isDarkMode ? 'bg-red-900/20' : 'bg-red-100'}`}>
                                        <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <DialogTitle as="h3" className={`text-base font-semibold ${theme.text}`}>
                                            Delete Post?
                                        </DialogTitle>
                                        <div className="mt-2">
                                            <p className={`text-sm ${theme.subText}`}>
                                                Are you sure you want to delete this post? This data will be permanently removed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={`px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                <button type="button" onClick={executeDelete} className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 sm:ml-3 sm:w-auto">
                                    Delete
                                </button>
                                <button type="button" onClick={() => setIsDeleteOpen(false)} className={`mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm ring-1 ring-inset sm:mt-0 sm:w-auto ${isDarkMode ? 'bg-gray-800 text-gray-300 ring-gray-600 hover:bg-gray-700' : 'bg-white text-gray-900 ring-gray-300 hover:bg-gray-50'}`}>
                                    Cancel
                                </button>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

            {/* --- TABLE SECTION --- */}
            <div className={`overflow-auto relative bg-white shadow-lg rounded-xl border flex flex-col ${theme.card}`}>
                <div className={`px-6 py-4 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-950 border-gray-200'}`}>
                    <h2 className="shrink-0 text-lg font-semibold text-white">All Posts List</h2>
                    <span className="text-sm text-white bg-blue-600 px-3 py-1 rounded-full">
                        Found: {filteredPosts.length} posts
                    </span>
                </div>

                <div className="overflow-auto flex-1">
                    <table className={`w-full text-sm text-left ${theme.subText}`}>
                        <thead className={`uppercase text-xs font-bold tracking-wider sticky top-0 z-10 shadow-sm ${theme.tableHeader}`}>
                            <tr>
                                <th scope="col" className="px-6 py-4">Title</th>
                                <th scope="col" className="px-6 py-4">Author</th>
                                <th scope="col" className="px-6 py-4">Category</th>
                                <th scope="col" className="px-6 py-4">Status</th>
                                <th scope="col" className="px-6 py-4">Content</th>
                                <th scope="col" className="px-6 py-4">Image</th>
                                <th scope="col" className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
                            {filteredPosts.map((post) => (
                                <tr key={post.id} className={`transition-colors duration-200 ${theme.tableRow}`}>
                                    <th scope="row" className={`px-6 py-4 font-semibold whitespace-nowrap ${theme.text}`}>
                                        {post.title}
                                    </th>
                                    <td className={`px-6 py-4 font-medium ${theme.text}`}>
                                        {post.author}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded border ${isDarkMode ? 'bg-gray-700 text-gray-300 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                                            {post.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${
                                            post.status && (post.status.toLowerCase() === 'active' || post.status.toLowerCase() === 'published')
                                            ? (isDarkMode ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-green-100 text-green-700 border border-green-200')
                                            : (isDarkMode ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-red-100 text-red-700 border border-red-200')
                                        }`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 truncate max-w-xs ${theme.subText}`}>
                                        {post.content}
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.image ? (
                                            <img src={post.image} alt={post.title} className={`w-12 h-12 rounded-lg object-cover border shadow-sm ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`} />
                                        ) : (
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                                                <i className="fa-regular fa-image"></i>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 flex justify-center gap-4">
                                        <Link to={`/edit/${post.id}`} className="group relative">
                                            <div className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-blue-900/30 text-blue-400' : 'hover:bg-blue-100 text-blue-600'}`}>
                                                <i className="fa-solid fa-pen-to-square text-xl"></i>
                                            </div>
                                        </Link>
                                        <button onClick={() => confirmDelete(post.id)} className="group relative">
                                            <div className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-100 text-red-600'}`}>
                                                <i className="fa-regular fa-trash-can text-xl"></i>
                                            </div>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {filteredPosts.length === 0 && (
                        <div className="text-center py-10">
                            <div className={`mb-2 ${theme.subText}`}>
                                <i className="fa-solid fa-magnifying-glass text-4xl"></i>
                            </div>
                            <p className={`text-lg ${theme.subText}`}>No posts match "{searchTerm}"</p>
                            <button onClick={() => setSearchTerm("")} className="text-blue-500 hover:underline font-medium mt-2">
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home;