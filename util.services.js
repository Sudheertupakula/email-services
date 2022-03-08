module.exports.ReE = function (res, message, code = 200) { // Error Web Response

    let error = [];
    error.push(message);
    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json({ success: 0, error, data: {} });
};

module.exports.ReS = function (res, data, code) { // Success Web Response
    let send_data = { success: 1, error: [] };

    if (typeof data == 'object') {
        send_data = Object.assign(data, send_data);//merge the objects
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json(send_data)
};