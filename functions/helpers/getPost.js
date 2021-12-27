const { table } = require('./utils/airtable');
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

        return formattedReturn(200, result);
    }
    catch (err) {
        console.error(err);
        return formattedReturn(500, { msg: 'Something went wrong' });
    }
};
