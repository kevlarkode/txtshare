const { cloudinary } = require('./utils/cloudinary');
const { customAlphabet } = require('nanoid');
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 6);

exports.handler = async event => {
    try {
        const body = JSON.parse(event.body);
        const uuid = nanoid();
        const file = body.data;
        const fileType = 'txt';
        const uploadResponse = await cloudinary.uploader.upload(file, {
            upload_preset: 'txt-share-app',
            resource_type: 'raw',
            public_id: `${uuid}.${fileType}`,
        });
        console.log(uploadResponse)
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