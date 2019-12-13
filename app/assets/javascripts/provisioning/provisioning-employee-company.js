var employeeCompaniesTableEditor;

$(function () {
    'use strict';
    var cities = []
    var states = []
    /**
     * Employee Companies Operator Table
     */


    //  $("#modal-employee-company").modal('show',{
    //    backdrop:'static',
    //    keyboard:false,
    //  })
    // $.fn.modal.prototype.constructor.Constructor.DEFAULTS.backdrop="static";

    var table = '#employee-companies-table';
    /**
     * Init table
     */

    $.ajax({ 
      type: "GET",
      url: '/employee_companies/get_all'
    }).done(function (response) {
      states = response.states.map(item => { return {label: item.state, value: item.id}} );
      cities = response.cities.map(item => { return {label: item.city_name, value: item.id}} );
      // {label, value}
        employeeCompaniesTableEditor = new $.fn.dataTable.Editor({
          table: table,
          ajax: {
              create: {
                  type: 'POST',
                  url: '/employee_companies'
              },
              edit: {
                  type: 'PUT',
                  url: '/employee_companies/_id_'
              },
              remove: {
                  type: 'DELETE',
                  url: '/employee_companies/_id_'
              }
          },
          fields: [{
              label: "Customer Name *",
              className: "col-md-4",
              name: "name",
          },  {
                label: "Customer Code *",
                className: "col-md-4",
                name: "customer_code",
                attr:{"readonly":"readonly"}
          }, {
              label: 'Business Type*',
              className: "col-md-4 home_address_state",
              name: "business_type",
              type:"select",
              options: ['Telecom', 'IT Services', 'Consulting Firm', 'Other']
          }, {
              label: 'Billing Party Name',
              className: "col-md-4",
              name: "billing_to"
          },{
              label: 'Address 1*',
              className: "col-md-4",
              name: "home_address_address_1"
            },
            {
              label: 'Address 2',
              className: "col-md-4",
              name: "home_address_address_2"
            },{
              label: 'PIN*',
              className: "col-md-4",
              name: "home_address_pin",
              attr: { maxlength: 6, id:'home_address_pin' }
            },
            {
              label: 'State*',
              className: "col-md-4 home_address_state",
              name: "home_address_state",
              type:"select",
              options:states
            },
            {
              label: 'City*',
              className: "col-md-4",
              name: "home_address_city",
              type:"select",
              options:cities
            },
            {
              label: 'Phone 1*',
              className: "col-md-4",
              name: "home_address_phone_1",
              attr: { maxlength: 10, id:'home_address_phone_1' }
            },
            {
              label: 'Phone 2',
              className: "col-md-4",
              name: "home_address_phone_2",
              attr: { maxlength: 10, id:'home_address_phone_2' }
            },
            {
              label: 'MLL Business Area * ',
              className: "col-md-4",
              name: "home_address_business_area",
              type:"select",
              options:cities
            },
             { 
              label: 'PAN *',
              className: "col-md-4 clear",
              name: "pan",
              attr: { maxlength: 10, id:'pan' }
            },
            {
              label: 'GSTIN * ',
              className: "col-md-4",
              name: "home_address_gstin_no"
            },
            {
              label: 'SAP Control Number * ',
              className: "col-md-4",
              name: "sap_control_number"
            },
            {
              label: 'Reference Number *',
              className: "col-md-4",
              name: "reference_no1"
            },
            {
              label: 'Contact Name',
              className: "col-md-4",
              name: "registered_contact_name"
            },
            {
              label: 'Contact Phone',
              className: "col-md-4",
              name: "registered_phone1",
              attr: { maxlength: 10, id:'registered_phone1' }
            },
            {
              label: 'Contact Email',
              className: "col-md-4",
              name: "contact_email"
            },
            {
              label: 'Active/Inactive',
              className: "col-md-4",
              name: "active",
              type: "select",
              options: ['Active', 'Inactive']
            }
  
          ]
      });
  
      // set selectboxes
      employeeCompaniesTableEditor.on('preOpen', function (e, mode, action) {
          window.setTimeout(function () {
              initModalSelectBox();
          }, 100);
      });
  
      // validate fields
      employeeCompaniesTableEditor.on('preSubmit', function (e, o, action) {
          if (action !== 'remove') {
              var name = employeeCompaniesTableEditor.field('name');
              var pan = employeeCompaniesTableEditor.field('pan');
              // var category = employeeCompaniesTableEditor.field('category');
              // var billing_to = employeeCompaniesTableEditor.field('billing_to');
  
              if (!name.isMultiValue()) {
                  if (!name.val()) {
                      name.error('A company name must be given');
                  }
                  if (name.val().length <= 3) {
                      name.error('The company name length must be more than 3 characters');
                  }
              }
              var panValue = $("#pan").val().trim();
              if (panValue.length == 0) {
                pan.error('Pan number must be given.');
              } else {
                if (/^([a-zA-Z]){0,5}([0-9]){0,4}([a-zA-Z]){1}?$/.test(panValue)){

                } else {
                  pan.error('Invalid Pan number.');
                }
              }

              // if (category.val().trim().length == 0) {
              //   category.error('Category must be given.');
              // } 
              // if (billing_to.val().trim().length == 0) {
              //   billing_to.error('Billing must be given.');
              // } 

              // var home_address_contact_name = employeeCompaniesTableEditor.field('home_address_contact_name');
              var home_address_address_1 = employeeCompaniesTableEditor.field('home_address_address_1');
              var home_address_address_2 = employeeCompaniesTableEditor.field('home_address_address_2');
              // var home_address_address_3 = employeeCompaniesTableEditor.field('home_address_address_3');
              var home_address_pin = employeeCompaniesTableEditor.field('home_address_pin');
              var home_address_state = employeeCompaniesTableEditor.field('home_address_state');
              var home_address_city = employeeCompaniesTableEditor.field('home_address_city');
              var home_address_phone_1 = employeeCompaniesTableEditor.field('home_address_phone_1');
              var home_address_gstin_no = employeeCompaniesTableEditor.field('home_address_gstin_no');

              // var customer_code = employeeCompaniesTableEditor.field('customer_code');
               var sap_control_number = employeeCompaniesTableEditor.field('sap_control_number');
              var reference_no1 = employeeCompaniesTableEditor.field('reference_no1');

              // var home_address_pan_no = employeeCompaniesTableEditor.field('home_address_pan_no');
              
              // if (home_address_contact_name.val().trim().length == 0) {
              //   home_address_contact_name.error('Home Contact Name must be given.');
              // }
              if (home_address_address_1.val().trim().length == 0) {
                home_address_address_1.error('Home Address 1 must be given.');
              }
              //if (home_address_address_2.val().trim().length == 0) {
               // home_address_address_2.error('Home Address 2 must be given.');
              //}
              if (home_address_gstin_no.val().trim().length == 0) {
                home_address_gstin_no.error('GSTIN must be given.');
              }
              // if (customer_code.val().trim().length == 0) {
              //   customer_code.error('Customer Code must be given.');
              // }
              if (sap_control_number.val().trim().length == 0) {
                sap_control_number.error('SAP control number must be given.');
              }
              if (reference_no1.val().trim().length == 0) {
                reference_no1.error('Reference number must be given.');
              }
              // if (home_address_address_3.val().trim().length == 0) {
              //   home_address_address_3.error('Home Address 3 must be given.');
              // } home_address_gstin_no customer_code reference_no1
              if (home_address_pin.val().trim().length == 0) {
                home_address_pin.error('Home pincode must be given.');
              } else if (home_address_pin.val().trim().length < 6) {
                home_address_pin.error('Home pincode must contain 6 digts.');
              }
              if (home_address_state.val() == null) {
                home_address_state.error('Home State must be given.');
              }
              if (home_address_city.val() == null) {
                home_address_city.error('Home City must be given.');
              }
              if (home_address_phone_1.val().trim().length == 0) {
                home_address_phone_1.error('Home Phone 1 must be given.');
              }

              // var panValue2 = home_address_pan_no.val().trim();
              // if (panValue2.length == 0) {
              //   home_address_pan_no.error('Home Address Pan number must be given.');
              // } else {
              //   if (/^([a-zA-Z]){0,5}([0-9]){0,4}([a-zA-Z]){1}?$/.test(panValue2)){

              //   } else {
              //     home_address_pan_no.error('Invalid Home Address Pan number.');
              //   }
              // }

              
              var registered_contact_name = employeeCompaniesTableEditor.field('registered_contact_name');
              // var registered_address1 = employeeCompaniesTableEditor.field('registered_address1');
              // var registered_address2 = employeeCompaniesTableEditor.field('registered_address2');
              // var registered_address3 = employeeCompaniesTableEditor.field('registered_address3');
              // var registered_pin = employeeCompaniesTableEditor.field('registered_pin');
              // var registered_state = employeeCompaniesTableEditor.field('registered_state');
              // var registered_city = employeeCompaniesTableEditor.field('registered_city');
              var registered_phone1 = employeeCompaniesTableEditor.field('registered_phone1');
              // var registered_pan_no = employeeCompaniesTableEditor.field('registered_pan_no');
              

             // if (registered_contact_name.val().trim().length == 0) {
              //  registered_contact_name.error('Registered Contact Name must be given.');
              //}
              // if (registered_address1.val().trim().length == 0) {
              //   registered_address1.error('Registered Address 1 must be given.');
              // }
              // if (registered_address2.val().trim().length == 0) {
              //   registered_address2.error('Registered Address 2 must be given.');
              // }
              // if (registered_address3.val().trim().length == 0) {
              //   registered_address3.error('Registered Address 3 must be given.');
              // }
              // if (registered_pin.val().length == 0) {
              //   registered_pin.error('Registered pincode must be given.');
              // }
              // if (registered_state.val() == null) {
              //   registered_state.error('Registered State must be given.');
              // }
              // if (registered_city.val() == null) {
              //   registered_state.error('Registered City must be given.');
              // }
              //if (registered_phone1.val().trim().length == 0) {
               // registered_phone1.error('Registered Phone 1 must be given.');
              //}

              // var panValue1 = registered_pan_no.val().trim();
              // if (panValue1.length == 0) {
              //   registered_pan_no.error('Registered Address Pan number must be given.');
              // } else {
              //   if (/^([a-zA-Z]){0,5}([0-9]){0,4}([a-zA-Z]){1}?$/.test(panValue1)){

              //   } else {
              //     registered_pan_no.error('Invalid Registered Address Pan number.');
              //   }
              // }

  
              if (this.inError()) {
                  return false;
              }
          }
      });
    });  


  

    $('a[href="#employee-company"]').on('shown.bs.tab', function () {
        if ( !$.fn.dataTable.isDataTable( table ) ) {
            $(table).dataTable({
               serverSide: true,
                ajax: "/employee_companies",
                order: [[0, 'desc']],
                lengthChange: false,
                searching: false,
                pagingType: "simple_numbers",
                ordering: false,
                info: false,
                processing: true,

                columns: [
                    {data: "id"},
                    {
                        data: "name",
                        render: function (data) {
                          console.log(data)
                            return '<a href="" class="modal_view">' + data + '</a>'
                        }
                    },
                    // {data: 'home_address_address_1'},
                    {
                        data: null,
                        render: function (data) {

                            return data.home_address_address_1 + ', ' + data.home_address_address_2
                        }
                    },
                    {data: 'business_type'},
                    {data: 'pan'},
                    {data: 'home_address_gstin_no'},
                    {
                        data: null,
                        render: function (data) {

                            return '<a href="#" class="modal_edit">Edit |</a>&nbsp<a href="#" class="modal_view">View | </a>&nbsp<a href="/employee_companies/' + data.id + '/active_customer" id= "active_customer" data-remote="true"><div style="float:left">' + data.active + '</div></a>'  + ' <div style="float:right; top:2px; position:relative">'
                            // return '<a href="/api/v2/drivers/' + data.id + '/active_driver" id= "active_driver" data-remote="true"><div style="float:left">' + data.active + '</div></a>'  + ' <div style="float:right; top:2px; position:relative">'
                        }
                    }
                ],
                initComplete: function () {
                    loadedDatatables[table] = true;
                     var info = this.api().page.info();
                     $('#employee-companies-count').text("Total Employee Companies: " + info.recordsTotal);
                }
            });
        }
    });

   


    // Edit record
    $(table).on('click', 'a.modal_edit', function (e) {
        e.preventDefault();

        employeeCompaniesTableEditor
            .title('Edit company')
            .buttons([
                {
                    label: "Close",
                    className: 'btn btn-sm btn-default',
                    fn: function () {
                        this.close()
                    }
                }, {
                    label: "Save changes",
                    className: 'btn btn-sm btn-primary btn-fixed-width',
                    fn: function () {
                        this.submit()
                    }
                }])
            .edit($(this).closest('tr'));
            $('input').removeAttr('disabled'); 
            $('select').removeAttr('disabled');//Rushikesh added code here
            $('.btn-primary').removeAttr('disabled'); //Rushikesh added code here
    });
        //Rushikesh made changes here, added View Record function
        $(table).on('click', 'a.modal_view', function (e) {
            e.preventDefault();

            employeeCompaniesTableEditor
                .title('View Company')
                .edit($(this).closest('tr'));
                $('select').attr('disabled','disabled');
                $('input').attr('disabled','disabled'); //Rushikesh added code here
                // $('.btn-primary').attr('disabled','disabled');//Rushikesh added code here
                //$('input').css({
                // 'background-color': 'red',
                //'color': 'white',
                // 'font-size': '44px'
                 // });
    });

    // New record
    $(document).on('click', '.provisioning a.editor_create.employee-company', function (e) {
        e.preventDefault();

       
        // $("#home_address_pin").rules("add", { regex: "^[0-9]{1,6}$" })
        
        employeeCompaniesTableEditor
            .title('Add New Company')
            .buttons([{
                label: "Close",
                className: 'btn btn-sm btn-default',
                fn: function () {
                    this.close()
                }
            }, {
                label: "Submit",
                className: 'btn btn-sm btn-primary btn-fixed-width',
                fn: function () {
                    this.submit()
                }
            }])
            .create();
            $('input').removeAttr('disabled'); //Rushikesh added code here

            setInputFilter(document.getElementById("home_address_pin"), function(value) {
              return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
            });
            setInputFilter(document.getElementById("home_address_phone_1"), function(value) {
              return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
            });
            setInputFilter(document.getElementById("home_address_phone_2"), function(value) {
              return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
            });
            setInputFilter(document.getElementById("registered_phone1"), function(value) {
              return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
            });
            // setInputFilter(document.getElementById("registered_phone2"), function(value) {
            //   return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
            // });
            setInputFilter(document.getElementById("pan"), function(value) {
              $("#pan").val(value.toUpperCase())
              // return /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(value); // Allow digits and '.' only, using a RegExp
              return true;
            });
            // setInputFilter(document.getElementById("home_address_pan_no"), function(value) {
            //   $("#home_address_pan_no").val(value.toUpperCase())
            //   return true;
            //   // return /^([a-zA-Z]){0,5}([0-9]){0,4}([a-zA-Z]){1}?$/.test(value); // Allow digits and '.' only, using a RegExp
            // });
            // setInputFilter(document.getElementById("registered_pan_no"), function(value) {
            //   $("#registered_pan_no").val(value.toUpperCase())
            //   return true;
            //   // return /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/.test(value); // Allow digits and '.' only, using a RegExp
            // });
            
            
    });

    $("#employee-companies-table").on('click', 'a', function (e) {
      e.preventDefault();
      var table = $('#employee-companies-table').DataTable();
      table.ajax.reload();
    });    

    // Delete record
    $(table).on('click', 'a.editor_remove', function (e) {
        e.preventDefault();

        employeeCompaniesTableEditor
            .title('Delete company')
            .message("Are you sure you wish to delete this company?")
            .buttons([
                {
                    label: "Close",
                    className: 'btn btn-sm btn-default',
                    fn: function () {
                        this.close()
                    }
                }, {
                    label: "Delete",
                    className: 'btn btn-sm btn-primary',
                    fn: function () {
                        this.submit()
                    }
                }])
            .remove($(this).closest('tr'));
    });



  $.extend( true, $.fn.dataTable.Editor.defaults, {
    formOptions: {
        main: {
            onBackground: 'none'
        },
        bubble: {
            onBackground: 'none'
        }
    }
  });

$(document).on('click', 'a[id="active_customer"]', function (e) {

//console.log("sfsdfsdg>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" );

  location.reload();

});


});


// $(document).on("#active_customer", 'click', function (e) {
//       //alert("Are you sure you want to active/deactivate driver!")
      
      
//     });



