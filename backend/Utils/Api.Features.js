const parseQueryParams = require('../Controllers/Query.Helper');

class ApiFeatures {
  constructor(query, queryParams) {
    this.query = query; // Mongoose query object
    this.queryParams = queryParams; // Express request query object
  }

  // Apply filtering (excluding non-filtering fields)
  filter() {
    const queryObj = { ...this.queryParams };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    const filterQuery = parseQueryParams(queryObj);
    this.query = this.query.find(filterQuery);
    return this;
  }

  // Apply sorting if specified, else default to -createdAt
  sort() {


    // if (this.queryParams.sort) {
    //   const sortBy = this.queryParams.sort.split(',').join(' ');
    //   this.query = this.query.sort(sortBy);
    // } else {
    //   this.query = this.query.sort('-createdAt');
    // }
    // return this;

    if (this.queryParams.sort) {
      let sortBy;

      if (Array.isArray(this.queryParams.sort)) {
        // Handles cases like ?sort=duration&sort=price
        sortBy = this.queryParams.sort.join(' ');
      } else if (typeof this.queryParams.sort === 'string') {
        // Handles cases like ?sort=duration,price
        sortBy = this.queryParams.sort.split(',').join(' ');
      } else {
        // Fallback in case of unexpected types
        sortBy = '-createdAt';
      }

      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;

  }

  // Limit fields returned in response
  limitFields() {
    if (this.queryParams.fields) {
      const selectedFields = this.queryParams.fields.split(',').join(' ');
      this.query = this.query.select(selectedFields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  // Paginate results based on page & limit
  paginate() {
    const page = this.queryParams.page * 1 || 1;
    const limit = this.queryParams.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
