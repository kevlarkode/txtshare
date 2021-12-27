const { table } = require('./utils/airtable');
const formattedReturn = require('./formattedReturn');

module.exports = async (event) => {
    try {
        const fields = JSON.parse(event.body);
        const createdPost = await table.create([{ fields }]);
        return formattedReturn(200, createdPost);
    } catch (err) {
        console.error(err);
        return formattedReturn(500, { msg: 'Something went wrong' });
    }
};
