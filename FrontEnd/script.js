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

app.service('setGetAccount', function () {
    var objectValue = {
        data: ""
    };

    return {
        getAccount: function () {
            return objectValue;
        },
        setAccount: function (value) {
            objectValue = value;
        },
    };
});

app.controller('homeController', function ($scope, $route, $http, setGetAccount) {
    document.getElementById('sidebar-wrapper').style.display = "none";

    let acct = setGetAccount.getAccount();
    console.log(acct);
    let username = acct.data;
    console.log(username);
    document.getElementById('navbar').style.display = "block";
    if((acct.data == "" || acct == undefined) && (username == "" || username == undefined)) {
        document.getElementById('lisu').style.display = "block";
        document.getElementById('loggedin').style.display = "none";
    }
    else{
        $scope.$emit('loggedinEvent');
        document.getElementById('lisu').style.display = "none";
        document.getElementById('loggedin').style.display = "block";
        $scope.username = acct;
    }

});

app.controller('navbarController', function ($scope, $rootScope, $window, $http, setGetAccount) {
    $rootScope.$on('loggedinEvent', function(event) {
        $scope.username = setGetAccount.getAccount();
    })

    $scope.logOut = () => {
        setGetAccount.setAccount("");
        console.log('test');
        $window.location.href = '/';
    }
});

app.controller('searchController', function ($scope, $http, $log, $window, $routeParams) {
    document.getElementById('sidebar-wrapper').style.display = "none";

});

app.controller('messagesController', function ($scope, $http, $log, $window, setGetAccount) {
    let acct = setGetAccount.getAccount();
    let username = acct.data;
    if((acct.data == "" || acct == undefined) && (username == "" || username == undefined)) {
        $window.location.href = '#!/';
    }

    document.getElementById('sidebar-wrapper').style.display = "block";
});

app.controller('loginController', function ($scope, $http, $log, setGetAccount, $window, $routeParams) {
    document.getElementById('navbar').style.display = "none";
    $http.get('/');
    setGetAccount.setAccount("");
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
            document.getElementById("error").innerHTML = "Please enter in an username and/or password.";
            document.getElementById('userInput').style.border = '2px solid #FF0000';
            document.getElementById('passInput').style.border = '2px solid #FF0000';
        }
        else {
            $http.get('http://localhost:3000/user/' + $scope.username + '/' + $scope.password)
                .then(function (response) {
                    if (response.data != "") {
                        setGetAccount.setAccount($scope.username);
                        $window.location.href = "#!/";

                    }
                    else {
                        console.log(response);
                        document.getElementById("error").innerHTML = "Username and/or Password is wrong.";
                        document.getElementById('userInput').style.border = '2px solid #FF0000';
                        document.getElementById('passInput').style.border = '2px solid #FF0000';
                    }
                });
        }
    }
});

app.controller('signupController', function ($scope, $http, $log, setGetAccount, $window, $routeParams) {
    document.getElementById('navbar').style.display = "none";
    setGetAccount.setAccount("");
    $scope.username = null;
    $scope.password = null;
    $scope.signUp = function () {
        $log.info($scope.username);
        $log.info($scope.password);
        document.getElementById('userInput').style.border = '2px solid #000';
        document.getElementById('passInput').style.border = '2px solid #000';
        document.getElementById('req').style.color = 'rgb(0,0,0)';
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
            document.getElementById('req').style.color = "rgb(255,0,0)";
            document.getElementById('userInput').style.border = '2px solid #FF0000';
        }
        else if ((pw == null && un != null) || (pwTrim == "" && unTrim != "")) {
            document.getElementById("error").innerHTML = "Please enter in a password.";
            document.getElementById('req').style.color = "rgb(255,0,0)";
            document.getElementById('passInput').style.border = '2px solid #FF0000';
        }
        else if ((un == null || unTrim == "") && (pw == null || pwTrim == "")) {
            document.getElementById("error").innerHTML = "Please enter in an username and/or password.";
            document.getElementById('req').style.color = "rgb(255,0,0)";
            document.getElementById('userInput').style.border = '2px solid #FF0000';
            document.getElementById('passInput').style.border = '2px solid #FF0000';
        }
        else {
            $http.get('http://localhost:3000/user/get/' + $scope.username)
                .then(function (response) {
                    if (response.data != "") {
                        document.getElementById("error").innerHTML = "Username is already taken";
                        document.getElementById('userInput').style.border = '2px solid #FF0000';
                    }
                    else if (pw.length < 6 && (pw != null && pwTrim != "")) {
                        document.getElementById("error").innerHTML = "Password must be more than 5 charcters.";
                        document.getElementById('passInput').style.border = '2px solid #FF0000';
                    }
                    else {
                        $http.post('http://localhost:3000/user/', { 'username': $scope.username, 'password': $scope.password });
                        setGetAccount.setAccount($scope.username);
                        window.location.href = "#!/";
                    }
                });
        }
    }
});