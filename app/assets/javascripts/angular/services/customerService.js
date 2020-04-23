angular.module('app').factory('CustomerService', ['$resource', 'BASE_URL_8002', 'BASE_URL', 'BASE_URL_API_8002', 'BASE_URL_API_8005', 'BASE_URL_MAIN',
   function ($resource, BASE_URL_8002, BASE_URL, BASE_URL_API_8002, BASE_URL_API_8005, BASE_URL_MAIN) {
      return $resource(BASE_URL_8002 + 'customerList', {}, {


         getAllCustomers: {
            url: 'http://localhost:8020/api/v1/' + 'customers',
            method: "GET"
         },

      })
   }])