var app = angular.module('myApp', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider.
        when('/', { templateUrl: 'views/pages/home.html', controller: 'homeController' }).
        when('/login', { templateUrl: 'views/pages/login.html', controller: 'loginController' }).
        when('/signup', { templateUrl: 'views/pages/signup.html', controller: 'signupController' }).
        when('/editPassword/:username', { templateUrl: 'views/pages/edit.html', controller: 'editController' }).
        when('/account/:username', { templateUrl: 'views/pages/account.html', controller: 'accountController' }).
        when('/search/:games', { templateUrl: 'views/pages/search.html', controller: 'searchController' }).
        when('/game/:id', { templateUrl: 'views/pages/game.html', controller: 'gameController' }).
        when('/messages', { templateUrl: 'views/pages/messages.html', controller: 'messagesController' }).
        when('/messages/new', { templateUrl: 'views/pages/messages.html', controller: 'messagesController' }).
        when('/messages/sent', { templateUrl: 'views/pages/messages.html', controller: 'messagesController' }).
        when('/messages/trash', { templateUrl: 'views/pages/messages.html', controller: 'messagesController' }).
        when('/storefront', { templateUrl: 'views/pages/storefront.html', controller: 'storefrontController' }).
        when('/gameSold/:id', { templateUrl: 'views/pages/gameSold.html', controller: 'soldController' }).
        when('/sellGame', { templateUrl: 'views/pages/sell.html', controller: 'sellController' }).
        when('/buy/:id', { templateUrl: 'views/pages/purchase.html', controller: 'buyController' }).
        when('/orders', { templateUrl: 'views/pages/history.html', controller: 'historyController' }).
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

app.service('setGetGame', function () {
    var objValue = {
        data: ""
    };

    return {
        getGame: function () {
            return objValue;
        },
        setGame: function (value) {
            objValue = value;
        },
    };
});

app.service('setGetPage', function () {
    var objctValue = {
        data: ""
    };

    return {
        getPage: function () {
            return objctValue;
        },
        setPage: function (value) {
            objctValue = value;
        },
    };
});

app.controller('homeController', function ($scope, $route, $http, setGetAccount, setGetPage) {
    setGetPage.setPage('#!/');

    $scope.$emit('lisuEvent');
});

app.controller('navbarController', function ($scope, $rootScope, $window, $route, setGetAccount, setGetPage) {
    $rootScope.$on('loggedinEvent', function (event) {
        $scope.username = setGetAccount.getAccount();
    });

    $rootScope.$on('lisuEvent', function (event) {
        let acct = setGetAccount.getAccount();
        console.log(acct);
        let username = acct.data;
        console.log(username);

        document.getElementById('navbar').style.display = "block";

        if ((acct.data == "" || acct == "" || acct == undefined) && (username == "" || username == undefined)) {
            document.getElementById('lisu').style.display = "block";
            document.getElementById('loggedin').style.display = "none";
            let storageUser = $window.localStorage.getItem('user');
            console.log(storageUser);
            if (storageUser) {
                try {
                    $scope.username = JSON.parse(storageUser);
                    setGetAccount.setAccount($scope.username);
                    document.getElementById('lisu').style.display = "none";
                    document.getElementById('loggedin').style.display = "block";
                } catch (e) {
                    $window.localStorage.removeItem('user');
                }
            }
        }
        else {
            $scope.username = acct;
            document.getElementById('lisu').style.display = "none";
            document.getElementById('loggedin').style.display = "block";
        }

        let page = setGetPage.getPage();
        console.log(page);

        if (page == '#!/storefront') {
            document.getElementById('searchbar').style.display = 'none';
        }
        else {
            document.getElementById('searchbar').style.display = 'inline-block';
        }
    });

    $scope.logOut = () => {
        $window.localStorage.removeItem('user');
        setGetAccount.setAccount("");
        $window.location.reload();
    }

    $scope.searchGames = (games) => {
        let gamesTrim;

        if (games != null) {
            gamesTrim = games.trim();
        }

        if (games != null || gamesTrim == "") {
            $window.location.href = '#!/search/' + games;
        }
    }
});

app.controller('accountController', function ($scope, $http, $log, $window, $routeParams, setGetPage, setGetAccount) {
    let username = $routeParams.username

    setGetPage.setPage('#!/account/' + username);

    $scope.$emit('lisuEvent');

    $scope.user = username;

    let acct = setGetAccount.getAccount();
    console.log(acct)
    let uname = acct.data;

    if ((acct.data == "" || acct == undefined) && (uname == "" || uname == undefined)) {
        document.getElementById('otherStorefront').style.display = 'none';
    }
    else if (username == acct) {
        document.getElementById('ownStorefront').style.display = 'inline-block';
        console.log('test');
    }
    else if (username != acct) {
        document.getElementById('otherStorefront').style.display = 'inline-block';
        console.log('test');
    }

    $http.get('http://localhost:3000/sell/')
        .then(function (response) {
            $scope.selling = new Array;
            if (typeof response.data[0] == 'undefined') {
                document.getElementById('storefront').style.display = 'inline-block';
            }
            else {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].isBought == false && response.data[i].sellingUser == username) {
                        $scope.selling.push({
                            id: response.data[i]._id,
                            coverURL: response.data[i].coverURL,
                            title: response.data[i].title,
                            sUser: response.data[i].sellingUser,
                            price: response.data[i].price,
                            platform: response.data[i].platform
                        });
                        console.log(response.data[i]);
                    }
                }
            }
        })
});

