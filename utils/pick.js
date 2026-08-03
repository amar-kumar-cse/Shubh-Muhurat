exports.pick = (obj, allowedFields) =>
    allowedFields.reduce((acc, key) => {
        if (obj[key] !== undefined) acc[key] = obj[key];
        return acc;
    }, {});