angular.module('app').factory('ConstraintService', ['$resource', 'BASE_URL_8002', 'BASE_URL', 'BASE_URL_API_8002', 'BASE_URL_API_8003',
  function ($resource, BASE_URL_8002, BASE_URL, BASE_URL_API_8002, BASE_URL_API_8003) {
    return $resource(BASE_URL + 'ConstraintService', {}, {

      getSiteList: {
        url: BASE_URL + 'getAllSiteList',
        method: "POST"
      },

      upsertConstraint: {
        url: BASE_URL_8002 + 'constraint/insert',
        method: "POST"
      },

      getAllConstraints: {
        url: BASE_URL_8002 + 'constraint/getall/site/:id',
        method: 'GET',
      },

      getZones: {
        url: BASE_URL_API_8003 + 'zones/:siteId',
        method: 'GET',
      },

      createZones: {
        url: BASE_URL_8002 + 'createZones',
        method: 'POST',
      },

      delete_zone: {
        url: BASE_URL_8002 + 'delete_zone/:zoneId',
        method: 'GET',
      },
     
    });
  }]);