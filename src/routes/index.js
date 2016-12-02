// const render = require('./render.js');
// const request = require('./request.js');
const controllers =require('../controllers');
const manager = require('./manager.js');
const utility = require('./utility.js');
const account = require('./account.js');


module.exports = (app) => {
  app.get('/', controllers.homePage);

  account(app);
  manager(app);
  utility(app);
  //render(app);
  //request(app);
};