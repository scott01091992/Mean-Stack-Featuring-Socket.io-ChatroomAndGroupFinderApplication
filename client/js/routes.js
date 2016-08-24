myApp.config(function ($routeProvider){
  $routeProvider
    .when('/home',{
      templateUrl: '../partials/home.html'
    })
    .when('/register',{
      templateUrl: '../partials/register.html'
    })
    .when('/profile',{
      templateUrl: '../partials/profile.html'
    })
    .when('/lfg',{
      templateUrl: '../partials/lfg.html'
    })
    .when('/chatroom/:id',{
      templateUrl: '../partials/chatroom.html'
    })
    .when('/contact',{
      templateUrl: '../partials/contact.html'
    })
    .when('/friends',{
      templateUrl: '../partials/friends.html'
    })
    .when('/login',{
      templateUrl: '../partials/login.html'
    })
    .when('/discussions',{
      templateUrl: '../partials/discussions.html'
    })
    .when('/room',{
      templateUrl: '../partials/create_room.html'
    })
     .when('/dev',{
      templateUrl: '../partials/dev_tools.html'
    })
    .otherwise({
      redirectTo: '/home'
    })
});
