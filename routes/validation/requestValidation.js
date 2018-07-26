'use strict';

module.exports = {

  moviesPostRequestErrors: (req) => {
    const errors = [];

    if (!req.body.title) {
      errors.push('Request should contain title');
    }

    if (Object.keys(req.body).length !== 1) {
      errors.push('Request should contain only one parameter');
    }

    return errors;
  },

  commentsPostRequestErrors: (req) => {
    const errors = [];

    if (!req.body.movieID) {
      errors.push('Request should contain movieID');
    }

    if (!req.body.text) {
      errors.push('Request should contain comment text');
    }

    return errors;
  },

};
