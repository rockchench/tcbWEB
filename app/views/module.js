(function() {
    "use strict";


    angular.module('app.tcb_system', [
            'ui.router',
            'tcb_system.first',
            'tcb_system.second',
        ])
        .config(SystemConfig);


    SystemConfig.$inject = ['$stateProvider', '$urlRouterProvider'];
    // 登出跳转
    function SystemConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('tcb_system', {
                abstract: true,
                url: '/tcb_system',
                views: {
                    root: {
                        templateUrl: 'app/views/layout.html',
                        controller: function(HeaderModel, Version) {
                            var vm = this;
                            vm.HeaderModel = HeaderModel;
                            vm.HeaderModel.Version = Version;
                        },
                        controllerAs: 'Layout'
                    }
                },
                ncyBreadcrumb: {
                    label: ''
                }
            })
    }
})();