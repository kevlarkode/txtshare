const { table } = require('./utils/airtable');
const formattedReturn = require('./formattedReturn');

module.exports = async (event) => {
    try {
        const { id } = JSON.parse(event.body);
        const deletePost = await table.destroy(id);
        return formattedReturn(200, deletePost);
    } catch (err) {
        console.error(err);
        return formattedReturn(500, { msg: 'Something went wrong' });
    }
};
