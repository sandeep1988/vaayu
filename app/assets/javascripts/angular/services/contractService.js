angular.module('app').factory('ContractService', ['$resource', 'BASE_URL_8002', 'BASE_URL', 'BASE_URL_API_8002',
  function ($resource, BASE_URL_8002, BASE_URL, BASE_URL_API_8002) {
    return $resource(BASE_URL + 'contract', {}, {
      getSiteList: {
        url: BASE_URL + 'getAllSiteList',
        method: "POST"
      },

      getBAList: {
        url: BASE_URL_8002 + 'induction/getAllBaList',
        method: "POST"
      },

      getAllContracts: {
        url: BASE_URL_8002 + 'getContractListByCustId?custId=1&custType=' + ':tabType' + '&siteId=' + ':urlEnd',
        method: "GET"
      },
    });
  }]);