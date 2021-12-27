const formattedReturn = require('./helpers/formattedReturn');
const getPost = require('./helpers/getPost');
const createPost = require('./helpers/createPost');

exports.handler = async (event) => {
    if (event.httpMethod === 'GET') {
        return await getPost(event);
    }
    else if (event.httpMethod === 'POST') {
        return await createPost(event);
    }
    else {
        return formattedReturn(405, {});
    }
};