app.controller('searchController', function ($scope, $http, $log, $window, $routeParams, setGetPage) {
    let gamesToSearch = $routeParams.games;

    setGetPage.setPage('#!/search/' + gamesToSearch);

    $scope.$emit('lisuEvent');

    $scope.searchParam = $routeParams.games;

    $http.get('http://localhost:3000/gameAPI/' + gamesToSearch)
        .then(function (response) {
            $scope.games = new Array;
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].category == 0) {
                    if (typeof response.data[i].platforms != 'undefined') {
                        if (response.data[i].platforms[0].name != 'Android' && response.data[i].platforms[0].name != 'iOS' && response.data[i].platforms[0].name != 'Mobile' && response.data[i].platforms[0].name != 'Web browser' && response.data[i].platforms[0].name != 'Arcade' && response.data[i].platforms[0].name != 'WiiWare') {
                            console.log(response.data[i]);
                            $scope.games.push({
                                gameID: response.data[i].id,
                                gameTitle: response.data[i].name,
                                cover: response.data[i].cover,
                                platforms: response.data[i].platforms
                            });
                        }
                    }
                }
            }
        });
});

app.controller('gameController', function ($scope, $http, $window, $routeParams, setGetGame, setGetAccount, setGetPage) {
    let rPage = setGetPage.getPage();

    if (rPage == '#!/game/' + $routeParams.id) {
        setGetPage.setPage('');
        $window.location.reload();
    }

    let gameID = $routeParams.id;

    setGetPage.setPage('#!/game/' + gameID);

    $scope.$emit('lisuEvent');

    console.log(gameID);

    let acct = setGetAccount.getAccount();
    let username = acct.data;
    if ((acct.data == "" || acct == undefined) && (username == "" || username == undefined)) {
        document.getElementsByClassName('sell')[0].style.display = 'none';
    }

    $http.get('http://localhost:3000/gameAPI/game/' + gameID)
        .then(function (response) {
            let dateStr = new Date(response.data[0].release_dates[0].date * 1000);

            let date = dateStr.toString().replace(/"/g, "")

            $scope.game = {
                gameID: response.data[0].id,
                gameTitle: response.data[0].name,
                cover: response.data[0].cover,
                platforms: response.data[0].platforms,
                ageRating: response.data[0].age_ratings,
                releaseDate: date,
                franchise: response.data[0].franchise,
                genres: response.data[0].genres,
                screenshots: response.data[0].screenshots,
                summary: response.data[0].summary
            };
            console.log($scope.game);

            if (typeof response.data[0].screenshots == 'undefined') {
                document.getElementById('screenshots').style.display = 'inline-block';
                // document.getElementsByClassName('screenshots')[0].style.display = 'none';
            }
            if (typeof response.data[0].summary == 'undefined') {
                document.getElementById('summary').style.display = 'inline-block';
                // document.getElementsByClassName('summary')[0].style.display = 'none';
            }

        });

    $http.get('http://localhost:3000/sell/' + gameID)
        .then(function (response) {
            $scope.selling = new Array;
            if (typeof response.data[0] == 'undefined') {
                document.getElementById('storefront').style.display = 'inline-block';
                // document.getElekmentsByClassName('storefront')[0].style.display = 'none';
            }
            else {
                for (let i = 0; i < response.data.length; i++) {
                    if (typeof response.data[i].coverURL != 'undefined' || typeof response.data[i].platform != 'undefined' && response.data[i].isBought == false) {
                        $scope.selling.push({
                            id: response.data[i]._id,
                            coverURL: response.data[i].coverURL,
                            title: response.data[i].title,
                            sUser: response.data[i].sellingUser,
                            price: response.data[i].price,
                            platform: response.data[i].platform
                        });
                    }
                    else {
                        $http.delete('http://localhost:3000/sell/' + response.data[i]._id);
                        if (typeof response.data[0] == 'undefined') {
                            document.getElementById('storefront').style.display = 'inline-block';
                        }
                    }
                }
            }
        })

    $scope.sellGame = function (gameID, gameTitle, platforms, coverURL) {
        let game = {
            gameID: gameID,
            gameTitle: gameTitle,
            platforms: platforms,
            coverURL: coverURL
        };

        setGetGame.setGame(game);

        $window.location.href = "#!/sellGame";
    }
});

app.controller('storefrontController', function ($scope, $route, $http, $window, setGetAccount, setGetPage) {

    setGetPage.setPage('#!/storefront');

    $scope.$emit('lisuEvent');

    $http.get('http://localhost:3000/sell/')
        .then(function (response) {
            $scope.selling = new Array;
            if (typeof response.data[0] == 'undefined') {
                document.getElementById('storefront').style.display = 'inline-block';
                // document.getElementsByClassName('storefront')[0].style.display = 'none';
            }
            else {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].isBought == false) {
                        $scope.selling.push({
                            id: response.data[i]._id,
                            coverURL: response.data[i].coverURL,
                            title: response.data[i].title,
                            sUser: response.data[i].sellingUser,
                            price: response.data[i].price,
                            platform: response.data[i].platform
                        });
                        console.log(response.data[i]);
                    }
                    // else {
                    //     $http.delete('http://localhost:3000/sell/' + response.data[i]._id);
                    //     if (typeof response.data[0] == 'undefined') {
                    //         document.getElementById('storefront').style.display = 'inline-block';
                    //     }
                    // }
                }
            }
        })
});

