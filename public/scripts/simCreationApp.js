angular.module('creationApp',[])
.factory('creationService',['rulesService','simulationManagerService','simulationRendererService','pageService','pickerService',
function(rulesService,simulationManagerService,renderer,page,picker)
{
	var creationService = {};

	creationService.createSim = function(formData,res)
	{
		simulationManagerService.createSim(formData,function(err,data)
		{
			if(err)
			{
				res(err);
			}
			else
			{
				res(null);
			}
		});
	};
	creationService.navigateToSim = function (name)
	{
		picker.pickSim(name,function(err)
			{
				if(err)
				{
					console.log(err)
				}
				else
				{
					renderer.updateColors(picker.pickedSim.name,
						function(err,data)
						{
							if(err)
							{
								console.log(err);
							}
							else
							{
								page.changePage('Home');
							}
						});
					
				}
			});
	}
	return creationService;

}])
.controller('creationController', ['$scope','rulesService','creationService','utilityService',
function($scope,rulesService,creationService,utility) 
{
	$scope.rules = rulesService;

	$scope.formData={
		 name: ""
		,rotation: 1
		,tilt: 0.75
		,dimensions:{columns:80,rows:50}
	};
	$scope.isValidNumber = function(n)
	{
		return n != null &&
			n != "" && !isNaN(n);
	};
	$scope.createSim = function()
	{
		for (var i in $scope.formData) 
		{
		    if ($scope.formData[i] === null ||
		    	$scope.formData[i] === "" || 
		    	$scope.formData[i] === undefined || 
		    	$scope.formData[i] === false) 
		    {
		        delete $scope.formData[i];
		    }
		}

		creationService.createSim($scope.formData,
			function(err)
			{
				if(err)
				{
					alert(err);
				}
				else
				{
					creationService.navigateToSim($scope.formData.name);
				}
			});

	};

	$scope.randomizeName = function()
	{
		utility.getRandomName(function(err,data)
			{
				if(err)
				{
					console.log(err);
				}
				else
				{
					$scope.formData.name = data;
				}
			});
	};
	$scope.startApp = function()
	{
		$scope.randomizeName();
	};
	$scope.camelize = function(str) {
	  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
	    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
	  }).replace(/\s+/g, '');
	};

	
	
	$scope.startApp();
}]);

