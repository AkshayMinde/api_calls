const express = require('express');
const axios = require('axios');
const _ = require('lodash');


const app = express();

app.get('/', (req,res) => {
    res.send('Blogs_Search_Site');
})
app.get(`/api/blog-stats`, async(req,res) => {
    try {
        const blogs = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs',{
            headers:{
                'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
            }
        });
    
        const blogs_data = await blogs.data;
        // console.log(blogs_data);
        const total_num =  blogs_data.blogs.length;
        const longest_blog =  _.maxBy(blogs_data.blogs, blog => blog.title.length);
        const longest_title =  longest_blog ? longest_blog.title : "";
        const privacy_blogs =  _.filter(blogs_data.blogs, blog =>blog.title && blog.title.toLowerCase().includes('privacy'));
        const privacy_nums =  privacy_blogs.length;
        const unique_titles =  _.uniqBy(blogs_data.blogs, 'title').map(blog => blog.title);
        // console.log(total_num);
        // console.log(longest_blog);
        // console.log(longest_title);
        // console.log(privacy_blogs);
        // console.log(privacy_nums);
        // console.log(unique_titles);

        res.json({
            // blogs_data
            'Total number of blogs':total_num,
            'The title of the longest blog':longest_title,
            'Number of blogs with privacy in the title':privacy_nums,
            'An array of unique blog titles': unique_titles
        });
        
    } catch (error) {
        res.status(500).json({ error: 'Internal server error'});
        console.log(error);
    }
})

app.get('/api/blog-search', async(req,res) => {

    const blogs = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs',{
            headers:{
                'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6'
            }
        });
    
    const blogs_data = await blogs.data;

    const query = req.query.query;
    if(!query) {
        return res.json({error : 'Query is required'})
    }

    const filtered_blogs = _.filter(blogs_data.blogs, (blog) => {

        const blog_title = blog.title.toLowerCase();
        const searched_words = query.toLowerCase();

        return blog_title.includes(searched_words);
    })

    res.json(filtered_blogs);
})

const port = process.env.PORT || 5555;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});