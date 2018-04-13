const ncp = require('ncp');

module.exports = (source, destination) => {
  return new Promise((resolve, reject) => {
    ncp.ncp(source, destination, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    })
  });
}