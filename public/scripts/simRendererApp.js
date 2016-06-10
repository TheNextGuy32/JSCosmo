angular.module('simulationRendererApp', [])
.factory('simulationRendererService',['$http','contextService',
function($http,context)
{
	var renderer = {};

	renderer.modeSections = [
		{name:"Geography",	modes : ["Satellite", "Depth", "Elevation", "Height"]},
		{name:"Mantle", 	modes : ["Tectonic", "Asthenosphere"]},
		{name:"Weather", 	modes : ["Sunlight", "Rainfall"]},
		{name:"Soil",    	modes : ["Nutrients", "Nutro", "Nucium"]},
		{name:"Flora",   	modes : ["Density","DNA","Nutrient Stores", "Nutro Stores", "Nucium Stores", "Water Stores"]}
	];

	renderer.changeMapMode = function(req,res)
	{
		if(req != context.mapMode)
		{
			renderer.renderWorldAtDateWithMode(
				{	
					name:context.name
					,mode:req
					,year:context.year
					,month:context.month
					,day:context.day
				},
				function(err,data)
				{
					if(err)
					{
						res(err);
					}
					else
					{
						context.mode = req;
						res(null);
					}
				});
		}
	};

	renderer.renderWorldAtDateWithMode = function(req,res)
	{
		var date = "latest";
		if(req.year !=null)
		{
			date = req.year + "/" + req.month + "/" + req.day;
		}

		$http.get('/apis/worlds/' + req.name + "/" + date + "/" + req.mode)
		.success(function(renderInstructions) 
		{
			renderer.mode = req.mode;
			
			var canvas = document.getElementById("canvas");
			var ctx = canvas.getContext("2d");

			var width = canvas.width / renderInstructions.columns;
			var height = canvas.height / renderInstructions.rows;

			for(var x = 0 ; x < renderInstructions.columns; x++)
			{
				for(var y = 0 ; y < renderInstructions.rows; y++)
				{
					var z = (y * renderInstructions.columns)+x;
					ctx.save();
					ctx.fillStyle = renderInstructions.colors[z];

					ctx.fillRect(
						width*x,
						height*y,
						width+1,
						height+1);

					ctx.restore();
				}
			}	

			res(null,renderInstructions)
		})
		.error(function(err) {
			res("Error updating colors: " + err);
		});	
	};
	
	return renderer;
}])
.controller('simulationRendererController',['$scope','utilityService','simulationRendererService','contextService','simulationRequestsService',
function($scope, utility, renderer, context, requester)
{
	$scope.renderer = renderer;
	$scope.utility = utility;
	$scope.context = context;

	$scope.changeMapMode = function(mode)
	{
		renderer.changeMapMode(mode,function(err,data){if(err)console.log(err);});
	};


	$scope.createSimulationRequest = function(namo,dayo)
	{
		//  Check for no simulation
		if(namo!= "No Simulation"){
			requester.createSimulationRequest({name:namo,days:dayo},function(err,data){});
		}
	};
}]);

