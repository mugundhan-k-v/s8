const FileUpload = require('../models/FileUpload');
const multer = require('multer');

// Set up memory storage
const storage = multer.memoryStorage();

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 16000000 }, // 16MB limit (MongoDB BSON limit)
}).single('file');

// @desc    Upload a file
// @route   POST /api/upload
// @access  Private
exports.uploadFile = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).json({ msg: err.message });
        } else {
            if (req.file == undefined) {
                return res.status(400).json({ msg: 'No file selected!' });
            } else {
                // Save to DB
                try {
                    const { schoolId } = req.body;

                    const newFile = new FileUpload({
                        schoolId,
                        fileName: req.file.originalname,
                        fileData: req.file.buffer, // Store Buffer
                        fileSizeBytes: req.file.size,
                        fileType: req.file.mimetype,
                    });

                    await newFile.save();

                    // Don't return the binary data in the response
                    res.json({
                        msg: 'File Uploaded to Database!',
                        metadata: {
                            id: newFile._id,
                            fileName: newFile.fileName,
                            size: newFile.fileSizeBytes
                        }
                    });
                } catch (dbErr) {
                    console.error(dbErr);
                    res.status(500).send('Database Error');
                }
            }
        }
    });
};

// @desc    Get all uploaded files metadata
// @route   GET /api/upload
// @access  Private
exports.getFiles = async (req, res) => {
    try {
        const files = await FileUpload.find().select('-fileData'); // Exclude binary data
        res.json(files);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Download a file
// @route   GET /api/upload/:id
// @access  Private
exports.downloadFile = async (req, res) => {
    try {
        const file = await FileUpload.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ msg: 'File not found' });
        }

        res.set('Content-Type', file.fileType);
        res.set('Content-Disposition', `attachment; filename="${file.fileName}"`);
        res.send(file.fileData);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
