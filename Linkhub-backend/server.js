const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const multer = require("multer");
const app = express();
app.use(express.json());
const user = require("./userModel");
require('dotenv').config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const corsOptions = {
    origin: "*",
    credentials: true,
    optionSuccessStatus: 200,
}
app.use(cors(corsOptions))

mongoose.connect("mongodb+srv://Yash:" + process.env.MONGOPASSWORD + "@cluster0.djeqndd.mongodb.net/linkhubUsers?retryWrites=true&w=majority",
    { useNewUrlParser: true });

var conn = mongoose.createConnection("mongodb+srv://Yash:" + process.env.MONGOPASSWORD + "@cluster0.djeqndd.mongodb.net/linkhubUserfiles?retryWrites=true&w=majority");
var userFiles = conn.model('userFile', new mongoose.Schema({
    path: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    downloadContent: {
        type: Number
    }

}));

const upload = multer({ dest: "uploads" });


app.post("/signup", async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const found = await user.findOne({ email: Email });
        if (found) {
            res.status(200).send({
                success: false,
                message: "Email already in use"
            })
        }
        else {
            try {
                let hashed_password = await bcrypt.hash(Password, 10);
                const newUser = new user({
                    email: Email,
                    password: hashed_password,
                })
                newUser.save().then(() => {
                    res.status(200).send({
                        success: true,
                        message: "account created"
                    })
                }).catch(() => {
                    res.status(200).send({
                        success: false,
                        message: "error creating account"
                    })
                })
            }
            catch (err) {
                console.log(err);
            }

        }
    }
    catch (err) {
        console.log(err);
    }
});

app.post("/login", async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const found = await user.findOne({ email: Email });
        if (found) {
            let matches = await bcrypt.compare(Password, found.password);
            if (matches) {
                const token = jwt.sign({ email: Email }, process.env.JWT_SECRET, {
                    expiresIn: "1d"
                });
                res.status(200).send({
                    success: true,
                    message: "logged in",
                    tkn: token
                })
            }
            else {
                res.status(200).send({
                    success: false,
                    message: "wp"
                })
            }
        }
        else {
            res.status(200).send({
                success: false,
                message: "nf"
            })
        }
    }
    catch (err) {
        console.log(err);
    }
})


app.post("/authenticate", async (req, res) => {

    const { tkn } = req.body;
    if (tkn === null) {
        res.status(200).send({
            success: false,
            message: "Access denied (unacceptable token)"
        })
    }
    else {
        try {

            try {
                const data = jwt.verify(tkn, process.env.JWT_SECRET);
                if (data) {
                    res.status(200).send({
                        success: true,
                        message: "Access granted",
                        Email: data.email
                    })
                } else {
                    res.status(200).send({
                        success: false,
                        message: "Access denied (session expired)"
                    })
                }
            }
            catch (err) {
                console.log(err);
                res.status(200).send({
                    success: false,
                    message: "Access denied (unacceptable token)"
                })
            }
        }
        catch (err) {
            console.log("aaa")
            console.log(err);
        }

    }

})


app.post("/fileUpload", upload.single("file"), async (req, res) => {
    const fileObj = {
        path: req.file.path,
        name: req.file.originalname,
        owner: req.body.owner,
    }
    try {
        const file = await userFiles.create(fileObj);
        const historyArray = await userFiles.find({ owner: req.body.owner });
        res.status(200).send({
            path: process.env.SERVER_URL+"/userFiles/" + file._id,
            history:historyArray
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).send({
            err: "error creating link"
        })
    }
})

const download = async (req, res) => {
    try {
        const file = await userFiles.findById(req.params.fileId);
        await file.save();
        res.download(file.path, file.name);
    }
    catch (err) {
        console.log(err);
    }
}
app.post("/getHistory", async (req, res) => {
    const user = req.body.username;
    let historyArray = ["Error loading history",];
    try {
        historyArray = await userFiles.find({ owner: user });
        res.status(200).send(historyArray)
    }
    catch (err) {
        console.log(err);
        res.status(200), send(historyArray);
    }
});

app.post("/deleteFile", async (req, res) => {
    try {
        const file = await userFiles.findById(req.body.fileId);
        fs.unlink(file.path, async (err) => {
            if (err) {
                console.error("Error deleting file:", err);
                return res.status(500).send({ error: "Error deleting file" });
            }
        
            await userFiles.findByIdAndDelete(req.body.fileId);
            res.status(200).send({ message: "File deleted successfully" });
        });
    } catch (err) {
        console.error("Error deleting file:", err);
        res.status(500).send({ error: "Error deleting file" });
    }
}
)
app.get("/userFiles/:fileId", download);




app.listen(2000, () => {
    console.log("server is up at port 2000");
})