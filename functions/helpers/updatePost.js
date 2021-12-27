const { table } = require('./utils/airtable');
const formattedReturn = require('./formattedReturn');

module.exports = async (event) => {
    try {
        const { id, timeStamp, ...fields } = JSON.parse(event.body);
        const updatedPost = await table.update([{ id, fields }]);
        return formattedReturn(200, updatedPost);
    } catch (err) {
        console.error(err);
        return formattedReturn(500, { msg: 'Something went wrong' });
    }
};
