$(function () {
    'use strict';
    updateBadgeCount();
    /**
     * Adds new table info
     */
    $('.provisioning .add-new-item').on('click', function () {
        var modalType = $('.provisioning .nav-tabs .active a').data('modal-type');
        if (!modalType) {
            showEditContentArea();
            showEditActions();
        }
    });

    /**
     * Show table edit zone on click "Edit" action
     */
    $(document).on('click', '.table-no-modal .edit', function () {
        showEditActions();
        showEditContentArea();
    });

    /**
     *  Set "add new" button active class depend on active tab
     */
    $('.provisioning .nav-tabs a').on('show.bs.tab', function (e) {
        var currentTab = $(this).text();
        var defaultAddClass = "editor_create add-new-item btn btn-sm btn-primary btn-fixed-width";
        var $nextTabWrap = $(e.target).closest('li');
        var $prevTabWrap = $(e.relatedTarget).closest('li');
        var $addItemButton = $('.nav-actions .add-new-item');
        var source = $(e.target).data('source');
        var modalType = $(e.target).data('modal-type');
        var submitBtn = $('.nav-actions .submit-btn');
        console.log(submitBtn);
        $(".provisioning .edit-buttons .submit-btn").fadeIn()
        $(".provisioning .edit-buttons").fadeOut()

        // change modal target
        var tabHash = $(e.target).attr('href').substring(1);
        $addItemButton
            .attr('data-target', '#modal-' + tabHash);

        $('.provisioning .edit-buttons').hide();
        // Display add button
        if (currentTab.toLowerCase() != "general settings" && currentTab.toLowerCase() != 'system settings' && currentTab.toLowerCase() != 'compliances') {
            if (!$addItemButton.is(":visible")) {
                $('.provisioning .action-buttons').fadeIn(200);
                $addItemButton.show();
            }
        }

        // set active class for tab
        $addItemButton.attr('class', defaultAddClass);
        $addItemButton
            .removeClass($prevTabWrap.attr('class'))
            .addClass($nextTabWrap.attr('class'));
        submitBtn.removeClass(function (index, className) { return (className.match(/\bform-\S+/g) || []).join(' '); });
        submitBtn.addClass('form-' + $nextTabWrap.attr('class'));

        // change data attr depend on tab type
        switch (modalType) {
            case 'simple':
                $addItemButton
                    .attr('data-toggle', 'modal')
                    .attr('data-remote', '')
                    .attr('href', '');
                break;
            case 'remote':
                $addItemButton
                    .attr('data-toggle', '')
                    .attr('data-remote', 'true')
                    .attr('href', source);
                break;
            default:
                $addItemButton
                    .attr('data-toggle', '')
                    .attr('data-remote', 'true')
                    .attr('href', source);
                console.log(source);
                submitBtn.attr('form', 'form-' + $nextTabWrap.attr('class'));
        }

        restoreDefaultTabState(currentTab);

    });

    /**
     * Edit table info
     */
    $('.provisioning .edit-buttons, #employees, #drivers, #vehicles').on('click', 'a.cancel', function (e) {
        e.preventDefault();

        var action = $(this).data('action');

        if (action == 'cancel') {
            restoreDefaultTabState();
        }
    });

    $(".resource-headers a").on("click", function () {
        $(".resource-headers a.active").removeClass("active");
        $('.provisioning .action-buttons .ingest').addClass('hide', 200);
        $.each($(".nav-tabs li.active"), function (i, e) { $(e).removeClass("active") });
        switch ($(this).attr("href")) {
            case '#places':
                if ($(".places ul li a").size() > 1) {
                    showPlaces();
                    $(".places ul li a")[1].click();
                } else {
                    showDefaultResource()
                }
                break;
            case '#things':
                if ($(".things ul li a").size() > 1) {
                    showThings();
                    $(".things ul li a")[1].click();
                } else {
                    showDefaultResource()
                }
                break;
            default:
                showDefaultResource()
        }
    });
});

/**
 * Show Edit Actions block
 */
function showEditActions() {
    $('.provisioning .action-buttons').fadeOut(200, function () {
        $('.provisioning .edit-buttons').fadeIn(200);
    });
}

/**
 * Hide Edit Actions block
 */
