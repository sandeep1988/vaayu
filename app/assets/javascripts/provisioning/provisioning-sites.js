var sitesTableEditor;

$(function () {
    'use strict';
    var allCompanies = []
    var logisticsCompanies = []
    var cities = []
    var states = []
    var siteTable = $()
    var site_id = ''
    var edit_site = false
    var current_user = ''
    var logistics_company_id = null
    var orig_service_html = ''
    var choose_operator = true

    /**
     * Sites Table
     *
     */
    var table = '#sites-table';
    $('a[href="#sites"]').on('shown.bs.tab', function () {

        resetBillingParameters()
        if (loadedTabs['sites']) {
            if (current_user == 'Operator') {
                $(".action-buttons")[0].style.display = "none"
            }
            else {
                $(".action-buttons")[0].style.display = "block"
            }
            return;
        }

        // set loaded state
        loadedTabs['sites'] = true;
        if (!loadedDatatables[table]) {
            siteTable = $(table).DataTable({
                serverSide: true,
                ajax: "/sites",
                lengthChange: false,
                searching: false,
                pagingType: "simple_numbers",
                ordering: false,
                info: false,
                processing: true,
                columns: [
                    { data: "id" },
                    {
                        data: null,
                        render: function (data) {
                            return '<a style="cursor:pointer" id="editSite" class="editor_edit" data-remote="true" data-site_id="' + data.id + '">' + data.name + '</a>'
                        }
                    },
                    { data: "company" },
                    { data: "address" },
                    { data: "phone" },
                    {
                        data: null,
                        render: function (data) {
                            // return '<a href="#" class="editor_remove text-danger" data-toggle="modal" data-target="#modal-confirm-remove-site" data-site_id="' + data.id + '">Delete</a>';
                            return '<a style="cursor:pointer" id="viewSite" class="editor_edit" data-remote="true" data-site_id="' + data.id + '">View</a>'
                        }
                    }
                ],
                initComplete: function () {
                    loadedDatatables[table] = true;
                    var info = this.api().page.info();
                    $('#sites-count').text("Total Sites: " + info.recordsTotal);
                    current_user = this.api().ajax.json().user.entity_type
                    if (current_user == 'Operator') {
                        choose_operator = false
                        $(".action-buttons")[0].style.display = "none"
                    }
                    else {
                        $(".action-buttons")[0].style.display = "block"
                    }
                }
            });
        }


        function validateSite(site, validationError) {
            if ($("#siteName").val() == '' || $("#siteName").val() == undefined || $("#siteName").val() == null) {
                document.getElementById("siteName").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("siteName").classList.remove("border-danger")
                validationError = validationError || false
            }
            if ($("#company").val() == 0 || $("#company").val() == undefined || $("#company").val() == null) {
                document.getElementById("company").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("company").classList.remove("border-danger")
                validationError = validationError || false
            }
            // if ($("#contact_name").val() == '' || $("#contact_name").val() == undefined || $("#contact_name").val() == null) {
            //     document.getElementById("contact_name").classList.add("border-danger")
            //     validationError = true
            // }
            // else {
            //     document.getElementById("contact_name").classList.remove("border-danger")
            //     validationError = validationError || false
            // }
            if ($("#address").val() == '' || $("#address").val() == undefined || $("#address").val() == null) {
                document.getElementById("address").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("address").classList.remove("border-danger")
                validationError = validationError || false
            }
            if ($("#party_name").val() == '' || $("#party_name").val() == undefined || $("#party_name").val() == null) {
                document.getElementById("party_name").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("party_name").classList.remove("border-danger")
                validationError = validationError || false
            }

            // if ($("#party_code").val() == '' || $("#party_code").val() == undefined || $("#party_code").val() == null) {
            //     document.getElementById("party_code").classList.add("border-danger")
            //     validationError = true
            // }
            // else {
            //     document.getElementById("party_code").classList.remove("border-danger")
            //     validationError = validationError || false
            // }

            // if ($("#sap_control_number").val() == '' || $("#sap_control_number").val() == undefined || $("#sap_control_number").val() == null) {
            //     document.getElementById("sap_control_number").classList.add("border-danger")
            //     validationError = true
            // }
            // else {
            //     document.getElementById("sap_control_number").classList.remove("border-danger")
            //     validationError = validationError || false
            // }

            if ($("#party_contact_name").val() == '' || $("#party_contact_name").val() == undefined || $("#party_contact_name").val() == null) {
                document.getElementById("party_contact_name").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("party_contact_name").classList.remove("border-danger")
                validationError = validationError || false
            }

            if ($("#party_pin").val() == '' || $("#party_pin").val() == undefined || $("#party_pin").val() == null) {
                document.getElementById("party_pin").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("party_pin").classList.remove("border-danger")
                validationError = validationError || false
            }

            if ($("#party_pan_no").val() == '' || $("#party_pan_no").val() == undefined || $("#party_pan_no").val() == null) {
                document.getElementById("party_pan_no").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("party_pan_no").classList.remove("border-danger")
                validationError = validationError || false
            }

            if ($("#party_phone_1").val() == '' || $("#party_phone_1").val() == undefined || $("#party_phone_1").val() == null) {
                document.getElementById("party_phone_1").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("party_phone_1").classList.remove("border-danger")
                validationError = validationError || false
            }

            if ($("#party_pan_no").val() == '' || $("#party_pan_no").val() == undefined || $("#party_pan_no").val() == null) {
                document.getElementById("party_pan_no").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("party_pan_no").classList.remove("border-danger")
                validationError = validationError || false
            }

            if ($("#party_gstin_no").val() == '' || $("#party_gstin_no").val() == undefined || $("#party_gstin_no").val() == null) {
                document.getElementById("party_gstin_no").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("party_gstin_no").classList.remove("border-danger")
                validationError = validationError || false
            }

            if ($("#party_phone_1").val() == '' || $("#party_phone_1").val() == undefined || $("#party_phone_1").val() == null) {
                document.getElementById("party_phone_1").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("party_phone_1").classList.remove("border-danger")
                validationError = validationError || false
            }

            var pincode = $("#pin").val().trim();
            if (pincode == '' || pincode.length < 6) {
                document.getElementById("pin").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("pin").classList.remove("border-danger")
                validationError = validationError || false
            }
            if ($("#state").val() == 0 || $("#state").val() == undefined || $("#state").val() == null) {
                document.getElementById("state").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("state").classList.remove("border-danger")
                validationError = validationError || false
            }
            if ($("#city").val() == 0 || $("#city").val() == undefined || $("#city").val() == null) {
                document.getElementById("city").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("city").classList.remove("border-danger")
                validationError = validationError || false
            }
            var phone_1 = $("#phone_1").val().trim();
            if (phone_1 == '' || phone_1.length < 10) {
                document.getElementById("phone_1").classList.add("border-danger")
                validationError = true
            } else {
                document.getElementById("phone_1").classList.remove("border-danger")
                validationError = validationError || false
            }
            
            var pan_number = $("#pan_no").val();
            if (pan_number == '' || !(/^([a-zA-Z]){0,5}([0-9]){0,4}([a-zA-Z]){1}?$/.test(pan_number))) {
                document.getElementById("pan_no").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("pan_no").classList.remove("border-danger")
                validationError = validationError || false
            }
            // if(current_user != 'Operator' && ($("#operator").val() == 0 || $("#operator").val() == undefined || $("#operator").val() == null)){
            //     document.getElementById("operator").classList.add("border-danger")
            //     validationError = true
            // }
            // else{
            //     document.getElementById("operator").classList.remove("border-danger")
            //     validationError = validationError || false
            // }

            if ($("#sezNonSez").val() == 0 || $("#sezNonSez").val() == undefined || $("#sezNonSez").val() == null) {
                document.getElementById("sezNonSez").classList.add("border-danger")
                validationError = true
            }
            else {
                document.getElementById("sezNonSez").classList.remove("border-danger")
                validationError = validationError || false
            }
            // if ($("#sap_control_number").val() == '' || $("#sap_control_number").val() == undefined || $("#sap_control_number").val() == null) {
            //     document.getElementById("sap_control_number").classList.add("border-danger")
            //     validationError = true
            // }
            // else {
            //     document.getElementById("sap_control_number").classList.remove("border-danger")
            //     validationError = validationError || false
            // }

            if( $("#sezNonSez").val() == 'non sez'){

                validationError = validationError || false;

                document.getElementById("lut_date").classList.remove("border-danger");
                document.getElementById("lut_no").classList.remove("border-danger")
            }

            if( $("#sezNonSez").val() == 'sez'){

                validationError = validationError || false;

                document.getElementById("lut_date").classList.add("border-danger");
                document.getElementById("lut_no").classList.add("border-danger");

                var formt = /^\d{1,2}\-\d{1,2}\-\d{4}$/
           

                if ($("#lut_date").val() == '' || $("#lut_date").val() == undefined || $("#lut_date").val() == null) {
                   
                    document.getElementById("lut_date").classList.add("border-danger")
                    validationError = true;

                }else if( false == formt.test( $("#lut_date").val() ) ) {

                    // console.log( )
                    validationError = true;
                    alert( "LUT Date should be date.Format Ex. DD-MM-YYYY." );

                }else {

                    document.getElementById("lut_date").classList.remove("border-danger")
                    validationError = validationError || false
                }

                if ($("#lut_no").val() == '' || $("#lut_no").val() == undefined || $("#lut_no").val() == null) {
                   
                    document.getElementById("lut_no").classList.add("border-danger")
                    validationError = true;

                }else {

                    document.getElementById("lut_no").classList.remove("border-danger")
                    validationError = validationError || false
                }

            }

            var reg = new RegExp("^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}");

            console.log( reg.exec( $("#latitude").val() ) );

            if ($("#latitude").val() == '' || $("#latitude").val() == undefined || $("#latitude").val() == null) {
                   
                    document.getElementById("latitude").classList.add("border-danger")
                    validationError = true;

            }
            // else if( !reg.exec( $("#latitude").val() ) ) {
            //     document.getElementById("latitude").classList.add("border-danger")
            //         validationError = true;
            //          alert( "Latitude should be numeric." );

            //  //do nothing
            // }
            else {

                document.getElementById("latitude").classList.remove("border-danger")
                validationError = validationError || false
            }

            if ($("#longitude").val() == '' || $("#longitude").val() == undefined || $("#longitude").val() == null) {
                   
                    document.getElementById("longitude").classList.add("border-danger")
                    validationError = true;

            }else {

                document.getElementById("longitude").classList.remove("border-danger")
                validationError = validationError || false
            }

            

            // if( reg.exec( $("#latitude").val() ) ) {
            //     document.getElementById("latitude").classList.remove("border-danger")
            //     validationError = validationError || false

            //  //do nothing
            // } else {

            //     document.getElementById("latitude").classList.add("border-danger")
            //         validationError = true;

            //         alert( "Latitude should be numeric." );
            //  //error
            // }

            // if( reg.exec(("#longitude").val()) ) {
            //      document.getElementById("longitude").classList.remove("border-danger")
            //     validationError = validationError || false

            //  //do nothing
            // } else {

            //     document.getElementById("longitude").classList.add("border-danger")
            //         validationError = true;
            //         alert( "Longitude should be numeric." );
            //  //error
            // }

            

          $(document).on('click', ".submit-btn", function (e) {
            var value = $("#lut_date").val()
            var formt = /^\d{1,2}\-\d{1,2}\-\d{4}$/
            if (formt.test(value)) {
                return true;
            }
            else {
                //document.getElementById("lut_date").classList.add("border-danger")
                //alert("Please enter LUT date in dd-mm-yyyy format.")
                //return false;
            }
          })        

            return validationError
        }
        $(document).on('click', '#editSite', function (e) {
            //  
            $('input').removeAttr('disabled');
            $('.btn-primary').removeAttr('disabled');
            if (current_user == 'Operator') {
                $(".provisioning .edit-buttons .submit-btn").fadeOut()
                $(".provisioning .edit-buttons").fadeIn()
            }

            site_id = e.target.dataset.site_id
            // $("#site_html").html('')
            $.ajax({
                type: "GET",
                url: '/sites/' + site_id + '/edit'
            }).done(function (response) {
                $.ajax({
                    type: "POST",
                    url: '/sites/details',
                    data: {
                        'id': site_id
                    }
                }).done(function (response) {
                    orig_service_html = $("#services").html()
                    edit_site = true
                    var html = generate_edit(response, 'site', response.logistics_company_id, orig_service_html)
                    $("#site_html").html(html)
                    if (response.logistics_company_id == null) {
                        $("#cgst_1").parent().css("display", "none")
                        $("#sgst_1").parent().css("display", "none")
                        $("#addServicesDiv").css("display", "none")
                        $("#services").css("display", "none")
                    }
                })
            });
        });
        $(document).on('click', '#viewSite', function (e) {
            if (current_user == 'Operator') {
                $(".provisioning .edit-buttons .submit-btn").fadeOut()
                $(".provisioning .edit-buttons").fadeIn()
            }

            site_id = e.target.dataset.site_id
            // $("#site_html").html('')
            $.ajax({
                type: "GET",
                url: '/sites/' + site_id + '/edit'
            }).done(function (response) {
                $.ajax({
                    type: "POST",
                    url: '/sites/details',
                    data: {
                        'id': site_id
                    }
                }).done(function (response) {
                    orig_service_html = $("#services").html()
                    edit_site = true
                    var html = generate_edit(response, 'site', response.logistics_company_id, orig_service_html)
                    $("#site_html").html(html)
                    if (response.logistics_company_id == null) {
                        $("#cgst_1").parent().css("display", "none")
                        $("#sgst_1").parent().css("display", "none")
                        $("#addServicesDiv").css("display", "none")
                        $("#services").css("display", "none")
                        $('input').attr('disabled', 'disabled');
                        $('.btn-primary').attr('disabled', 'disabled');
                        $('#company').attr('disabled', 'disabled');
                    }
                })
            });
        });

        $(document).on('click', ".submit-btn", function (e) {
            // $('.submit-btn').prop('disabled', true)    
            // if(e.target.baseURI.indexOf("sites") != -1){ failing save event
            if (0 != 1) {
                var site = {
                    'name': $("#siteName").val(),
                    'employee_company_id': $("#company").val(),
                    'address': $("#address").val(),
                    'phone': $("#phone").val(),
                    'admin_name': $("#admin_name").val(),
                    'admin_email_id': $("#admin_email_id").val(),

                    'site_code': $("#site_code").val(),
                    'branch_name': $("#branch_name").val(),
                    'contact_name': $("#contact_name").val(),
                    'address_1': $("#address_1").val(),

                    'address_2': $("#address_2").val(),
                    'address_3': $("#address_3").val(),
                    'pin': $("#pin").val(),
                    'city': $("#city").val(),
                    'state': $("#state").val(),
                    'phone_1': $("#phone_1").val(),

                    'phone_2': $("#phone_2").val(),
                    'pan_no': $("#pan_no").val(),
                    'business_area': $("#business_area").val(),
                    'gstin_no': $("#gstin_no").val(),
                    'cost_centre': $("#cost_centre").val(),

                    'profit_centre': $("#profit_centre").val(),
                    'gl_acc_no': $("#gl_acc_no").val(),
                    'party_code': $("#party_code").val(),
                    'party_contact_name': $("#party_contact_name").val(),
                    'party_address_1': $("#party_address_1").val(),

                    'party_address_3': $("#party_address_3").val(),
                    'party_address_2': $("#party_address_2").val(),
                    'party_pin': $("#party_pin").val(),
                    'party_city': $("#party_city").val(),

                    'party_state': $("#party_state").val(),
                    'party_phone_1': $("#party_phone_1").val(),
                    'party_phone_2': $("#party_phone_2").val(),
                    'party_business_area': $("#party_business_area").val(),

                    'party_pan_no': $("#party_pan_no").val(),
                    'party_gstin_no': $("#party_gstin_no").val(),
                    'party_name': $("#party_name").val(),

                    // newly added fields//
                    'sezNonSez': $("#sezNonSez").val(),
                    'lut_no': $("#lut_no").val(),
                    'lut_date': $("#lut_date").val(),
                    'active': $("#active").val(),
                    'proximity_radius': $("#proximity_radius").val(),
                    'sap_control_number': $("#sap_control_number").val(),
                    'contact_email': $("#contact_email").val(),
                    'address_2' : $("#address2").val(),
                    'latitude' : $("#latitude").val(),
                    'longitude' : $("#longitude").val(),
                }
                console.log('site adding', site);
                if (current_user == 'Operator') {
                    site['logistics_company_id'] = $("#operator_id").val()
                }
                else {
                    site['logistics_company_id'] = $("#operator").val()
                }
                var validationError = false
                var services = getServiceData()
                validationError = validateSite(site, validationError)

                console.log( "validationError =====================", validationError);
                if (!choose_operator) {
                    validationError = validateServices(services, validationError)
                }

                if (!validationError) {
                    $('.submit-btn').prop('disabled', true)
                    console.log(edit_site)
                    if (edit_site) {
                        console.log('before ajax call ')
                        $.ajax({
                            type: "PUT",
                            data: {
                                'site': site,
                                'services': services
                            },
                            url: '/sites/' + site_id + '/update_site'
                        }).done(function (e) {
                            $('.submit-btn').prop('disabled', false)
                            site_id = ''
                            edit_site = false;
                            resetBillingParameters();
                            restoreDefaultTabState();
                            siteTable.draw()
                            $(".add-new-item").show()
                        });
                    }
                    else {
                        $('.submit-btn').prop('disabled', true)
                        console.log(site);
                        $.ajax({
                            type: "POST",
                            data: {
                                'site': site,
                                'services': services
                            },
                            url: '/sites'
                        }).done(function (e) {
                            $('.submit-btn').prop('disabled', false)
                            site_id = ''
                            edit_site = false
                            resetBillingParameters();
                            restoreDefaultTabState();
                            siteTable.draw()
                            $(".add-new-item").show()
                        });
                    }
                    // $('.submit-btn').prop('disabled', false)    
                }
            }
        })

        $(document).on('click', '.editor_remove', function (e) {
            if (e.target.baseURI.indexOf("sites") != -1) {
                site_id = e.target.dataset.site_id
            }
        })

        $('#modal-confirm-remove-site').on('show.bs.modal', function (e) {
            $(document).on('click', '#submit-remove-site', function (e) {
                $.ajax({
                    type: "DELETE",
                    url: '/sites/' + site_id
                }).done(function (e) {
                    $('.submit-btn').prop('disabled', false)
                    site_id = ''
                    restoreDefaultTabState();
                    siteTable.draw();
                    $('#modal-confirm-remove-site').modal('hide');
                });
            })
        })

        $(document).on('click', '.editor_create ', function (e) {
            // if(e.target.baseURI.indexOf("sites") != -1){ //Onload dropdown condition check
            if (0 != 1) {
                $.ajax({
                    type: "GET",
                    url: '/employee_companies/get_all'
                }).done(function (response) {
                    orig_service_html = $("#services").html()
                    allCompanies = response.employee_companies

                    logisticsCompanies = response.logistics_companies
                    current_user = response.current_user.entity_type
                    setTimeout(function () {
                        for (var i = 0; i < allCompanies.length; i++) {
                            $('#company').append($('<option>', {
                                value: allCompanies[i].id,
                                text: allCompanies[i].name
                            }));
                        }
                        for (var i = 0; i < logisticsCompanies.length; i++) {
                            $('#operator').append($('<option>', {
                                value: logisticsCompanies[i].id,
                                text: logisticsCompanies[i].name
                            }));
                        }
                        if (current_user == 'Operator') {
                            $("#cgst_1").parent().css("display", "block")
                            $("#sgst_1").parent().css("display", "block")
                            $("#addServicesDiv").css("display", "block")
                            $("#services").css("display", "block")
                        }
                    }, 500);
                });
            }
        })

        //  listing for state
        $(document).on('click', '.editor_create ', function (e) {
            // if(e.target.baseURI.indexOf("sites") != -1){  // Onload Dropdown condition failing
            if (0 != -1) {
                $.ajax({
                    type: "GET",
                    url: '/employee_companies/get_all'
                }).done(function (response) {
                    orig_service_html = $("#site_html").html()
                    states = response.states
                    console.log(states);
                    setTimeout(function () {
                        for (var i = 0; i < states.length; i++) {
                            $('#state, #party_state').append($('<option>', {
                                value: states[i].state,
                                text: states[i].state
                            }));
                        }
                        if (current_user == 'Operator') {
                            $("#cgst_1").parent().css("display", "block")
                            $("#sgst_1").parent().css("display", "block")
                            $("#addServicesDiv").css("display", "block")
                            $("#services").css("display", "block")
                        }
                    }, 500);

                    hideShowLut( $("#sezNonSez").val() );
                });
            }
        })

        //  listing for city
        $(document).on('click', '.editor_create ', function (e) {
            // if(e.target.baseURI.indexOf("sites") != -1){ // Onload Dropdown condition failing
            if (0 != -1) {
                $.ajax({
                    type: "GET",
                    url: '/employee_companies/get_all'
                }).done(function (response) {
                    orig_service_html = $("#site_html").html()
                    cities = response.cities
                    setTimeout(function () {
                        for (var i = 0; i < cities.length; i++) {
                            $('#city, #party_city, #party_business_area, #business_area , #branch_name ').append($('<option>', {
                                value: cities[i].city_name,
                                text: cities[i].city_name
                            }));
                        }
                        if (current_user == 'Operator') {
                            $("#cgst_1").parent().css("display", "block")
                            $("#sgst_1").parent().css("display", "block")
                            $("#addServicesDiv").css("display", "block")
                            $("#services").css("display", "block")
                        }

                        setInputFilter(document.getElementById("phone_1"), function(value) {
                            if (value.trim().length > 10) {
                                return false;
                            }
                            return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
                        });
                        setInputFilter(document.getElementById("phone_2"), function(value) {
                            if (value.trim().length > 10) {
                                return false;
                            }
                            return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
                        });
                        setInputFilter(document.getElementById("party_phone_1"), function(value) {
                            if (value.trim().length > 10) {
                                return false;
                            }
                            return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
                        });
                        setInputFilter(document.getElementById("party_phone_2"), function(value) {
                            if (value.trim().length > 10) {
                                return false;
                            }
                            return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
                        });
                        setInputFilter(document.getElementById("pin"), function(value) {
                            if (value.trim().length > 6) {
                                return false;
                            }
                            return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
                        });
                        setInputFilter(document.getElementById("party_pin"), function(value) {
                            if (value.trim().length > 6) {
                                return false;
                            }
                            return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
                        });
                        setInputFilter(document.getElementById("pan_no"), function(value) {
                            if (value.trim().length > 10) {
                                return false;
                            }
                            $("#pan_no").val(value.toUpperCase())
                            return true;
                        });
                        setInputFilter(document.getElementById("party_pan_no"), function(value) {
                            if (value.trim().length >= 10) {
                                return false;
                            }
                            $("#party_pan_no").val(value.toUpperCase())
                            return true;
                        });
                        
                    }, 500);
                });
            }

            

        })


        $(document).on('change', '#operator', function (e) {
            choose_operator = false
            logistics_company_id = $("#operator").val()
            if (edit_site) {
                getService('site', site_id, logistics_company_id, orig_service_html)
            }
            else {
                $("#cgst_1").parent().css("display", "block")
                $("#sgst_1").parent().css("display", "block")
                $("#addServicesDiv").css("display", "block")
                $("#services").css("display", "block")
            }
        })


        $(document).on('click', '.cancel', function (e) {
            if (e.target.baseURI.indexOf("sites") != -1) {
                edit_site = false
                site_id = ''
                logistics_company_id = ''
            }
        })

        // hideShowLut( $("#sezNonSez").val() );

    });

    // sez non by ajay tiwari
    $(document).on('change', '#sezNonSez', function (e) {
            
        hideShowLut( $(this).val() );
    });

    
});



function hideShowLut( selectedValueSez ) {

    // alert(selectedValueSez);

    if( selectedValueSez == 'non sez'){
        $(".lut_sez").hide();

    }else{

        $(".lut_sez").show();
    }


}


function isDateValid( d ){

    let isDateValid = false;
    if (Object.prototype.toString.call(d) === "[object Date]") {
      // it is a date
      if (isNaN(d.getTime())) {  // d.valueOf() could also work
        // date is not valid
        isDateValid  = false;
      } else {
        // date is valid

        isDateValid  = true;
      }
    } else {

        isDateValid  = false;
      // not a date
    }

    return isDateValid;

}