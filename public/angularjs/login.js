/**
 * Created by Chaitu on 10/29/2016.
 */

var myApp=angular.module('login',['ui.router']);
myApp.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $stateProvider.state('login', {
        url: '/',
        views: {
            'header': {
                templateUrl: 'templates/header.html',
            },
            'content': {
                templateUrl: 'templates/login.html',

            }
        }
    })

    $stateProvider.state('signup', {
        url: '/register',
        views: {
            'header': {
                templateUrl: 'templates/header.html',
            },
            'content': {
                templateUrl: 'templates/signup.html',

            }
        }
    })


});

myApp.controller('signin',function($http,$scope,$state){
    $scope.invalid_login=true;
    $scope.validlogin=true;
    $scope.submit=function(){
        $http({
            method:"post",
            url:'/checkSignin',
            data:{
                  'username':$scope.username,
                  'password':$scope.password,
            }

        }).success(function(data){
            console.log(data);
            if(data.statusCode=='401')
            {
                $scope.invalid_login=false;
                $scope.validlogin=true;
            }
            else
            {
                  window.location.assign('/gethomepage');
            }

        })
    }
})


myApp.controller('register',function($http,$scope,$state){
    $scope.signupformsubmit=function() {
        $http({
            method: 'post',
            url: '/userregistration',
            data: {
                'firstname':$scope.forminfo.firstname,
                'lastname': $scope.forminfo.lastname,
                'email':    $scope.forminfo.email,
                'password': $scope.forminfo.password
            }
        }).success(function(data) {
            if(data.data=="please enter all the fields") {
                $scope.fieldsRequired="please enter all the fields";
            }
            if(data.data=="password should be atleast 6 characters")
            {
                $scope.invalidPassword="please enter atleast 6 characters";
            }
            if(data.data=="user successfully added")
            {
                $scope.userAdded="user successfully added";
            }


        });
    };


})



