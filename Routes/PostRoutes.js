const express=require('express');
const postRoute=express();


postRoute.use(express.urlencoded({extended:true}));
const PostController = require('../Controller/PostController');
//Get all Blogs
postRoute.get('/all-blogs',PostController.getAllBlog);

postRoute.post('/create-blog',PostController.postBlog);

postRoute.put('/update/:id',PostController.updateBlog);
postRoute.get('/get_blogs/:id',PostController.getAllBlogByIdsController);


postRoute.get('/getall_blogs/:id',PostController.getallBlogsByuser);

postRoute.delete('/delete/:id', PostController.deleteBlog);
//For Search Blogs
postRoute.get('/search/:searchQuery', PostController.search_Blog);



module.exports=postRoute