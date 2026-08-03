const getPagination = (query) => {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 10, 50);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};

const buildPaginationMeta = (total, page, limit) => {
    return {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
    };
};

module.exports = {
    getPagination,
    buildPaginationMeta
};
