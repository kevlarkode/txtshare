const formattedReturn = require('./helpers/formattedReturn');
const getPost = require('./helpers/getPost');
const createPost = require('./helpers/createPost');
const updatePost = require('./helpers/updatePost');
const deletePost = require('./helpers/deletePost');

exports.handler = async (event) => {
    if (event.httpMethod === 'GET') {
        return await getPost(event);
    }
    else if (event.httpMethod === 'POST') {
        return await createPost(event);
    }
    else if (event.httpMethod === 'PUT') {
        return await updatePost(event);
    }
    else if (event.httpMethod === 'DELETE') {
        return await deletePost(event);
    }
    else {
        return formattedReturn(405, {});
    }
};
