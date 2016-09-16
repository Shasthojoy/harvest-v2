/**
 * Created by matjames007 on 9/10/16.
 */

angular.module('harvestv2', ["ngRoute", "harvestv2.services"]).config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {templateUrl: '../partials/home.html', controller: 'UserCtrl'});
    $routeProvider.when('/signin', {templateUrl: '../partials/signin.html', controller: 'UserCtrl'});
    $routeProvider.when('/signup', {templateUrl: '../partials/signup.html', controller: 'UserCtrl'});
    $routeProvider.when('/confirmation', {templateUrl: '../partials/confirmation.html', controller: 'UserCtrl'});
    $routeProvider.when('/dashboard', {templateUrl: '../partials/dashboard.html', controller: 'UserCtrl'});
    $routeProvider.otherwise({redirectTo: '/'});

    $locationProvider.html5Mode(true);
}]);