angular.module('simulationRequestsApp',[])
.factory('simulationRequestsService',['$http','simulationManagerService','timelineService','contextService',
function($http,simManager,timeline,context)
{
  var service = {};
  service.requests = [];
  service.getSimulationRequests = function(res)
  {
    $http.get('/requests')
      .success(function(data){
        service.requests=data;
        res(null,data);
      })
      .error(function(data)
      {
        res('Get simulation requests error: ' + data);
      });
  };
  service.createSimulationRequest = function(req,res)
  {
    context.getSim(
      function(err,picked)
    {
      if(err)
      {
        console.log(err);
      }
      else
      {
        $http.post('/requests', req)
          .success(function(data){
            service.requests=data;
            res(null,data);
          })
          .error(function(data)
          {
            res('Create simulation requests error: ' + data);
          });
          
      }
    }); 
  };
  service.clearSimulationRequests = function(res)
  {
    $http.delete('/requests')
      .success(function(data){
        service.requests=data;
        res(null,data);
      })
      .error(function(data){
        res('Clear simulation requests error: ' + data);
      });
  };
  service.deleteSimulationsRequests = function(req,res)
  {
    $http.delete('/requests/' + req)
      .success(function(data){
        service.requests=data;
        res(null,data);
      })
      .error(function(data){
        res('Delete ' + name +' simulation request error: ' + data);
      });
  };
  service.processSimulationRequests = function(res)
  {
    $http.post('/requests/process')
    .success(function(requests) {
      service.requests=requests;

      simManager.getSimulationDescriptions(function(err,data)
      {
        if(err) 
        {
          console.log(err);
        }
        else
        {
          timeline.getDates(function(err,data){if(err){console.log(err);}});
        }
      });
    })
    .error(function(data){
      res('Process simulation requests error: ' + data);
    }); 
  };
  return service;
}])
.controller('simulationRequestsController',['$scope','simulationRequestsService',
function($scope,simulationRequestsService)
{
  $scope.requestManager = simulationRequestsService;

  $scope.deleteSimulationsRequests = function(name)
  {
    simulationRequestsService.getSimulationRequests(name,
      function(err,data)
      {
        if(err)
        {
          console.log(err);
        }
      });
  };

  $scope.startController = function()
  {
    simulationRequestsService.getSimulationRequests(
      function(err,data)
      {
        if(err)
        {
          console.log(err);
        }
      });
  };

  $scope.createRequest = function(name,days)
  {
    simulationRequestsService.createSimulationRequest({name: name, days: days},
      function(err,data)
      {
        if(err)console.log(err);
      })
  };

  $scope.processSimulationRequests = function()
  {
    simulationRequestsService.processSimulationRequests(
      function(err,data)
      {
        if(err)
        {
          console.log(err);
        }
      });
  };
  $scope.startController();
}]);
