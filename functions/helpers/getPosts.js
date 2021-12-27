const { table } = require('./utils/airtable');
const formattedReturn = require('./formattedReturn');

module.exports = async (event) => {
    try {
        const post = await table
            .select()
        .firstPage();
        
        const formattedPosts = post.map((post) => ({
            id: post.id,
            ...post.fields,
        }));
        return formattedReturn(200, formattedPosts);
    }
    catch (err) {
        console.error(err);
        return formattedReturn(500, { msg: 'Something went wrong' });
    }
};
