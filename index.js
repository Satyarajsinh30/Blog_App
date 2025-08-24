const express = require("express")
const path = require("path")
const app = express()
const port = 8000
const userRouter = require("./routes/user")
const blogRouter = require("./routes/blog")
const blog = require("./models/blog")
const mongoose = require("mongoose")
const cookieparser = require("cookie-parser")
const { authenticateCookie } = require("./middleware/authentication")

app.use(express.urlencoded({extended:false}))
app.use(cookieparser())
app.use(authenticateCookie("token"))
app.use(express.static(path.resolve("./public")))

mongoose.connect("mongodb://127.0.0.1:27017/bloggo").then((e)=>{
    console.log("MongoDB Connected")
})

app.set("view engine","ejs")
app.set("views",path.resolve("./views"))

app.get("/home",async(req,res)=>{
    const allblogs = await blog.find({})
    return res.render("home",{
        user:req.user,
        blogs: allblogs
    })
})

app.use("/user",userRouter)
app.use("/blog",blogRouter)
app.listen(port,()=>{
    console.log(`server started at Port:${port}`)
})