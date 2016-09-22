'use strict';
var renderer = require('../src/render.js');

//     Render apis    //
module.exports = function(app) 
{
  //  Gets the current data of a world
  app.get('/:name/latest/:mode', 
    function(req,res)
    {
      renderer.renderSimulationContextWithMode(
        {
          name:req.params.name
          ,mode:req.params.mode
        },
        function(err,renderInstructions) {
          if(err) {
            res.status = (err.status || 500);
            res.json(err);
          }
          else {
            res.json(renderInstructions);
          }
        });
    });

  //  Get teh world map data at a specifc date
  app.get('/:name/:days/:mode', 
    function(req,res)
    {
      renderer.renderSimulationContextWithMode(
        {
          name:req.params.name
          ,mode:req.params.mode
          ,days:req.params.days
        },
        function(err,renderInstructions) {
          if(err) {
            res.status = (err.status || 500);
            res.json(err);
          }
          else {
            res.json(renderInstructions);
          }
        });
    });
};