(function() {
    'use strict';

    angular
        .module('tcb_system.first', ['ui.router'])
        .config(ConfigurationConfig);

    ConfigurationConfig.$inject = ['$stateProvider'];

    function ConfigurationConfig($stateProvider) {
        $stateProvider
            .state('tcb_system.first', {
                url: '/first',
                data: {
                    title: '首页'
                },
                views: {
                    'content@tcb_system': {
                        templateUrl: 'app/views/first/first.html'
                    }
                },
                ncyBreadcrumb: {
                    label: '首页'
                }
            })

    }

})();