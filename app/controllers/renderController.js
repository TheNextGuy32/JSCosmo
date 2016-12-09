angular.module('simulationRendererApp')
  .controller('simulationRendererController',['$scope','utilityService','simulationRendererService','contextService','simulationRequestsService',
  ($scope, utility, renderer, context, requester) => {
    $scope.renderer = renderer;
    $scope.utility = utility;
    $scope.context = context;

    $scope.changeMapMode = (mode) => {
      alert(`Rendering a map from mongo document is under development, and is beyond the scope of the assignment.`)
      renderer.changeMapMode(mode, (err,data) => {
        if(err) {
          console.log(err);
        }
      });
    };

    $scope.createSimulationRequest = (namo,dayo) => {
      //  Check for no simulation
      if(namo!= "No Simulation") {
        requester.createSimulationRequest({name:namo,days:dayo}, (err,data) => {

        });
      }
    };
  }]);

