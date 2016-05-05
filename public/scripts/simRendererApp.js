angular.module('simulationRendererApp', [])
.factory('simulationRendererService',['$http',
function($http)
{
	var renderer = {};

	renderer.mode = "Satellite";

	renderer.modeSections = [
		{name:"Geography",	modes : ["Satellite", "Depth", "Elevation", "Height"]},
		{name:"Mantle", 	modes : ["Tectonic", "Asthenosphere"]},
		{name:"Weather", 	modes : ["Sunlight", "Rainfall"]},
		{name:"Soil",    	modes : ["Nutrients", "Nutro", "Nucium"]},
		{name:"Flora",   	modes : ["Nutrient Stores", "Nutro Stores", "Nucium Stores", "Water Stores"]}
	];

	renderer.colors = [];

	renderer.updateColors = function(req,res)
	{
		renderer.getColors({name:req,mode:renderer.mode},res);
	};

	renderer.getColors = function(req,res)
	{
		$http.get('/apis/worlds/'+req.name+'/current/'+req.mode)
		.success(function(data) 
		{
			renderer.mode = req.mode;
			renderer.colors = data;
			res(null,data)
		})
		.error(function(data) {
			res("Error updating colors: " + data);
		});	
	};

	renderer.clearCanvas = function(req,res)
	{
		req.ctx.clearRect(0, 0, canvas.width, canvas.height);
		res(null)
	};
	
	return renderer;
}])
.controller('simulationRendererController',['$scope','simulationRendererService','pickerService','simulationRequestsService','utilityService',
function($scope, renderer, picker, requester, utility)
{
	$scope.canvas = document.getElementById("canvas");
	$scope.ctx = $scope.canvas.getContext("2d");

	$scope.renderer = renderer;
	$scope.picker = picker;

	$scope.months = utility.months;
	$scope.days = utility.days;

	$scope.$watch('renderer.colors',function()
		{
			$scope.drawColors();
		},true);
	$scope.$watch('picker.pickedSim',function()
		{
			renderer.updateColors(picker.pickedSim.name,function(err,data)
				{
					$scope.drawColors();
				});
		});

	$scope.changeMapMode = function(mode)
	{
		if(mode != renderer.mapMode)
		{
			renderer.getColors(
				{name:picker.pickedSim.name,mode:mode},
				function(err,data)
				{
					if(err)
					{
						console.log(err);
					}
					else
					{
						$scope.drawColors();
					}
				});
		}
	};

	$scope.drawColors = function()
	{
		var width = $scope.canvas.width / picker.pickedSim.columns;
		var height = $scope.canvas.height / picker.pickedSim.rows;
		for(var x = 0 ; x < picker.pickedSim.columns; x++)
			{
				for(var y = 0 ; y < picker.pickedSim.rows; y++)
				{
					var z = (y * picker.pickedSim.columns)+x;
					$scope.ctx.save();
					$scope.ctx.fillStyle = renderer.colors[z];

					$scope.ctx.fillRect(
						width*x,
						height*y,
						width+1,
						height+1);

					$scope.ctx.restore();
				}
			}	
	};
	$scope.createSimulationRequest = function(namo,dayo)
	{
		//  Check for no simulation
		if(namo!= "No Simulation"){
			requester.createSimulationRequest({name:namo,days:dayo},function(err,data){});
		}
	};
}]);

