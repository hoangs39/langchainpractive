const User = require('../models/User');
const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_KEY;

const s3Client = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
    }
});


exports.getProfile = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    return user;
};

exports.uploadImage = async (userId, image) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    uploadFile(image);
    user.profileImage = image.filename;
    await user.save();
    return user;
};

uploadFile = (file) => {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    };

    const command = new PutObjectCommand(uploadParams);

    return s3Client.send(command);
};

exports.getFile = async (fileKey) => {
    const downloadParams = {
        Bucket: bucketName,
        Key: fileKey
    };

    const command = new GetObjectCommand(downloadParams);

    const response = await s3Client.send(command);
    const body = await streamToBuffer(response.Body);

    return body;
};

function streamToBuffer(stream) {

    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
}


