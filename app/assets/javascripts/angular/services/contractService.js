angular.module('app').factory('ContractService', ['$resource', 'BASE_URL_8002', 'BASE_URL', 'BASE_URL_API_8002','BASE_URL_MAIN',
  function ($resource, BASE_URL_8002, BASE_URL, BASE_URL_API_8002,BASE_URL_MAIN) {
    return $resource(BASE_URL_MAIN + 'contract', {}, {
      getSiteList: {
        url: BASE_URL_MAIN + 'getAllSiteList',
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