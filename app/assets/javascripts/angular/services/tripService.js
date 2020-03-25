
angular.module('app').factory('SiteService', ['$resource','BASE_URL','SessionService','BASE_URL_MAIN',
    function ($resource,BASE_URL,SessionService,BASE_URL_MAIN) {
        return $resource(BASE_URL_MAIN+'getAllSiteList', {}, {
            query: { method: "GET", isArray: true },
            create: { method: "POST"},
            get: { 
                method: "POST",
                headers: { 
                    'uid': SessionService.uid,
                    'access_token': SessionService.access_token,
                    'client':SessionService.client
                }
            },
            remove: { method: "DELETE"},
            update: { method: "PUT"}
        });
}]);

angular.module('app').factory('GuardService', ['$resource','BASE_URL','BASE_URL_MAIN',
    function ($resource,BASE_URL, BASE_URL_MAIN) {
        return $resource(BASE_URL_MAIN+'guard', {}, {
            query: { method: "GET", isArray: true },
            create: { method: "POST"},
            get: { method: "POST"},
            remove: { method: "DELETE"},
            update: { method: "PUT"}
        });
}]);


angular.module('app').factory('DriverService', ['$resource','BASE_URL_RUBY',
    function ($resource,BASE_URL_RUBY) {
        return $resource(BASE_URL_RUBY+'drivers', {}, {
            query: { method: "GET"},
            create: { method: "POST"},
            get:  { method: "GET"},
            remove: { method: "DELETE"},
            update: { method: "PUT"}
        });
}]);

