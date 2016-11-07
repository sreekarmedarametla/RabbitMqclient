/**
 * Created by Chaitu on 10/30/2016.
 */


var myApp=angular.module('home',['ui.router','ngStorage']);
myApp.config(function($stateProvider,$urlRouterProvider,$locationProvider) {
    $locationProvider.html5Mode(true);

    //state for homepage brought you here from index page in routes
    $stateProvider.state('homepage', {
        url: '/gethomepage',
        views: {
            'header': {
                templateUrl: 'templates/headerhomepage.html',
            },
            'content': {
                templateUrl: 'templates/homepage.html',
            }
        }
    })


    $stateProvider.state('cart', {
        url: '/cart',
        views: {
            'header': {
                templateUrl: 'templates/headerhomepage.html',
            },
            'content': {
                templateUrl: 'templates/cart.html',
            }
        }
    })

    $stateProvider.state('profile',{
        url:'/profile',
        views:{
            'header':{
                templateUrl:'templates/headerhomepage.html',
            },

            content:{
                templateUrl:'templates/profile.html',
            }
        }

    })

    $stateProvider.state('logout',{
        url:'/logout',
        views:{
            'content':{
                templateUrl:'templates/logout.html',
            }
        }
    })



    $stateProvider.state('advertisement', {
        url: '/advertisement',
        views: {
            'header': {
                templateUrl: 'templates/headerhomepage.html',
            },
            'content': {
                templateUrl: 'templates/advertisement.html',
            }
        }
    })
});
    myApp.controller('home',function($scope,$state,$http) {
        $scope.data = [];
        $scope.loadData = function () {
            $http({
                method: 'get',
                url: '/loadhomepage',
            }).success(function (res) {
                $scope.data = res;
                console.log(res);
            });
        }
    });


//same but different type

myApp.controller('product',function($scope,$http,$localStorage){
    $scope.getProduct=function(product){
        $localStorage.cartProducts.push(product);
        console.log($localStorage.cartProducts);
    }
})


myApp.controller('cartcontroller',function($scope,$localStorage) {
    //for loading the cart
    $scope.loadCart = function (){
        console.log($localStorage.cartProducts);
        //console.log("value fucking is"+JSON.stringify($localStorage.cartProducts[0].productid));
        //console.log("testing looping");
        $localStorage.cartProducts.forEach(function (arrayItem) {
            console.log(arrayItem.productid);
        })
        $scope.cartData = $localStorage.cartProducts;
        console.log("length of cart is" + $localStorage.cartProducts.length);
    }
    //for deleting from cart
    $scope.deleteItem = function (value,x) {
        var id = value.productid;
        $localStorage.cartProducts.forEach(function (arrayItem) {
            console.log(arrayItem.productid);
            if (id == arrayItem.productid) {
                console.log("inside if loop");
                var index = $localStorage.cartProducts.indexOf(value);
                console.log("index is" + index);
                $localStorage.cartProducts.splice(index, 1);
                sum=sum-(value.productprice*x);
                $scope.totalprice=sum;
            }
        })
        console.log(" after deletion cart length is" + $localStorage.cartProducts.length);
        /*$scope.calculateTotal(x)*/
    }
    $scope.totalprice = 0;
    var arr = [];
    var i = 0;
    var quantityArray = [];






    $scope.calculateTotal = function (x, value) {
        console.log(value);
        $scope.quantitySelc = x;
        quantityArray[i] = x;
        arr[i] = value.productprice * $scope.quantitySelc;
        console.log("checking " + arr[i]);
        i = i + 1;
        var sum = 0;
        for (i = 0; i < arr.length; i++) {
            sum = sum + arr[i];
        }
        console.log("total sum is " + sum);
        $scope.totalprice = sum;
        console.log("updating quantity");
        var index = $localStorage.cartProducts.indexOf(value);
        console.log($localStorage.cartProducts[index]);
        $localStorage.cartProducts[index].quantity = $localStorage.cartProducts[index].quantity - $scope.quantitySelc;
        console.log("updated value is " + $localStorage.cartProducts[index].quantity);
    }

});

//logout controller

myApp.controller('logout',function($scope,$state,$http){
    $scope.logout=function () {
        $http({
            method:'get',
            url:'/logout'

        }).success(function(data){
            console.log(data);
            $state.go('logout');
        })


    }

})

myApp.controller('redirectLogin',function($scope,$state){
    $scope.redirectLogin=function() {
        console.log("over here in redirecting state");
        window.location.assign('/');
    }

})


