angular.module('rulesApp',[])
.factory('rulesService', [
function()
{
	var rules = {};
	rules.booleanRules = 
	[
		{
			character: "C",
			title: "Consumption",
			tooltip: "Plants consume nutrients from the soil equal to their metabolism."
		},
		{
			character: "V",
			title: "Starvation",
			tooltip: "Plants die if their nutrient/water stores reach zero."
		},
		{
			character: "W",
			title: "Water Consumption and Storage",
			tooltip: "Plants recieve and store water from rainfall, and need it to survive."
		},
		{
			character: "A",
			title: "Nutrient Averaging",
			tooltip: "Periodically average local soil nutrients."
		},
		{
			character: "M",
			required: "S",
			title: "Maturity",
			tooltip: "Plants must mature before they can reproduce. Requires seeding."
		},
		{
			character: "D",
			title: "Disease",
			tooltip: "Disease infects and kills plants."
		},
		{
			character: "B",
			title: "Biomass Decay",
			required: "R | D | V"
			tooltip: "Plants deposit thier endowment into the soil upon death. Requires a mode of death.",
			
		}
	];
	rules.inputRules = 
	[
		{
			character: "R",
			title: "Root Competition",
			tooltip: "Plants die if they have too many neighbors n.",
			inputs:[
				{
					character: "n",
					title: "neighbors",
					left: {value:0, inclusive: true},
					right
				}]
		},
		{
			character: "S",
			title: "Seeding",
			tooltip: "Plants reproduce if they have stored their nutrient endowment.",
			inputs:[
				{
					character: "m",
					title: "chromosomal mutation rate",
					type: "float",
					left: {value:0, inclusive:true},
					right: {value:1, inclusive: true}
				}]
		}
		
	];
	return rules;
}])
.controller("rulesController",['$scope','rulesService', 
function($scope,rulesService)
{
	$scope.rule = "";
	$scope.formData = {};
	$scope.UpdateRule = function()
	{
		$scope.rule = "";
		$scope.booleanRuleValues = [];
		
			
		// for (var i in $scope.formData) {
		//   if ($scope.formData[i] === null ||$scope.formData[i] === "" || $scope.formData[i] === undefined || $scope.formData[i] == false) {
		//     delete $scope.formData[i];
		//   }
		// }
		

		//$scope.rule = $scope.rule.substring(0, $scope.rule.length - 2);
	};
	$scope.isValidNumber = function(n)
	{
		return n != null &&
			n != "" && !isNaN(n);
	};
}]);

