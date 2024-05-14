const userService = require('../services/userServices');


exports.getProfile = async (req, res) => {
    try {
        const user = await userService.getProfile(req.user);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getProfileImage = async (req, res) => {
    try {
        const imageProfile = await userService.getFile(req.file.filename);
        res.status(200).json({imageProfile});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        const image = req.file;
        const user = await userService.uploadImage(req.user, image);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};