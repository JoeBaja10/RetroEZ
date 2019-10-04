var app = angular.module('myApp', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider.
        when('/', { templateUrl: 'views/pages/home.html', controller: 'homeController' }).
        when('/login', { templateUrl: 'views/pages/login.html', controller: 'loginController' }).
        when('/signup', { templateUrl: 'views/pages/signup.html', controller: 'signupController' }).
        when('/search/:id', { templateUrl: 'views/pages/todo.html', controller: 'searchController' }).
        when('/game/:id', { templateUrl: 'views/pages/done.html', controller: 'gameController' }).
        when('/messages', { templateUrl: 'views/pages/messages.html', controller: 'messagesController' }).
        when('/message', { templateUrl: 'views/pages/message.html', controller: 'messageController' }).
        otherwise({ redirectTo: '/' });
});

app.controller('homeController', function ($scope, $http) {

});

app.controller('navController', function () {

});


app.controller('searchController', function ($scope, $http, $log, $window, $routeParams) {

});

app.controller('loginController', function ($scope, $http, $log, $window, $routeParams) {

});

app.controller('signupController', function ($scope, $http, $log, $window, $routeParams) {

});