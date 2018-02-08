/**
 * Created by huangyao on 2017/7/14.
 */
var app = angular.module('myApp',
    [
        'ui.router',
        'secondModule',
        'firstModule'
    ]);

app.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('first', {
            url: '/first',
            templateUrl: 'views/first/first.html',
            controller: 'firstController'
        })
        .state('second', {
            url: '/second',
            templateUrl: 'views/second/second.html',
            controller: 'secondController'
        })

    $urlRouterProvider.otherwise('first')
})