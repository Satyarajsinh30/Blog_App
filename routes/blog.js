const {Router} = require("express")
const multer = require("multer")
const blog = require("../models/blog")
const router = Router();
const path = require("path");
const comment = require("../models/comments");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
      const filename = `${Date.now()}-${file.originalname}`
      cb(null,filename)
    }
  })
  
const upload = multer({ storage: storage })

router.get("/add-blog",(req,res)=>{
    return res.render("addblog",{
        user:req.user       
    })
})

router.get("/:id",async (req,res)=>{
  const Blog = await blog.findById(req.params.id).populate("createdBy")
  const comments = await comment.find({blogId:req.params.id}).populate("createdBy")   
  return res.render("blog",{
    user:req.user,
    Blog,
    comments
  })
})

router.post("/comment/:blogId",async(req,res)=>{
  await comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id
  })
  return res.redirect(`/blog/${req.params.blogId}`)
})

router.post("/",upload.single("coverImage"),async(req,res)=>{
    const {title,body} = req.body
    const Blog = await blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageUrl:`/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${Blog._id}`)
})



module.exports = router;