function hideEditActions() {
    $('.provisioning .edit-buttons').fadeOut(200, function () {
        $('.provisioning .action-buttons').fadeIn(200);
    })
}

/**
 * Show Edit Content Area
 */
function showEditContentArea() {
    var $activePane = $('.provisioning .tab-pane.active');

    $activePane.find('.table-wrap').fadeOut(200, function () {
        $activePane.find('.table-content-edit').fadeIn(200);
    });
}

/**
 * Hide Edit Content Area
 */
function hideEditContentArea() {
    var $activePane = $('.provisioning .tab-pane.active');

    $activePane.find('.table-content-edit').fadeOut(200, function () {
        $activePane.find('.table-wrap').fadeIn(200);
    })
}

function hideSaveButton() {
    $('.provisioning .save-button').fadeOut(200);
}


/**
 * Restore default tab state
 */
function restoreDefaultTabState(currentTab = "") {
    switch (currentTab.toLowerCase()) {
        case 'compliances':
            $('.provisioning .save-button').hide()
            $('.provisioning .action-buttons').show()
            break;
        case 'general settings':
            hideEditActions();
            hideEditContentArea();
            $('.provisioning .action-buttons').hide()
            $('.provisioning .save-button').fadeIn(200);
            break;
        case 'system settings':
            hideEditActions();
            hideEditContentArea();
            $('.provisioning .action-buttons').hide()
            $('.provisioning .save-button').fadeIn(200);
            break;
        default:
            hideEditActions();
            hideEditContentArea();
    }
}

/**
 * Set active state for first tab and "Add new" button on page load.
 */
function setTabActiveState() {

    var $addButton = $('.add-new-item');
    var submitBtn = $('.nav-actions .submit-btn');

    var $activeTab = $('.provisioning .nav-tabs li.active');
    var source = $activeTab.find('a').data('source');
    var isModal = $activeTab.find('a').data('modalType');
    var tabClassesStr = $activeTab.attr('class');
    var activeTabClass = tabClassesStr.slice(0, tabClassesStr.indexOf(' active'));
    enableCurrentTab($('.provisioning .nav-tabs li.active a').attr("href"));

    // set first tab modal target
    if (typeof isModal !== 'undefined') {
        $addButton
            .addClass(activeTabClass)
            .attr('data-target', '#modal-' + activeTabClass)
            .attr('data-toggle', 'modal')
            .attr('data-remote', '');
    } else {
        $addButton
            .attr('data-toggle', '')
            .attr('data-remote', 'true')
            .attr('href', source)
            .addClass(activeTabClass);

        submitBtn.attr('form', 'form-' + activeTabClass);
    }
}

function enableCurrentTab(activeTab) {
    places = ["#sites", "#zones", "#routes"];
    things = ["#vehicles", "#devices", "#shifts"];
    $(".resource-headers a.active").removeClass("active")

    if (places.includes(activeTab)) {
        showPlaces();
    } else if (things.includes(activeTab)) {
        showThings();
    } else {
        $(".resource-headers a:first-child").addClass("active");
        $(".things").hide();
        $(".places").hide();
        $(".people").show();
    }
}

function showPlaces() {
    $(".resource-headers a:nth-child(2)").addClass("active");
    $(".people").hide();
    $(".things").hide();
    $(".places").show();
}

function showThings() {
    $(".resource-headers a:nth-child(3)").addClass("active");
    $(".people").hide();
    $(".places").hide();
    $(".things").show();
}

function showDefaultResource() {
    $(".resource-headers a:first-child").addClass("active");
    $(".things").hide();
    $(".places").hide();
    $(".people").show();
    $(".people ul li a.people.default:first").size() > 0 ? $(".people ul li a.people.default:first").click() : $(".people ul li a.people:first").click();
}

function showErrorMessage(msg) {
    $('#error-placement').html('<div class="alert alert-danger fade in"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' + msg + '</div>');
}

function removeErrorMessage(msg) {
    $('#error-placement').html('');
}


function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}

