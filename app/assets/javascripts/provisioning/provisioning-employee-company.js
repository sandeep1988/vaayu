var employeeCompaniesTableEditor;

$(function () {
    'use strict';
    /**
     * Employee Companies Operator Table
     */

    var table = '#employee-companies-table';
    /**
     * Init table
     */
    $('a[href="#employee-company"]').on('shown.bs.tab', function () {
        if (!loadedDatatables[table]) {

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
                            return '<a href="" class="modal_view">' + data + '</a>'
                        }
                    },
                    // {data: 'hq_address'},
                    // {data: 'business_type'},
                    // {data: 'pan'},
                    // {data: 'service_tax_no'},
                    {data: 'category'},
                    {data: 'home_address_state'},
                    {data: 'home_address_city'},
                    {
                        data: null,
                        render: function (data) {

                            return '<a href="" class="modal_edit">Edit</a>&nbsp<a href="" class="modal_view">View</a>&nbsp<a href="" class="editor_remove text-danger">Delete</a>' //Rushikesh made changes here
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
        fields: [
        // {
        //     label: "Customer Code *",
        //     className: "col-md-4",
        //     name: "customer_code"
        // },
        {
            label: "Customer Name *",
            className: "col-md-4",
            name: "name"
        },
        {
            label: 'PAN No *',
            className: "col-md-4 clear",
            name: "pan"
        }, 
        {
            label: 'Reference No1',
            className: "col-md-4",
            name: "reference_no1"
        },
        {
            label: 'Reference No2',
            className: "col-md-4",
            name: "reference_no2"
        },
        {
            label: 'Zone',
            className: "col-md-4 selectboxit-wrap",
            name: "zone",
            type: "select",
            options: [
                {label: "SEZ", value: "SEZ"},
                {label: "NON SEZ", value: "NON SEZ"}
            ]
        },
       
         {
            label: 'Category',
            className: "col-md-4 selectboxit-wrap",
            name: "category",
            type: "select",
            options: [
                {label: "IT/ Transportation", value: "IT/ Transportation"}
            ]
          },
          {
            label: 'Billing To *',
            className: "col-md-4 selectboxit-wrap",
            name: "billing_to",
            type: "select",
            options: [
                {label: "Home", value: "IT/ Transportation"},
                {label: "Registered", value: "Registered"},
                {label: "Site", value: "Site"},
                {label: "Invoice to Party", value: "Invoice to Party"}
            ]
         } ,
         

          {
            label: 'Contact Name *',
            className: "col-md-4",
            name: "home_address_contact_name"
          },
          {
            label: 'Address line 1 *',
            className: "col-md-4",
            name: "home_address_address_1"
          },
          {
            label: 'Address line 2 *',
            className: "col-md-4",
            name: "home_address_address_2"
          },
          {
            label: 'Address line 3',
            className: "col-md-4",
            name: "home_address_address_3"
          },
          {
            label: 'Pin Code *',
            className: "col-md-4",
            name: "home_address_pin"
          },
          {
            label: 'State *',
            className: "col-md-4",
            name: "home_address_state"
          },
          {
            label: 'City *',
            className: "col-md-4",
            name: "home_address_city"
          },
          {
            label: 'Phone 1 *',
            className: "col-md-4",
            name: "home_address_phone_1"
          },
          {
            label: 'Phone 2',
            className: "col-md-4",
            name: "home_address_phone_2"
          },
          {
            label: 'Business Area ',
            className: "col-md-4",
            name: "home_address_business_area"
          },
          {
            label: 'PAN No *',
            className: "col-md-4",
            name: "home_address_pan_no"
          },
          {
            label: 'GSTIN No ',
            className: "col-md-4",
            name: "home_address_gstin_no"
          },

          {
            label: 'Registered Contact Name',
            className: "col-md-4",
            name: "registered_contact_name"
          },
          {
            label: 'Registered Address 1 *',
            className: "col-md-4",
            name: "registered_address1"
          },
          {
            label: 'Registered Address 2 *',
            className: "col-md-4",
            name: "registered_address2"
          },
          {
            label: 'Registered Address 3',
            className: "col-md-4",
            name: "registered_address3"
          },
          {
            label: 'Registered Pin Code',
            className: "col-md-4",
            name: "registered_pin"
          },
          {
            label: 'Registered State *',
            className: "col-md-4",
            name: "registered_state"
          },
          {
            label: 'Registered City *',
            className: "col-md-4",
            name: "registered_city"
          },
          {
            label: 'Registered Phone 1 *',
            className: "col-md-4",
            name: "registered_phone1"
          },
          {
            label: 'Registered Phone2',
            className: "col-md-4",
            name: "registered_phone2"
          },
          {
            label: 'Registered Business Area',
            className: "col-md-4",
            name: "registered_business_area"
          },
          {
            label: 'Registered GSTIN No',
            className: "col-md-4",
            name: "registered_gstin_no"
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

            if (!name.isMultiValue()) {
                if (!name.val()) {
                    name.error('A company name must be given');
                }
                if (name.val().length <= 3) {
                    name.error('The company name length must be more than 3 characters');
                }
            }

            if (this.inError()) {
                return false;
            }
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
            $('input').removeAttr('disabled'); //Rushikesh added code here
            $('.btn-primary').removeAttr('disabled'); //Rushikesh added code here
    });
        //Rushikesh made changes here, added View Record function
        $(table).on('click', 'a.modal_view', function (e) {
            e.preventDefault();

            employeeCompaniesTableEditor
                .title('View Company')
                .edit($(this).closest('tr'));
                $('input').attr('disabled','disabled'); //Rushikesh added code here
                $('.btn-primary').attr('disabled','disabled');//Rushikesh added code here
                //$('input').css({
                // 'background-color': 'red',
                //'color': 'white',
                // 'font-size': '44px'
                 // });
    });

    // New record
    $(document).on('click', '.provisioning a.editor_create.employee-company', function (e) {
        e.preventDefault();

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
});