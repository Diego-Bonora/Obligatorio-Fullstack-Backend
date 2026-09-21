export const getSkip = (page, limit) => (page - 1) * limit;

export const buildPaginatedResponse = (data, total, page, limit) => ({
  data,
  meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
});
