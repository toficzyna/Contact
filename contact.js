var contact = angular.module('contact', []);

contact.controller('contactCtrl', ['$scope', '$http', 'urls', 'statuses', function($scope, $http, urls, statuses){
  //udostepninie statusow w widoku
  $scope.statuses = statuses;
  $scope.sendMessage = function(){
      var obj = {
          to:$scope.to,
          subject:$scope.subject,
          mail:$scope.mail
      };
      var clearForm = function(){
          $scope.to = "";
          $scope.subject = "";
          $scope.mail = "";          
      };
      //two-way-data-binding, przekazanie do widoku informacji o statusie wysylania wiadomosci
      $scope.status = statuses.waiting;
      //uzycie providera $http do wykonania RESTowego calla
      $http.post(urls.server + '/send', {params: obj})
          .success(function(data) {
              clearForm();
              console.log(data);
              $scope.status = statuses.success;
          })
          //jesli serwer zwroci blad
          .error(function(data) {
              clearForm();
              console.log('Error: ' + data);
              $scope.status = statuses.error;
          });
   }
}]);
//osobny constant do przechowywania adresu serwera
contact.constant('urls',{
    server: "http://localhost:3000"
});
//osobny konstant do przechowywania nazw statusow
contact.constant('statuses',{
    success: "Sukces!",
    error: "Blad",
    waiting: "Wysylanie..."
});

contact.directive('contactDir', function(){
    return{
        restrict: 'E',
        controller: 'contactCtrl',
        templateUrl: 'contact.html'
    }
});