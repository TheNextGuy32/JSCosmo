const path = require('path');

module.exports.homePage = (req, res) => {
  res.status(200).sendFile(path.join(`${__dirname}/../html/index.html`));
};
module.exports.utility = require('./utility.js');
module.exports.manager = require('./manager.js');
module.exports.account = require('./account.js');
// module.exports.render = require('./render.js');
// module.exports.request = require('./request.js');
