
// Services 
angular.module('app').constant('BASE_URL', 'http://vaayuuat.devmll.com:8001/api/v1/');
angular.module('app').constant('BASE_URL_8002', 'http://vaayuuat.devmll.com/');
angular.module('app').constant('BASE_URL_API_8002', 'http://vaayuuat.devmll.com:8002/api/v1/');
angular.module('app').constant('BASE_URL_RUBY', 'http://alb-uat10-1592161168.ap-south-1.elb.amazonaws.com/api/v2/');

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
        uid:'deekshithmech@gmail.com',
        access_token:'Lv-ew8BhWt-IpeHnaDmAPQ',
        client:'WAN2a7tMxvEKOgFAUB2lpA'
    }
    
    return _data2;
});