app.controller('soldController', function ($scope, $http, $log, $window, $routeParams, setGetGame, setGetAccount, setGetPage) {
    setGetPage.setPage('#!/storefront')

    $scope.$emit('lisuEvent');

    let id = $routeParams.id

    setGetPage.setPage('#!/gameSold/' + id)

    $http.get('http://localhost:3000/sell/get/' + id)
        .then(function (response) {
            console.log(response.data);
            $scope.selling = {
                id: response.data._id,
                gameID: response.data.gameID,
                coverURL: response.data.coverURL,
                title: response.data.title,
                sUser: response.data.sellingUser,
                price: response.data.price,
                platform: response.data.platform,
                dOption: response.data.deliveryOption,
                desc: response.data.desc
            };

            if (response.data.desc == null || response.data.desc == "") {
                document.getElementById('desc').style.display = 'inline-block';
            }

            let acct = setGetAccount.getAccount();
            let username = acct.data;

            if (response.data.sellingUser == acct) {
                document.getElementById('buybtn').style.display = 'none';
                document.getElementById('removebtn').style.display = 'inline-block';
                document.getElementById('noUserText').style.display = 'none';
            }
            else if ((acct.data == "" || acct == "" || acct == undefined) && (username == "" || username == undefined)) {
                document.getElementById('buybtn').style.display = 'none';
                document.getElementById('removebtn').style.display = 'none';
                document.getElementById('noUserText').style.display = 'inline-block';
            }
        })

    $scope.filterQuery = { fil: 'title' };

    $scope.buyGame = (id) => {
        console.log(id);
        $window.location.href = '#!/buy/' + id;
    }

    $scope.removeItem = () => {
        let page = setGetPage.getPage();

        $http.delete('http://localhost:3000/sell/' + id);
        $window.location.href = '#!/storefront';
    }
});