$(document).ready(function(){

    let urlHash = window.location.hash;
    urlHash = urlHash.replace("#!","");
    //setTimeout(function(){
    if(urlHash){
        $("a[href="+urlHash+"]").trigger('click');    
    }
    
    $(".reload-button").attr("href", "#");

    //},1000);
    

    console.log(urlHash,"trigger tab click >>>>>>>>>>>>>>>>>>>" );
    
    // if( window.location.hash.indexOf("drivers") != -1  ){

    //     $('#driver_add').trigger('click');
    // }
    // else if( window.location.hash.indexOf("employers") != -1 ){

    //     $('a[href="#employers"]').trigger('click');
    // }
    // else if( window.location.hash.indexOf("logistic-companies-users") != -1 ){

    //     $('a[href="#logistic-companies-users"]').trigger('click');
    // }

    // else if( window.location.hash.indexOf("logistic-companies") != -1 ){

    //     $('a[href="#logistic-companies"]').trigger('click');
    // }
    
    // else if( window.location.hash.indexOf("employee-company") != -1 ){

    //     $('a[href="#employee-company"]').trigger('click');
    // }
    // else if( window.location.hash.indexOf("operator-shift-managers") != -1 ){

    //     $('a[href="#operator-shift-managers"]').trigger('click');
    // }
    // else if( window.location.hash.indexOf("employers") != -1 ){

    //     $('a[href="#employers"]').trigger('click');
    // }
    // else if( window.location.hash.indexOf("business-associates") != -1 ){

    //     $('a[href="#business-associates"]').trigger('click');
    // }
    // else if( window.location.hash.indexOf("employees") != -1 ){

    //     $('a[href="#employees"]').trigger('click');
    // }

    // else if( window.location.hash.indexOf("routes") != -1 ){

    //     $('a[href="#routes"]').trigger('click');
    // }
    // // else if( window.location.hash.indexOf("places") != -1 || window.location.hash.indexOf("sites") != -1 ){

    // //     $('a[href="#sites"]').trigger('click');
    // // }

    // else if( window.location.hash.indexOf("places") != -1 || window.location.hash.indexOf("sites") != -1 ){

    //     $('a[href="#sites"]').trigger('click');
    // }

    // else if( window.location.hash.indexOf("things") != -1 || window.location.hash.indexOf("shifts") != -1 ){

    //     $('a[href="#shifts"]').trigger('click');
    // }

    // else if( window.location.hash.indexOf("vehicles") != -1 ){

    //     $('a[href="#vehicles"]').trigger('click');
    // }
    // else if( window.location.hash.indexOf("devices") != -1 ){

    //     $('a[href="#devices"]').trigger('click');
    // }
    // else if( window.location.hash.indexOf("operator-trip-board") != -1 ){

    //     $('a[href="#operator-trip-board"]').trigger('click');
    // }
    // else if( window.location.hash.indexOf("operator-trip-board") != -1 ){

    //     $('a[href="#operator-trip-board"]').trigger('click');
    // }

    // else if( window.location.hash.indexOf("employee-change-request") != -1 ){

    //     $('a[href="#employee-change-request"]').trigger('click');
    // }
    // else if( window.location.hash.indexOf("employee-change-request") != -1 ){

    //     $('a[href="#employee-change-request"]').trigger('click');
    // }
    // else if( window.location.hash.indexOf("roster-test") != -1 ){

    //     $('a[href="#roster-test"]').trigger('click');
    // }
    // else if( window.location.hash.indexOf("routing-testing") != -1 ){

    //     $('a[href="#routing-testing"]').trigger('click');
    // }
    // else if( window.location.hash.indexOf("trips-notifications") != -1 ){

    //     $('a[href="#trips-notifications"]').trigger('click');
    // }
    // ///Configurator  ==========================================
    // else if( window.location.hash.indexOf("general_settings") != -1 ){

    //     $('a[href="#general_settings"]').trigger('click');
    // }


    


// $("#modal-employee-company").modal('show',{
//        backdrop:'static',
//        keyboard:false,
//      });

$(document).on("click","a[data-action='cancel']",function(){

if( "true" == $("#driver_add").attr('aria-expanded') ){
        
    $('a[href="/drivers/new"]').hide();

    }else{

    $('a[href="/drivers/new"]').show();

    }

    $('a[href="/drivers/new"]').removeAttr("disabled");
// });


// if( "true" == $("#driver_add").attr('aria-expanded') ){
        
//     $('a[href="/drivers/new"]').hide();

//     }else{

//     $('a[href="/drivers/new"]').show();

//     }

    $('a[href="/sites/new"]').removeAttr("disabled");
});



});




