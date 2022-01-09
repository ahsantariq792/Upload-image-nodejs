// const express = require('express')
// const app = express()
// const fs = require('fs');
// const path = require('path')
// var cors = require('cors')
// const multer = require('multer')



import express from "express";
import multer from "multer";
import { readFile } from "fs/promises";
import cors from 'cors';
import  fstorage  from "./firebase.js";

const PORT = process.env.PORT || 5000
const app = express()

import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:5000"],
    // credentials: true
}))


const storageMulter = multer.diskStorage({
    destination: "./uploads/images",
    filename: (req, file, cb) => {
        cb(null, `${new Date().getTime()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storageMulter })


app.use('/profile', express.static('upload/images'))


app.post("/post", upload.any(), async (req, res, next) => {
    console.log(req.files)
    console.log(req.body)


    //Reference of file upload (path in firebasebucket)
    const file = await readFile(req.files[0].path);
    const storageRef = ref(fstorage, `images/images/${req.files[0].filename}`);
    const uploadTask = uploadBytesResumable(storageRef, file);



    uploadTask.on('state_changed',
        (snapshot) => {
            // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            // Handle unsuccessful uploads
            console.log("error in uploading image", error)
        },
        () => {
            //Get link of file uploaded on firebase
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
            });
        }
    );

})


app.post("/name", (req, res, next) => {
    console.log(req.body)

})



// app.get("/**", (req, res, next) => {
//     res.sendFile(path.join(__dirname, "./frontend/build/index.html"))
//     // res.redirect("/")
// })


app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
})

