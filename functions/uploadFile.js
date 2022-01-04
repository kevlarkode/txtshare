const { cloudinary } = require('./helpers/utils/cloudinary');
const { customAlphabet } = require('nanoid');
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 6);

exports.handler = async event => {
    try {
        const body = JSON.parse(event.body);
        const uuid = nanoid();
        const fileName = body.fileName;
        const file = body.file;
        const fileType = 'txt';
        const uploadResponse = await cloudinary.uploader.upload(file, {
            upload_preset: 'txt-share-app',
            resource_type: 'raw',
            public_id: `${fileName}_${uuid}.${fileType}`,
        });
        return {
            statusCode: 200,
            body: JSON.stringify({ url: uploadResponse.url, clip_id: uuid })
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify('Something went wrong')
        }
    }
};