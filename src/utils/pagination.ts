export interface PaginationQuery {
  page?: string;
  limit?: string;
  search?: string;
  from?: string;
  to?: string;
  [key: string]: any;
}

export interface ParsedPagination {
  page: number;
  limit: number;
  skip: number;
  search?: string;
  dateFilter?: { createdAt?: { gte?: Date; lte?: Date } };
}

export const parsePaginationQuery = (query: PaginationQuery): ParsedPagination => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit || '10', 10)));
  const skip = (page - 1) * limit;

  const result: ParsedPagination = { page, limit, skip };

  if (query.search && query.search.trim()) {
    result.search = query.search.trim();
  }

  if (query.from || query.to) {
    const createdAt: { gte?: Date; lte?: Date } = {};
    if (query.from) {
      createdAt.gte = new Date(query.from);
    }
    if (query.to) {
      const toDate = new Date(query.to);
      toDate.setHours(23, 59, 59, 999);
      createdAt.lte = toDate;
    }
    result.dateFilter = { createdAt };
  }

  return result;
};

export const buildPaginationMeta = (total: number, page: number, limit: number) => {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
