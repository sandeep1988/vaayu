angular.module('app').controller('customerController', function (
   DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder,
   $scope, CustomerService, RouteService, RouteUpdateService, $http,
   AutoAllocationService, BASE_URL_API_8005, BASE_URL_8002, BASE_URL_MAIN,
   FinalizeService, RouteStaticResponse, ToasterService, SessionService, BASE_URL_API_8002, TripboardService) {

   $scope.init = function () {
      console.log('customerController init')
      getAllCustomers()
      // $scope.dtOptions = DTOptionsBuilder.newOptions()
      //    .withOption('order', [1, 'desc']);
   }

   function getAllCustomers() {
      CustomerService.getAllCustomers(res => {
         // console.log('getAllCustomers: ', res)
         if (res['success']) {
            $scope.customers = res.data
            console.log($scope.customers[0])

         } else {
            ToasterService.showSuccess('Error', res['message']);
         }
      }, err => {
         ToasterService.showSuccess('Error', err);
      })
   }

   $scope.activateCustomer = (c) => {

      // console.log(c)
   }

   $scope.submit = () => {
      $scope.showPopup = false;
      if ($scope.action_type === 'ADD') {

      } else if ($scope.action_type === 'EDIT') {

      } else {

      }
   }

   $scope.closePopup = () => { $scope.showPopup = false; }

   $scope.addCustomer = () => {
      $scope.form_fields = angular.copy($scope.form_fields_fresh)
      $scope.showPopup = true;
      $scope.action_type = 'ADD'
   }

   $scope.viewCustomer = (c) => {
      $scope.action_type = 'VIEW'
      $scope.form_fields = angular.copy($scope.form_fields_fresh)

      for (let field of $scope.form_fields) {
         field.disabled = true
         if (c[field.id] != undefined) {
            field.value = c[field.id] + ''
            if (field.type === 'dropdown') field.list = [c[field.id]]
            // if (field.id !== 'active') 
         }
      }

      $scope.showPopup = true;

   }

   $scope.editCustomer = (c) => {
      $scope.showPopup = true;
      $scope.action_type = 'EDIT'
   }

   $scope.getWholeNum = () => {
      let num = Math.ceil($scope.form_fields.length / 3)
      return [].constructor(num)
   }
   $scope.getRowFields = (row_num) => {
      let ar = $scope.form_fields.slice(row_num * 3, row_num * 3 + 3)
      return ar
   }
   // $scope.hasError = function (field, validation) {
   //    if (validation) {
   //       return ($scope.form[field].$dirty && $scope.form[field].$error[validation]) || ($scope.submitted && $scope.form[field].$error[validation]);
   //    }
   //    return ($scope.form[field].$dirty && $scope.form[field].$invalid) || ($scope.submitted && $scope.form[field].$invalid);
   // };



   $scope.form_fields_fresh = [
      {
         id: 'name',
         label: 'Customer Name *',
         type: 'text',
         required: true,
         placeholder: '',
         disabled: false,
         value: '',
         validation_msg: '',
      },
      {
         id: 'customer_code',
         label: 'Customer Code *',
         type: 'text',
         required: false,
         disabled: true,
         placeholder: '',
         value: '',
         validation_msg: '',
      },
      {
         id: 'business_type',
         label: 'Business Type *',
         type: 'dropdown',
         required: true,
         disabled: false,
         placeholder: '',
         value: '',
         list: ['Telecom', 'IT Services', 'Consulting Firm', 'Others'],
         options: 'val for val in field.list',
         validation_msg: 'Telecom',
      },

      {
         id: 'billing_to',
         label: 'Billing Party Name *',
         type: 'text',
         required: false,
         disabled: false,
         placeholder: '',
         value: '',
         validation_msg: '',
      },
      {
         id: 'home_address_address_1',
         label: 'Address 1 *',
         type: 'text',
         required: true,
         disabled: false,
         placeholder: '',
         value: '',
         validation_msg: '',
      },
      {
         id: 'home_address_address_2',
         label: 'Address 2',
         type: 'text',
         required: false,
         disabled: false,
         placeholder: '',
         value: '',
         validation_msg: '',
      },

      {
         id: 'home_address_pin',
         label: 'PIN *',
         type: 'text',
         required: true,
         disabled: false,
         placeholder: '',
         value: '',
         validation_msg: '',
      },
      {
         id: 'home_address_state',
         label: 'State *',
         type: 'dropdown',
         required: true,
         disabled: false,
         placeholder: '',
         list: [],
         value: '',
         options: 'val for val in field.list',
         validation_msg: '',
      },
      {
         id: 'home_address_city',
         label: 'City *',
         type: 'dropdown',
         required: true,
         disabled: false,
         placeholder: '',
         list: [],
         value: '',
         options: 'val for val in field.list',
         validation_msg: '',
      },


      {
         id: 'home_address_phone_1',
         label: 'Phone 1 *',
         type: 'number',
         required: true,
         disabled: false,
         placeholder: '',
         value: '',
         validation_msg: '',
      },
      {
         id: 'home_address_phone_2',
         label: 'Phone 2 ',
         type: 'number',
         required: false,
         disabled: false,
         placeholder: '',
         value: '',
         validation_msg: '',
      },
      {
         id: 'home_address_business_area',
         label: 'MLL Business Area * ',
         type: 'dropdown',
         required: true,
         disabled: false,
         placeholder: '',
         list: ['type 1', 'type 2'],
         value: '',
         options: 'val for val in field.list',
         validation_msg: '',
      },

      {
         id: 'pan',
         label: 'PAN *',
         type: 'text',
         required: true,
         disabled: false,
         placeholder: '',
         value: '',
         validation_msg: '',
      },
      {
         id: 'home_address_gstin_no',
         label: 'GSTIN *',
         type: 'text',
         required: true,
         disabled: false,
         placeholder: '',
         value: '',
         validation_msg: '',
      },
      {
         id: 'sap_control_number',
         label: 'SAP Control Number',
         type: 'text',
         required: false,
         disabled: false,
         placeholder: '',
         value: '',
         validation_msg: '',
      },


      {
         id: 'reference_no1',
         label: 'Reference Number',
         type: 'text',
         required: false,
         disabled: false,
         placeholder: '',
         value: '',
         validation_msg: '',
      },
      {
         id: 'registered_contact_name',
         label: 'Contact Name',
         type: 'text',
         required: false,
         disabled: false,
         placeholder: '',
         value: '',
         validation_msg: '',
      },
      {
         id: 'registered_phone1',
         label: 'Contact Phone',
         type: 'number',
         required: false,
         disabled: false,
         placeholder: '',
         value: '',
         validation_msg: '',
      },

      {
         id: 'contact_email',
         label: 'Contact Email',
         type: 'text',
         required: false,
         disabled: false,
         placeholder: '',
         value: '',
         validation_msg: '',
      },
      {
         id: 'active',
         label: 'Active/Inactive',
         type: 'dropdown',
         required: false,
         disabled: false,
         placeholder: '',
         list: [{ key: '1', val: 'Active' }, { key: '0', val: 'Inactive' }],
         value: { key: '1', val: 'Active' },
         options: 'item.val for item in field.list track by item.key',
         validation_msg: '',
      },
   ]

   $scope.form_fields = angular.copy($scope.form_fields_fresh)
})