app.controller('buyController', function ($scope, $http, $log, $window, $routeParams, setGetGame, setGetAccount, setGetPage) {
    let getPage = setGetPage.getPage();

    setGetPage.setPage('#!/storefront')

    $scope.$emit('lisuEvent');

    if (getPage.data == "" || getPage == undefined) {
        setGetPage.setPage('#!/');
    }

    $scope.$emit('lisuEvent');

    let id = $routeParams.id;
    let price;

    $http.get('http://localhost:3000/sell/get/' + id)
        .then(function (response) {
            $scope.selling = {
                id: response.data._id,
                title: response.data.title,
                price: response.data.price,
            };

            price = $scope.selling.price
        });


    $scope.gameBought = (id) => {
        let bUser = setGetAccount.getAccount();
        $http.put('http://localhost:3000/sell/' + id, { 'bUser': bUser })
        $window.location.href = '#!/';
    }

    paypal.Buttons({

        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: price
                    }
                }]
            });
        },

        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                alert('Transaction completed by ' + details.payer.name.given_name + '!');
            });
        }


    }).render('#paypal-button-container');

});

app.controller('sellController', function ($scope, $http, $log, $window, $routeParams, setGetGame, setGetAccount, setGetPage) {
    let getPage = setGetPage.getPage();

    setGetPage.setPage('#!/storefront')

    $scope.$emit('lisuEvent');

    let game = setGetGame.getGame();
    let gameData = game.data;
    if ((game.data == "" || game == undefined) && (gameData == "" || gameData == undefined)) {
        $window.location.href = '#!/'
    }
    else {
        $scope.game = {
            gameID: game.gameID,
            gameTitle: game.gameTitle,
            platforms: game.platforms,
            coverURL: game.coverURL
        };

        $scope.deliveryOptions = ['Shipping', 'Pick-Up', 'Code']

        $scope.title = null;
        $scope.price = null;
        $scope.platform = null;
        $scope.desc = null;
        $scope.delivery = null;
        $scope.sellGame = function () {
            $log.info($scope.title);
            $log.info($scope.price);
            $log.info($scope.platform);
            $log.info($scope.desc);
            $log.info($scope.delivery)

            document.getElementById('priceInput').style.border = 'none';
            document.getElementById('sel1').style.border = 'none';
            document.getElementById('sel2').style.border = 'none';
            document.getElementById('req').style.color = '#000000';
            document.getElementById('error').innerHTML = '';

            let sellGame = true;

            if ($scope.price == null) {
                document.getElementById('priceInput').style.border = '2px solid #FF0000';
                document.getElementById('req').style.color = '#FF0000';
                sellGame = false;
            }
            if ($scope.platform == null) {
                document.getElementById('sel1').style.border = '2px solid #FF0000';
                document.getElementById('req').style.color = '#FF0000';
                sellGame = false;
            }
            if ($scope.delivery == null) {
                document.getElementById('sel2').style.border = '2px solid #FF0000';
                document.getElementById('req').style.color = '#FF0000';
                sellGame = false;
            }

            if ($scope.price < 0.99 && $scope.price != null) {
                document.getElementById("error").innerHTML = "You can't have the price of the item be $0.98 or less";
                document.getElementById('priceInput').style.border = '2px solid #FF0000';
                sellGame = false;
            }

            if ($scope.title == null || $scope.title.trim() == "") {
                $scope.title = game.gameTitle;
            }

            let user = setGetAccount.getAccount();
            let page = getPage;

            if (sellGame == true) {
                $http.post('http://localhost:3000/sell/', { 'cURL': game.coverURL, 'gameID': game.gameID, 'title': $scope.title, 'desc': $scope.desc, 'price': $scope.price, 'platform': $scope.platform, 'sUser': user, 'dOption': $scope.delivery });

                $window.location.href = page;
            };
        };
    }
});

