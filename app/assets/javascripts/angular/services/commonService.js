
// Services 
angular.module('app').constant('BASE_URL', 'http://api.mllvaayu.com:8001/api/v1/');
angular.module('app').constant('BASE_URL_8002', 'http://api.mllvaayu.com/');
angular.module('app').constant('BASE_URL_API_8002', 'http://api.mllvaayu.com:8002/api/v1/');
angular.module('app').constant('BASE_URL_API_8003', 'http://api.mllvaayu.com:8003/api/v1/');
angular.module('app').constant('BASE_URL_RUBY', 'http://operator.mllvaayu.com/api/v2/');

// angular.module('app').constant('BASE_URL', 'http://apiptsdemo.devmll.com:8001/api/v1/');
// angular.module('app').constant('BASE_URL_8002', 'http://apiptsdemo.devmll.com/');
// angular.module('app').constant('BASE_URL_API_8002', 'http://apiptsdemo.devmll.com:8002/api/v1/');
// angular.module('app').constant('BASE_URL_API_8003', 'http://apiptsdemo.devmll.com:8003/api/v1/');
// angular.module('app').constant('BASE_URL_RUBY', 'http://apiptsdemo.devmll.com/api/v2/');

angular.module('app').factory('SessionService', function() {
    // var _data ={
    //     uid:'deekshithmech@gmail.com',
    //     access_token:'h-Hen_PE9YDkOTa-HLjMVw',
    //     client:'A50BtzCIieAvpcTk2450ew'
    // }

    // var _data2 ={
    //     uid:'deekshithmech@gmail.com',
    //     access_token:'aFZIMX0-5uAuKvorJn6wVg',
    //     client:'jM0YUtfxE9aOBj-wisoGzw'
    // }
      
    var _data2 ={
        custId : 1,
        uid:'deekshith.kgr95@gmail.com',
        access_token:'a6tCfF5T7HVIdx8Czd6I7w',
        client:'osUe4ObG0a1QvZ4R9-t6yg'
    }
    
    return _data2;
});