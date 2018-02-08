(function() {
    'use strict';

    angular
        .module('tcb_system.second', ['ui.router'])
        .config(ConfigurationConfig);

    ConfigurationConfig.$inject = ['$stateProvider'];

    function ConfigurationConfig($stateProvider) {
        $stateProvider
            .state('tcb_system.second', {
                url: '/second',
                data: {
                    title: '首页2'
                },
                views: {
                    'content@tcb_system': {
                        templateUrl: 'app/views/second/second.html'
                    }
                },
                ncyBreadcrumb: {
                    label: '首页2'
                }
            })

    }

})();