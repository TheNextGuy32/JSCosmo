var utility = require('./utility.js');

module.exports = function(columns, rows, plotsPer, tilt, rotation,rules) 
{
  var ctx = {};
  
  ctx.columns = columns;
  ctx.rows = rows;
  ctx.area = rows * columns;

  ctx.tilt = tilt;
  ctx.rotation = rotation;

  ctx.rules = rules;

  ctx.days = 0;

  ctx.highest = 1;
  ctx.hottest = 1;
  ctx.deepest = 1;
  ctx.brightest = 1;
  ctx.wettest = 1;
  ctx.tallest = 1;
  ctx.richestNutro = 1;
  ctx.richestNucium = 1;
  ctx.richestNutroStore = 1;
  ctx.richestNuciumStore = 1;
  ctx.richestWaterStore = 1;

  ctx.plantColumnsPer = Math.sqrt(plotsPer);
  ctx.plantColumns = ctx.columns * ctx.plantColumnsPer;
  ctx.plantRowsPer = Math.sqrt(plotsPer);
  ctx.plantsPer = ctx.plantRowsPer * ctx.plantColumnsPer;
  ctx.plantRows = ctx.rows * ctx.plantRowsPer;
  ctx.plantArea = ctx.plantColumns * ctx.plantRows;

  ctx.tectonic  = Array.apply(null, { length: ctx.area }).map( function() { return 0; });
  ctx.heat      = Array.apply(null, { length: ctx.area }).map( function() { return 0; });
  ctx.height    = Array.apply(null, { length: ctx.area }).map( function() { return 2; });
  ctx.depth     = Array.apply(null, { length: ctx.area }).map( function() { return 0; });
  ctx.sunlight  = Array.apply(null, { length: ctx.area }).map( function() { return 1; });
  ctx.rainfall  = Array.apply(null, { length: ctx.area }).map( function() { return 5; });

  ctx.continent = Array.apply(null, { length: ctx.area }).map( function() { return false; });
  ctx.unresolvedWater = Array.apply(null, { length: ctx.area }).map( function() { return false; });

  //  PLOT DATA  //
  ctx.nutro   = Array.apply(null, { length: ctx.area }).map( function() { return utility.randomNumberBetween(0,5) * ctx.plantsPer; });
  ctx.nucium  = Array.apply(null, { length: ctx.area }).map( function() { return utility.randomNumberBetween(0,5) * ctx.plantsPer; });

  //  Plant data
  ctx.hasPlant  = Array.apply(null, { length: ctx.plantArea }).map( function() { return false; });
  ctx.nutroStore  = Array.apply(null, { length: ctx.plantArea }).map( function() { return null; });
  ctx.nuciumStore  = Array.apply(null, { length: ctx.plantArea }).map( function() { return false; });
  ctx.waterStore = Array.apply(null, { length: ctx.plantArea }).map( function() { return false; });
  ctx.newGen = Array.apply(null, { length: ctx.plantArea }).map( function() { return false; });
  
  //  Plant dna
  ctx.dna = Array.apply(null, { length: ctx.plantArea }).map( function() { return false; });

  ctx.WrapCoordinate = function(coord)
  {
    while (coord.f < 0)
    {
      coord.f += ctx.columns;
    }
    while (coord.f >= ctx.columns)
    {
      coord.f -= ctx.columns;
    }

    while (coord.s < 0)
    {
      coord.s += ctx.rows;
    }
    while (coord.s >= ctx.rows)
    {
      coord.s -= ctx.rows;
    }

    return coord;
  };

  ctx.ConvertToZ = function(coord)
  {
    ctx.WrapCoordinate(coord);
    return coord.f + (ctx.columns * coord.s);
  };

  ctx.WrapZ = function(z) 
  {
    return ctx.ConvertToZ(ConvertToCoord(z));
   };
  ctx.ConvertToCoord = function(z)
  {
    return { 
      f: z % ctx.columns, 
      s: Math.floor(z / ctx.columns) 
    };
  };

  ctx.GetNeighbors = function(z, includeDiagonals)
  {
    var neighbors = new Array();

    var center = ctx.ConvertToCoord(z);
    
    neighbors.push(ctx.ConvertToZ({f:center.f,s:center.s-1}));
    neighbors.push(ctx.ConvertToZ({f:center.f+1,s:center.s}));
    neighbors.push(ctx.ConvertToZ({f:center.f,s:center.s+1}));
    neighbors.push(ctx.ConvertToZ({f:center.f-1,s:center.s}));
    

    if (includeDiagonals)
    {
      neighbors.push(ctx.ConvertToZ({f:center.f+1,s:center.s-1}));
      neighbors.push(ctx.ConvertToZ({f:center.f+1,s:center.s+1}));
      neighbors.push(ctx.ConvertToZ({f:center.f-1,s:center.s+1}));
      neighbors.push(ctx.ConvertToZ({f:center.f-1,s:center.s-1}));
    }

    return neighbors;
  };


  ctx.GetRingOfCoordinates = function(z, radius, doGetCenter)
  {
    var ring = new Array();
    
    var center = ctx.ConvertToCoord(z);

    //  Handle center
    if (doGetCenter)
    {
      ring.push(ctx.ConvertToZ(center));
    }
    //  Spokes
    for (var r = 1; r <= radius; r++)
    {
      ring.push(ctx.ConvertToZ({f:center.f,s:center.s-r}));
      ring.push(ctx.ConvertToZ({f:center.f+r,s:center.s}));
      ring.push(ctx.ConvertToZ({f:center.f,s:center.s+r}));
      ring.push(ctx.ConvertToZ({f:center.f-r,s:center.s}));
    }

    //  Pie slices
    for (var r = radius; r > 0; r--)
    {
      var x = center.f + 1;
      var y = center.s - r + 1;

      while (x > center.f)
      {
        if (y != center.s)
        {
          //console.log({f:x, s:y});
          ring.push(ctx.ConvertToZ({f:x, s:y}));
        }

        if (y < center.s)
        {
          x++;
        }
        else
        {
          x--;
        }

        y++;
      }
      x--;
      y--;
      while (x < center.f)
      {
        if (y != center.s)
        {
          //console.log({f:x, s:y});
          ring.push(ctx.ConvertToZ({f:x, s:y}));
        }

        if (y > center.s)
        {
          x--;
        }
        else
        {
          x++;
        }

        y--;
      }
    }
    return ring;
  
  };

  ctx.GetPlantNeighbors = function(p,includeDiagonals)
  {
    var neighbors = new Array();

    var center = ctx.ConvertToPlantCoord(p);
    
    neighbors.push(ctx.ConvertToP({f:center.f,   s:center.s-1}));
    neighbors.push(ctx.ConvertToP({f:center.f+1, s:center.s}));
    neighbors.push(ctx.ConvertToP({f:center.f,   s:center.s+1}));
    neighbors.push(ctx.ConvertToP({f:center.f-1, s:center.s}));
    

    if (includeDiagonals)
    {
      neighbors.push(ctx.ConvertToP({f:center.f+1,s:center.s-1}));
      neighbors.push(ctx.ConvertToP({f:center.f+1,s:center.s+1}));
      neighbors.push(ctx.ConvertToP({f:center.f-1,s:center.s+1}));
      neighbors.push(ctx.ConvertToP({f:center.f-1,s:center.s-1}));
    }

    return neighbors;
  };

  ctx.GetRingOfPlantCoordinates = function(p,radius,doGetCenter)
  {
    var ring = new Array();
    
    var center = ctx.ConvertToPlantCoord(p);

    //  Handle center
    if (doGetCenter)
    {
      ring.push(ctx.ConvertToP(center));
    }
    //  Spokes
    for (var r = 1; r <= radius; r++)
    {
      ring.push(ctx.ConvertToP({f:center.f,s:center.s-r}));
      ring.push(ctx.ConvertToP({f:center.f+r,s:center.s}));
      ring.push(ctx.ConvertToP({f:center.f,s:center.s+r}));
      ring.push(ctx.ConvertToP({f:center.f-r,s:center.s}));
    }

    //  Pie slices
    for (var r = radius; r > 0; r--)
    {
      var x = center.f + 1;
      var y = center.s - r + 1;

      while (x > center.f)
      {
        if (y != center.s)
        {
          //console.log({f:x, s:y});
          ring.push(ctx.ConvertToP({f:x, s:y}));
        }

        if (y < center.s)
        {
          x++;
        }
        else
        {
          x--;
        }

        y++;
      }
      x--;
      y--;
      while (x < center.f)
      {
        if (y != center.s)
        {
          //console.log({f:x, s:y});
          ring.push(ctx.ConvertToP({f:x, s:y}));
        }

        if (y > center.s)
        {
          x--;
        }
        else
        {
          x++;
        }

        y--;
      }
    }
    return ring;
  
  };
  ctx.WrapPlantCoordinate = function(coord)
  {
    while (coord.f < 0)
    {
      coord.f += ctx.plantColumns;
    }
    while (coord.f >= ctx.plantColumns)
    {
      coord.f -= ctx.plantColumns;
    }

    while (coord.s < 0)
    {
      coord.s += ctx.plantRows;
    }
    while (coord.s >= ctx.plantRows)
    {
      coord.s -= ctx.plantRows;
    }

    return coord;
  };

  ctx.ConvertToP = function(coord)
  {
    ctx.WrapPlantCoordinate(coord);
    return coord.f + (ctx.plantColumns * coord.s);
  };

  ctx.WrapP = function(p) 
  {
    return ctx.ConvertToP(ConvertToPlantCoord(p));
   };
  ctx.ConvertToPlantCoord = function(p)
  {
    return { 
      f: p % ctx.plantColumns, 
      s: Math.floor(p / ctx.plantColumns) 
    };
  };
  ctx.ConvertPToZ = function(p)
  {
    var coord = ctx.ConvertToPlantCoord(p);
    //console.log(ctx.plantColumns + " + " + ctx.plantRows);
    return ctx.ConvertToZ({
      f: Math.floor(coord.f/ctx.plantColumnsPer),
      s: Math.floor(coord.s/ctx.plantRowsPer)
    });
  };
  ctx.GetPlotsOfZ=function(z)
  {
    var plots = new Array();

    var start = { 
      f: (z % ctx.columns) * ctx.plantColumnsPer, 
      s: Math.floor(z / ctx.columns) * ctx.plantRowsPer 
    };
    
    for(var y = 0 ; y < ctx.plantRowsPer ; y++)
    {
      for(var x = 0 ; x < ctx.plantColumnsPer ; x++)
      {
         plots.push(ctx.ConvertToP({f: start.f + x, s: start.s+y}));
      }               
    }
    return plots;
  };

  /*
  Nutro Metabolism (0, ∞)
  Nucium Metabolism (0, ∞)
  Water Metabolism (0, ∞)
  //Nutrient Growth Ratio [0, 1]
  Number Seeds [1, ∞)
  Nucium Seed Endowment [1, ∞)
  Nutro Seed Endowment [1, ∞)
  Seed Dispersal Radius [1, 5)
  Seed Bearing Height [1, ∞)
  */

  ctx.GetNutroMetabolism = function(p)
  {
    if(!ctx.dna[p])
      return -1;
    return ctx.dna[p].charCodeAt(0)-97;
  };
  ctx.GetNutroConsumption = function(p)
  {
    if(!ctx.dna[p])
      return -1;
    return ctx.dna[p].charCodeAt(1)-97;
  };
  ctx.GetNuciumMetabolism = function(p)
  {
    if(!ctx.dna[p])
      return -1;
    return ctx.dna[p].charCodeAt(2)-97;
  };
  ctx.GetNuciumConsumption= function(p)
  {
    if(!ctx.dna[p])
      return -1;
    return ctx.dna[p].charCodeAt(3)-97;
  };
  ctx.GetNutroEndowment = function(p)
  {
    if(!ctx.dna[p])
      return -1;
    return ctx.dna[p].charCodeAt(4)-97;
  };
  ctx.GetNuciumEndowment = function(p)
  {
    if(!ctx.dna[p])
      return -1;
    return ctx.dna[p].charCodeAt(5)-97;
  };
  ctx.GetNumberSeeds = function(p)
  {
    if(!ctx.dna[p])
      return -1;
    return ctx.dna[p].charCodeAt(6)-97;  
  };
  ctx.GetSeedRadius = function(p)
  {
    if(!ctx.dna[p])
      return -1;
    return ctx.dna[p].charCodeAt(7)-97; 
  };
  return ctx;
};


