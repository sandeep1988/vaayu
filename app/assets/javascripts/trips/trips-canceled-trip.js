$(function () {
    'use strict';

    /**
     * Init table
     */
    var table = '#employee-canceled-trips-table';
    var employeeCanceledTripsTable = $();

    $('a[href="#employee-canceled-trips"]').on('shown.bs.tab', function (e) {
        if (loadedTabs['employee-canceled-trips']) return;

        // set loaded state
        loadedTabs['employee-canceled-trips'] = true;

        if (!loadedDatatables[table]) {

            employeeCanceledTripsTable = $(table).DataTable({
                serverSide: true,
                ajax: {
                    url: "/trips",
                    data: {
                        status: 'canceled'
                    }
                },
                lengthChange: false,
                searching: false,
                pagingType: "simple_numbers",
                processing: true,
                info: false,
                autoWidth: false,
                ordering: false,
                columns: [
                    {
                        data: null,
                        orderable: false,
                        render: function (data) {
                            return '<a href="/trips/' + data.id + '/" class="btn-trip-info" data-remote="true" data-method="GET">' + data.date + ' - ' + data.id + '</a>'
                        }
                    },
                    {
                        data: null,
                        orderable: false,
                        width: '2%',
                        className: 'text-center map-picker-ico',
                        render: function (data) {
                            return '<a href="#"><svg width="14" height="23" viewBox="0 0 14 23" xmlns="http://www.w3.org/2000/svg">' +
                                '<title>9B2F9D7E-96D4-441D-9598-6A0CE8BB4800</title>' +
                                '<path d="M12.253 3.92c-.71-1.27-1.828-2.248-3.32-2.765-.263-.094-.527-.17-.8-.216-.29-.058-.61-.095-.936-.114h-.39c-.33.02-.647.056-.938.113-.283.046-.547.12-.8.215-1.493.517-2.62 1.496-3.33 2.766-.482.876-.81 1.967-.727 3.303.027.61.19 1.166.372 1.665.19.49.41.93.664 1.355.99 1.665 2.327 3.142 3.082 5.042.39.96.728 1.966 1.02 3.04.28 1.062.544 2.18.654 3.414h.39c.11-1.234.364-2.353.646-3.416.29-1.073.637-2.08 1.02-3.04.763-1.9 2.1-3.376 3.082-5.04.264-.425.482-.867.673-1.356.182-.5.336-1.054.373-1.665.072-1.336-.246-2.427-.737-3.302zM6.995 9.147c-1.266 0-2.286-1.01-2.286-2.253s1.02-2.245 2.285-2.245c1.267 0 2.296 1.002 2.296 2.245 0 1.242-1.028 2.253-2.295 2.253z" ' +
                                'class="pin-body" stroke="#00A89F" fill="none" fill-rule="evenodd"/></svg></a>';
                        }
                    }
                ],
                initComplete: function () {
                    loadedDatatables[table] = true;
                     var info = this.api().page.info();
                     $('#canceled-trips-count').text("Total Canceled Trips: " + info.recordsTotal);                    
                }
            });

        }
    });

    /**
     * Init map
     */
    var employeeCanceledTripsMapID = 'map-employee-canceled-trips';

    if ($('#map-employee-canceled-trips').length) {
        maps[employeeCanceledTripsMapID] = Gmaps.build('Google', {markers: {clusterer: undefined}});

        maps[employeeCanceledTripsMapID].buildMap({
            internal: {
                id: employeeCanceledTripsMapID
            },
            provider: mapProviderOpts
        });
    }

    // show markers on map
    $(table).on('click', '.map-picker-ico a', {
        mapId: employeeCanceledTripsMapID,
        table: table
    }, showRouteMarkersData);
});