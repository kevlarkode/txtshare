const { cloudinary } = require('./utils/cloudinary');

exports.handler = async event => {
    const { resources } = await cloudinary.search
        .expression('folder:txt-share-app')
        .max_results(30)
        .execute();

    return {
        statusCode: 200,
        body: JSON.stringify(resources)
    };
};