app.controller('historyController', function ($scope, $http, $rootScope, $window, $route, setGetAccount, setGetPage) {
    $scope.$emit('lisuEvent');

    let acct = setGetAccount.getAccount();
    let username = acct.data;
    if ((acct.data == "" || acct == undefined) && (username == "" || username == undefined)) {
        $window.location.href = '#!/'
    }

    $http.get('http://localhost:3000/sell/')
        .then(function (response) {
            $scope.bought = new Array;
            let hasBought = false;
            for (let i = 0; i < response.data.length; i++) {
                if (response.data[i].isBought == true && response.data[i].buyingUser == acct) {
                    hasBought = true;
                    $scope.bought.push({
                        id: response.data[i]._id,
                        gameID: response.data[i].gameID,
                        coverURL: response.data[i].coverURL,
                        title: response.data[i].title,
                        price: response.data[i].price,
                        dateSold: response.data[i].dateSold,
                    });
                }
            }
            if (hasBought == false) {
                document.getElementById('noPurch').style.display = 'inline-block'
            }
            console.log(response);
        });

    let date = new Date();

    console.log(date);
});

app.controller('messagesController', function ($scope, $http, $log, $location, $window, $route, setGetAccount) {
    $scope.$emit('lisuEvent');
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
                        $scope.messages.unshift({
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
                        $scope.messages.unshift({
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

    $scope.deleteMessage = function (messageID) {
        $http.get('http://localhost:3000/message/' + messageID)
            .then(function (response) {
                $http.put('http://localhost:3000/message/', { 'id': response.data._id, 'message': response.data.message, 'sUser': response.data.sendingUser, 'rUser': response.data.recievingUser });
                $route.reload();
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

app.controller('loginController', function ($scope, $http, $log, setGetAccount, setGetPage, $window, $routeParams) {
    document.getElementById('navbar').style.display = "none";
    let getPage = setGetPage.getPage();
    if (getPage.data == "" || getPage == undefined) {
        setGetPage.setPage('#!/');
    }
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
                        $window.localStorage.setItem('user', JSON.stringify($scope.username));
                        setGetAccount.setAccount($scope.username);
                        let page = setGetPage.getPage();
                        console.log(page);
                        $window.location.href = page;
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

app.controller('signupController', function ($scope, $http, $log, setGetAccount, setGetPage, $window, $routeParams) {
    document.getElementById('navbar').style.display = "none";
    let getPage = setGetPage.getPage();
    // console.log(getPage);
    if (getPage.data == "" || getPage == undefined) {
        setGetPage.setPage('#!/');
    }
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
                        $http.post('http://localhost:3000/message/', { 'message': 'Welcome ' + $scope.username + '!\n Thanks for using RetroEZ. We hope that you will like you experience here on this site. You can search, buy, and sell games. Thanks, RetroEZ Staff', 'sUser': 'RetroEZ', 'rUser': $scope.username });
                        $window.localStorage.setItem('user', JSON.stringify($scope.username));
                        setGetAccount.setAccount($scope.username);
                        let page = setGetPage.getPage();
                        console.log(page);
                        $window.location.href = page;
                    }
                });
        }
    }
});

app.controller('editController', function ($scope, $http, $log, setGetAccount, setGetPage, $window, $routeParams) {
    document.getElementById('navbar').style.display = "none";

    $scope.oldPassword = null;
    $scope.newPassword = null;
    $scope.confirmPassword = null;
    $scope.changePassword = () => {
        
    }
});