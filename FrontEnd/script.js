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
    $scope.username = null;
    $scope.password = null;
    $scope.logIn = function () {
        $log.info($scope.username);
        $log.info($scope.password);
        document.getElementById('userInput').style.border = '2px solid #000';
        document.getElementById('passInput').style.border = '2px solid #000';
        document.getElementById('error').innerHTML = "";
        let un = $scope.username;
        let pw = $scope.password;
        let unTrim;
        let pwTrim;

        if (un != null) {
            unTrim = un.trim();
        }

        if (pw != null) {
            pwTrim = pw.trim();
        }

        console.log(pw);
        console.log(un);
        console.log(pwTrim);
        console.log(unTrim);

        if ((un == null && pw != null) || (unTrim == "" && pwTrim != "")) {
            document.getElementById("error").innerHTML = "Please enter in an username.";
            document.getElementById('userInput').style.border = '2px solid #FF0000';
        }
        else if ((pw == null && un != null) || (pwTrim == "" && unTrim != "")) {
            document.getElementById("error").innerHTML = "Please enter in a password.";
            document.getElementById('passInput').style.border = '2px solid #FF0000';
        }
        else if ((un == null || unTrim == "") && (pw == null || pwTrim == "")) {
            document.getElementById("error").innerHTML = "Please enter in an username and password.";
            document.getElementById('userInput').style.border = '2px solid #FF0000';
            document.getElementById('passInput').style.border = '2px solid #FF0000';
        }
    }
});

app.controller('signupController', function ($scope, $http, $log, $window, $routeParams) {
    $scope.username = null;
    $scope.password = null;
    $scope.signUp = function () {
        $log.info($scope.username);
        $log.info($scope.password);
        document.getElementById('userInput').style.border = '2px solid #000';
        document.getElementById('passInput').style.border = '2px solid #000';
        document.getElementById('error').innerHTML = "";
        let un = $scope.username;
        let pw = $scope.password;
        let unTrim;
        let pwTrim;

        if (un != null) {
            unTrim = un.trim();
        }

        if (pw != null) {
            pwTrim = pw.trim();
        }

        console.log(pw);
        console.log(un);
        console.log(pwTrim);
        console.log(unTrim);

        if ((un == null && pw != null) || (unTrim == "" && pwTrim != "")) {
            document.getElementById("error").innerHTML = "Please enter in an username.";
            document.getElementById('userInput').style.border = '2px solid #FF0000';
        }
        else if ((pw == null && un != null) || (pwTrim == "" && unTrim != "")) {
            document.getElementById("error").innerHTML = "Please enter in a password.";
            document.getElementById('passInput').style.border = '2px solid #FF0000';
        }
        else if ((un == null || unTrim == "") && (pw == null || pwTrim == "")) {
            document.getElementById("error").innerHTML = "Please enter in an username and password.";
            document.getElementById('userInput').style.border = '2px solid #FF0000';
            document.getElementById('passInput').style.border = '2px solid #FF0000';
        }
    }
});