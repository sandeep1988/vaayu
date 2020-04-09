
// Services 
// <<<<<<< HEAD
// angular.module('app').constant('BASE_URL', 'http://apiptsdemo.devmll.com:8001/api/v1/');
// angular.module('app').constant('BASE_URL_8002', 'http://apiptsdemo.devmll.com/');
// angular.module('app').constant('BASE_URL_API_8002', 'http://apiptsdemo.devmll.com:8002/api/v1/');
// angular.module('app').constant('BASE_URL_API_8003', 'http://apiptsdemo.devmll.com:8003/api/v1/');
// angular.module('app').constant('BASE_URL_RUBY', 'http://apiptsdemo.devmll.com/api/v2/');
// =======

const PROD_OPERATOR_URL = 'operator.mllvaayu.com';
const SANDBOX_OPERATOR_URL = 'sandboxoperator.mllvaayu.com';
const QA_OPERATOR_URL = 'qaoperator.mllvaayu.com';
const SECURITY_OPERATOR_URL = 'operatorptsdemo.devmll.com';
const PRE_PROD_OPERATOR_URL = 'preprodoperator.mllvaayu.com'

if (document.domain === PROD_OPERATOR_URL) {
    let NODE_API_URL = 'http://api.mllvaayu.com';
    angular.module('app').constant('BASE_URL_MAIN', NODE_API_URL+'/api/v1/');
    angular.module('app').constant('BASE_URL', NODE_API_URL+':8001/api/v1/');
    angular.module('app').constant('BASE_URL_8002', NODE_API_URL + '/');
    angular.module('app').constant('BASE_URL_API_8002', NODE_API_URL+':8002/api/v1/');
    angular.module('app').constant('BASE_URL_API_8003', NODE_API_URL+':8003/api/v1/');
    angular.module('app').constant('BASE_URL_API_8004', NODE_API_URL+':8004/api/v1/');
    angular.module('app').constant('BASE_URL_API_8005', NODE_API_URL+':8005/api/v1/');
    angular.module('app').constant('BASE_URL_RUBY', 'http://'+PROD_OPERATOR_URL+'/api/v2/');    
    
} else if (document.domain === SANDBOX_OPERATOR_URL ) {
    let NODE_API_URL = 'http://sandboxapi.mllvaayu.com';
    angular.module('app').constant('BASE_URL_MAIN', NODE_API_URL+'/api/v1/');
    angular.module('app').constant('BASE_URL', NODE_API_URL+':8001/api/v1/');
    angular.module('app').constant('BASE_URL_8002', NODE_API_URL + '/');
    angular.module('app').constant('BASE_URL_API_8002', NODE_API_URL+':8002/api/v1/');
    angular.module('app').constant('BASE_URL_API_8003', NODE_API_URL+':8003/api/v1/');
    angular.module('app').constant('BASE_URL_API_8004', NODE_API_URL+':8004/api/v1/');
    angular.module('app').constant('BASE_URL_API_8005', NODE_API_URL+':8005/api/v1/');
    angular.module('app').constant('BASE_URL_RUBY', 'http://'+SANDBOX_OPERATOR_URL+'/api/v2/'); 

} else if (document.domain === QA_OPERATOR_URL) {
    let NODE_API_URL = 'http://qaapi.mllvaayu.com';
    angular.module('app').constant('BASE_URL_MAIN', NODE_API_URL+'/api/v1/');
    angular.module('app').constant('BASE_URL', NODE_API_URL+':8001/api/v1/');
    angular.module('app').constant('BASE_URL_8002', NODE_API_URL + '/');
    angular.module('app').constant('BASE_URL_API_8002', NODE_API_URL+':8002/api/v1/');
    angular.module('app').constant('BASE_URL_API_8003', NODE_API_URL+':8003/api/v1/');
    angular.module('app').constant('BASE_URL_API_8004', NODE_API_URL+':8004/api/v1/');
    angular.module('app').constant('BASE_URL_API_8005', NODE_API_URL+':8005/api/v1/');
    angular.module('app').constant('BASE_URL_RUBY', 'http://'+QA_OPERATOR_URL+'/api/v2/'); 

} else if (document.domain === SECURITY_OPERATOR_URL || document.domain === 'localhost') {
    // let NODE_API_URL = 'http://apiptsdemo.devmll.com';
    let NODE_API_URL = 'http://apiptsdemo.devmll.com';
    angular.module('app').constant('BASE_URL_MAIN', NODE_API_URL+'/api/v1/');
    angular.module('app').constant('BASE_URL', NODE_API_URL+':8001/api/v1/');
    angular.module('app').constant('BASE_URL_8002', NODE_API_URL + '/');
    angular.module('app').constant('BASE_URL_API_8002', NODE_API_URL+':8002/api/v1/');
    angular.module('app').constant('BASE_URL_API_8003', NODE_API_URL+':8003/api/v1/');
    angular.module('app').constant('BASE_URL_API_8004', NODE_API_URL+':8004/api/v1/');
    angular.module('app').constant('BASE_URL_API_8005', NODE_API_URL+':8005/api/v1/');
    angular.module('app').constant('BASE_URL_RUBY', 'http://'+SECURITY_OPERATOR_URL+'/api/v2/'); 
    
}else if (document.domain === PRE_PROD_OPERATOR_URL) {
    // let NODE_API_URL = 'http://apiptsdemo.devmll.com';
    let NODE_API_URL = 'http://preprodapi.mllvaayu.com';
    angular.module('app').constant('BASE_URL_MAIN', NODE_API_URL+'/api/v1/');
    angular.module('app').constant('BASE_URL', NODE_API_URL+':8001/api/v1/');
    angular.module('app').constant('BASE_URL_8002', NODE_API_URL + '/');
    angular.module('app').constant('BASE_URL_API_8002', NODE_API_URL+':8002/api/v1/');
    angular.module('app').constant('BASE_URL_API_8003', NODE_API_URL+':8003/api/v1/');
    angular.module('app').constant('BASE_URL_API_8004', NODE_API_URL+':8004/api/v1/');
    angular.module('app').constant('BASE_URL_API_8005', NODE_API_URL+':8005/api/v1/');
    angular.module('app').constant('BASE_URL_RUBY', 'http://'+SECURITY_OPERATOR_URL+'/api/v2/'); 
    
} else {//if (document.domain === SECURITY_OPERATOR_URL) 
    // let NODE_API_URL = 'http://apiptsdemo.devmll.com';
    let NODE_API_URL = 'http://qaapi.mllvaayu.com';
    angular.module('app').constant('BASE_URL_MAIN', NODE_API_URL+'/api/v1/');
    angular.module('app').constant('BASE_URL', NODE_API_URL+':8001/api/v1/');
    angular.module('app').constant('BASE_URL_8002', NODE_API_URL + '/');
    angular.module('app').constant('BASE_URL_API_8002', NODE_API_URL+':8002/api/v1/');
    angular.module('app').constant('BASE_URL_API_8003', NODE_API_URL+':8003/api/v1/');
    angular.module('app').constant('BASE_URL_API_8004', NODE_API_URL+':8004/api/v1/');
    angular.module('app').constant('BASE_URL_API_8005', NODE_API_URL+':8005/api/v1/');
    angular.module('app').constant('BASE_URL_RUBY', 'http://'+SECURITY_OPERATOR_URL+'/api/v2/'); 
    
} 

// angular.module('app').constant('BASE_URL', 'http://api.mllvaayu.com:8001/api/v1/');
// angular.module('app').constant('BASE_URL_8002', 'http://api.mllvaayu.com/');
// angular.module('app').constant('BASE_URL_API_8002', 'http://api.mllvaayu.com:8002/api/v1/');
// angular.module('app').constant('BASE_URL_API_8003', 'http://api.mllvaayu.com:8003/api/v1/');
// angular.module('app').constant('BASE_URL_RUBY', 'http://operator.mllvaayu.com/api/v2/');

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