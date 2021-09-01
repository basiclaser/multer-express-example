import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config()

//////////////////////////////////////////
import mongoose from "mongoose"
const UserSchema = new mongoose.Schema({
  name: String,
  avatar: String
})
const User = mongoose.model("User", UserSchema)
//////////////////////////////////////////

const app = express()
const PORT = process.env.PORT || 4321;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop())
  }
})

const upload = multer({ storage })
app.set('view engine', 'ejs');

app.use(express.static(process.cwd() + '/uploads'));
 
app.get("/profile", async (req, res) => {
  const user = await User.findById("<INSERT SOME DOC ID AFTER HERE>")
  res.render("profile", {
      image: user.avatar
  })
})
app.get("/", (req, res) => {
  res.render("index")
})

app.post("/upload-profile-pic", upload.single('avatar'), async (req, res) => {
  if(!req.file.filename) { 
    res.send(400, "No file uploaded")
  }
  console.log(req.file, req.body);
  await User.findByIdAndUpdate("<INSERT SOME DOC ID AFTER HERE>", {avatar: req.file.filename})
  res.send(`<h2>Here is the picture:</h2><img src=${req.file.filename} alt="something"/>`)
});

mongoose.connect(process.env.CONNECTION_URI, async ()=>{
  const user = await User.create({name: "jeff"})
  console.log("here's your test user id, now you can comment out line 51 and add it to line 35,46", JSON.stringify(user._id))
  app.listen(PORT)
})
