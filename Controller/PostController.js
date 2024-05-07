const PostModel=require("../Model/postModel");
const mongoose = require("mongoose");
const UserModel = require('../Model/userModel');
const moment=require("moment");

const getAllBlog = async (req, res) => {
    try {
        // Find all blog posts and populate the 'user' field
        const blogs = await PostModel.find().populate('user');

        // Map over each blog post to extract user name
        const blogsWithUserName = blogs.map(blog => {
            return {
                _id: blog._id,
                title: blog.title,
                description: blog.description,
                image: blog.image,
                userImage: blog.user.image,
                userId:blog.user._id,
                userName: blog.user ? blog.user.name : null ,// Retrieve user name or set to null if user doesn't exist
                createdAt: moment(blog.createdAt).format('DD-MM-YYYY HH:mm:ss'),
                updatedAt: blog.updatedAt
            };
        });

        // Send the response with blog posts including user name
        res.status(200).json({ blogs: blogsWithUserName });
    } catch (error) {
        console.error("Error fetching blogs:", error.message);
        res.status(500).send("Error fetching blogs");
    }
}




const postBlog = async (req, res) => {
    try {
        const { title, description, image, user } = req.body;
    
        // Check if any required field is missing
        if (!title || !description || !image || !user) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }
        console.log(title,description,image,user);
    
        // Check if the user exists
        const existingUser = await UserModel.findById(user);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
    
        // Create a new blog post
        const blog = new PostModel({
            title,
            description,
            image,
            user
        });
        // Save the new blog post to the database
        const result = await blog.save();
        existingUser.blog.push(result._id);
        await existingUser.save();
        res.status(201).json({ message: 'Blog created successfully', data: result });
    
    } catch (error) {
        // Send an error response
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
    
};

const updateBlog=async(req,res)=>{
    try {
        const {id}=req.params;
        const {title , description , image} =req.body;
        if(!title || !description  || !image ){
            return res.status(404).send({message:'Please fill all the fields'});
        }else{
            const result= await PostModel.findByIdAndUpdate( id, { $set: { title, description, image } },{ new: true });
            res.status(200).send({ message: 'Blog Updates success', data: result});
              
        }
        
    } catch (error) {
        if (error) throw error;
        res.status(404).send({message:'Error '+error.message});

        
    }
}

const getAllBlogByIdsController=async(req,res)=>{
    try {
        const id=req.params.id;
        const blog = await PostModel.findById(id);
        if(!blog) return res.status(404).send({message: 'No blog'});
        res.status(200).json({data:blog,})
        
    } catch (error) {
        if (error) throw error;
        console.error("Error during login:", error.message);
        res.status(404).send("Error during login:", error.message);
        
    }
}

const deleteBlog = async (req, res) => {
    try {
        const id = req.params.id;

        // Find the blog and populate the user field
        const result = await PostModel.findByIdAndDelete(id)

        if (!result) {
            return res.status(404).send({ message: 'No blog found' });
        }

        // Remove the deleted blog from the user's blogs array
        const user = await UserModel.findById(result.user._id).then((user)=>{
            user.blog.splice(user.blog.indexOf(id), 1);
            user.save();
            return user;
        })
      
       

        res.status(200).send({ message: 'Blog deleted successfully', data: result });
    } catch (error) {
        console.error("Error during blog deletion:", error.message);
        res.status(500).send({ message: 'Error during blog deletion', error: error.message });
    }
}
const getallBlogsByuser=async(req,res)=>{
    try {
        const {id}=req.params;
        const user = await UserModel.findById(id).populate("blog");
        if(!user) return res.status(404).send({message: 'No user found'});
        res.status(200).json({data:user.blog})

        
    } catch (error) {
        if (error) throw error;
        console.error("Error to get blogs:", error.message);
        res.status(404).send("Error to get blogs:", error.message);
        
    }
}


const search_Blog = async (req, res) => {
    try {
       const search=req.params.searchQuery
       console.log(search);
       const blogs=await PostModel.find({ title: { $regex: new RegExp(search, "i") } });
        res.status(200).json({blogs})
        if(!blogs.length>0){
            return res.status(404).send({message: 'No blog found'})
        }

    } catch (error) {
        console.error("Error fetching blogs:", error.message);
        res.status(500).send("Error fetching blogs");
    }
}

module.exports={
    getAllBlog,
    postBlog,
    updateBlog,
    getAllBlogByIdsController,
    deleteBlog,
    getallBlogsByuser,
    search_Blog
}