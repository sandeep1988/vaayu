angular.module('app').factory('ConstraintService', ['$resource', 'BASE_URL_8002', 'BASE_URL', 'BASE_URL_API_8002', 'BASE_URL_API_8003', 'BASE_URL_MAIN',
  function ($resource, BASE_URL_8002, BASE_URL, BASE_URL_API_8002, BASE_URL_API_8003, BASE_URL_MAIN) {
    return $resource(BASE_URL_MAIN + 'ConstraintService', {}, {

      getSiteList: {
        url: BASE_URL_MAIN + 'getAllSiteList',
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
        url: BASE_URL_MAIN + 'zones/:siteId',
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
      getConfigCutoff: {
        url: BASE_URL_8002 + 'getConfigRatorCutoff/:id',
        method: 'GET'
      },
      postConfigCutoff: {
        url: BASE_URL_8002 + 'postConfigRatorCutoff',
        method: 'POST'
      }
     
    });
  }]);