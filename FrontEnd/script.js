var app = angular.module('myApp', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider.
        when('/', { templateUrl: 'views/pages/home.html', controller: 'homeController' }).
        when('/login', { templateUrl: 'views/pages/login.html', controller: 'loginController' }).
        when('/signup', { templateUrl: 'views/pages/signup.html', controller: 'signupController' }).
        when('/search/:id', { templateUrl: 'views/pages/todo.html', controller: 'searchController' }).
        when('/game/:id', { templateUrl: 'views/pages/done.html', controller: 'gameController' }).
        when('/messages', { templateUrl: 'views/pages/messages.html', controller: 'messagesController' }).
        when('/messages/new', { templateUrl: 'views/pages/messages.html', controller: 'messagesController' }).
        when('/messages/sent', { templateUrl: 'views/pages/messages.html', controller: 'messagesController' }).
        when('/messages/trash', { templateUrl: 'views/pages/messages.html', controller: 'messagesController' }).
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

    let acct = setGetAccount.getAccount();
    console.log(acct);
    let username = acct.data;
    console.log(username);
    document.getElementById('navbar').style.display = "block";
    if ((acct.data == "" || acct == undefined) && (username == "" || username == undefined)) {
        document.getElementById('lisu').style.display = "block";
        document.getElementById('loggedin').style.display = "none";
    }
    else {
        $scope.$emit('loggedinEvent');
        document.getElementById('lisu').style.display = "none";
        document.getElementById('loggedin').style.display = "block";
        $scope.username = acct;
    }

});

app.controller('navbarController', function ($scope, $rootScope, $window, $http, setGetAccount) {
    $rootScope.$on('loggedinEvent', function (event) {
        $scope.username = setGetAccount.getAccount();
    })

    $scope.logOut = () => {
        setGetAccount.setAccount("");
        console.log('test');
        $window.location.href = '/';
    }
});

app.controller('searchController', function ($scope, $http, $log, $window, $routeParams) {

});

app.controller('messagesController', function ($scope, $http, $log, $location, $window, setGetAccount) {
    document.getElementById('userInput').style.border = '2px solid #000';
    document.getElementById('messageBox').style.border = '2px solid #000';

    let acct = setGetAccount.getAccount();
    let username = acct.data;
    if ((acct.data == "" || acct == undefined) && (username == "" || username == undefined)) {
        $window.location.href = '#!/';
    }

    document.getElementById('sidebar-wrapper').style.display = "block";

    let showMessages = false;

    if ($location.path() == '/messages') {
        document.getElementById('new').style.display = 'none';
        $http.get('http://localhost:3000/message/')
            .then(function (response) {
                $scope.messages = new Array;
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].recievingUser == acct && response.data[i].isTrashed == false) {
                        showMessages = true;
                        $scope.messages.push({
                            user: response.data[i].sendingUser,
                            msg: response.data[i].message,
                            id: response.data[i]._id
                        });
                    }
                }
                if (showMessages == false) {
                    document.getElementById('message').style.display = "block";
                    document.getElementById('message').innerHTML = "YOU HAVE NO MESSAGES!"
                }
                else {
                    document.getElementById('messages').style.display = "block";
                    // document.getElementById('delTD').style.display = "block";
                }
            });
    }
    else if ($location.path() == '/messages/new') {
        document.getElementById('new').style.display = 'block';
    }
    else if ($location.path() == '/messages/sent') {
        document.getElementById('new').style.display = 'none';
        $http.get('http://localhost:3000/message/')
            .then(function (response) {
                $scope.messages = new Array;
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].sendingUser == acct && response.data[i].isTrashed == false) {
                        showMessages = true;
                        $scope.messages.push({
                            user: response.data[i].recievingUser,
                            msg: response.data[i].message,
                            id: response.data[i]._id
                        });
                    }
                }
                if (showMessages == false) {
                    document.getElementById('message').style.display = "block";
                    document.getElementById('message').innerHTML = "YOU HAVE NO SENT MESSAGES!"
                }
                else {
                    document.getElementById('messages').style.display = "block";
                    // document.getElementById('delTD').style.display = "block";
                }
            });
    }
    else if ($location.path() == '/messages/trash') {
        document.getElementById('new').style.display = 'none';
        $http.get('http://localhost:3000/message/')
            .then(function (response) {
                $scope.messages = new Array;
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].isTrashed == true) {
                        showMessages = true;
                        $scope.messages.push({
                            user: response.data[i].recievingUser,
                            msg: response.data[i].message,
                            id: response.data[i]._id
                        });
                    }
                }
                if (showMessages == false) {
                    document.getElementById('message').style.display = "block";
                    document.getElementById('message').innerHTML = "YOU HAVE NO DELETED MESSAGES!"
                }
                else {
                    // document.getElementById('delTD').style.display = "none";
                    document.getElementById('messages').style.display = "block";
                }
            });
    }

    $scope.deleteMessage = function (messageID) {
        $http.get('http://localhost:3000/message/' + messageID)
            .then(function (response) {
                $http.put('http://localhost:3000/message/', { 'id': response.data._id, 'message': response.data.message, 'sUser': response.data.sendingUser, 'rUser': response.data.recievingUser });
            });
    }

    $scope.username = null;
    $scope.message = null;
    $scope.sendMessage = () => {
        $log.info($scope.username);
        $log.info($scope.message);
        let un = $scope.username;
        let msg = $scope.message;
        let unTrim;
        let msgTrim;

        if (un != null) {
            unTrim = un.trim();
        }

        if (msg != null) {
            msgTrim = msg.trim();
        }

        if ((un == null && msg != null) || (unTrim == "" && msgTrim != "")) {
            document.getElementById("error").innerHTML = "Please enter in an username.";
            document.getElementById('userInput').style.border = '2px solid #FF0000';
        }
        else if ((msg == null && un != null) || (msgTrim == "" && msgTrim != "")) {
            document.getElementById("error").innerHTML = "Please enter in ypur message to send.";
            document.getElementById('messageBox').style.border = '2px solid #FF0000';
        }
        else if ((un == null || unTrim == "") && (msg == null || msgTrim == "")) {
            document.getElementById("error").innerHTML = "Please enter in an username and your message to send.";
            document.getElementById('userInput').style.border = '2px solid #FF0000';
            document.getElementById('messageBox').style.border = '2px solid #FF0000';
        }
        else {
            $http.get('http://localhost:3000/user/get/' + $scope.username)
                .then(function (response) {
                    if (response.data != "" && response.data.username != acct) {
                        $http.post('http://localhost:3000/message/', { 'message': $scope.message, 'sUser': acct, 'rUser': $scope.username });
                        document.getElementById('new').style.display = 'none';
                        $window.location.href = '#!/messages';
                    }
                    else if (response.data.username == acct) {
                        document.getElementById("error").innerHTML = "You can't send messages to yourself.";
                        document.getElementById('userInput').style.border = '2px solid #FF0000';
                    }
                    else {
                        console.log(response);
                        document.getElementById("error").innerHTML = "User doesn't exist.";
                        document.getElementById('userInput').style.border = '2px solid #FF0000';
                        document.getElementById('messageBox').style.border = '2px solid #FF0000';
                    }
                });
        }
    }

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
        let loggedIn;

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