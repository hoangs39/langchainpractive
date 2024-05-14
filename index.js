const express = require("express");
const multer = require('multer');
const morgan = require("morgan");
const upload = multer({ dest: 'public/' });
const { writeFile } = require("fs").promises;
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const {uploadFile, getFile, deleteFile} = require("./s3")
app.use(morgan('combined')); 

app.post('/upload', upload.single('image'), async function (req, res, next) {
    const file = req.file;
    const result = await uploadFile(file);
    console.log(result);
    res.send(file);
    
})

app.get('/images/:key', async function (req, res, next) {
    const fileKey = req.params.key;
    const result = getFile(fileKey)
        .then((fileContent) => {
            return writeFile(`./public/${fileKey}.png`, fileContent);
        })
        .then(() => {
            console.log("File saved successfully.");
        })
        .catch((error) => {
            console.error("Error retrieving or saving the file:", error);
        });
    // result.pipe(res);
    res.send("ok");
})

app.delete('/images/:key', async function (req, res, next) {
    const fileKey = req.params.key;
    const result = deleteFile(fileKey)
        .then(() => {
            console.log("File deleted successfully.");
        })
        .catch((error) => {
            console.error("Error deleting the file:", error);
        });
    res.send("ok");
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {console.log("Hello World! on Port 8080:" + PORT)});
