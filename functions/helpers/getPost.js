const { table } = require('./utils/airtable');
const { cloudinary } = require('./utils/cloudinary');
const formattedReturn = require('./formattedReturn');

module.exports = async (event) => {
    try {
        const url = require('url');

        const rawUrl = event.rawUrl;
        const urlParams = url.parse(rawUrl, true).query;
        const clip_id = urlParams.clip_id;

        const post = await table
            .select()
            .firstPage();

        const formattedPosts = post.map((post) => ({
            id: post.id,
            ...post.fields,
        }));

        let result = '';

        formattedPosts.forEach(post => {
            if (post.clip_id == clip_id) {
                result = post;
            }
        })

        if (result === '')
            return formattedReturn(500, { msg: 'Something went wrong' });

        if (result.count === 0) {
            try {
                const { id } = result;
                await table.destroy(id);
            } catch (err) {
                console.error(err);
                return formattedReturn(500, { msg: 'Something went wrong' });
            }

            const cloudinaryPublicId = `txt-share-app/${(result.fileName).replace('.txt', '')}_${result.clip_id}.txt`;

            try {
                await cloudinary.uploader.destroy(cloudinaryPublicId, {
                    resource_type: 'raw'
                });
            } catch (err) {
                console.error(err);
                return formattedReturn(500, { msg: 'Something went wrong' });
            }
        }
        else {
            try {
                result.count--;
                const { id, timeStamp, ...fields } = result;
                await table.update([{ id, fields }]);
            } catch (err) {
                console.error(err);
                return formattedReturn(500, { msg: 'Something went wrong' });
            }
        }

        return formattedReturn(200, result);
    }
    catch (err) {
        console.error(err);
        return formattedReturn(500, { msg: 'Something went wrong' });
    }
};
