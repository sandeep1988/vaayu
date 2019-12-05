angular.module('app').controller('tripboardCtrl', function ($scope, TripboardService, TripboardResponse, $timeout, ToasterService,TripboardBoardCallService) {


  $scope.init = function () {
    $scope.today();
    // date picket
    $scope.toggleMin();


    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

    // date function

    TripboardService.getAllSiteList(function (data) {
      $scope.siteList = data.data.list;
      $scope.selectedSiteID = $scope.siteList[0].id;
      $scope.getAllTrips();
    }
      , function (error) {
        console.error(error);
      });
  };
  // datepicker function
  $scope.today = function () {
    $scope.filterDate = new Date();
  };

  $scope.clear = function () {
    $scope.filterDate = null;
  };

  // Disable weekend selection
  $scope.disabled = function (date, mode) {
    // return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    return false;
  };

  $scope.toggleMin = function () {
    $scope.minDate = $scope.minDate ? null : new Date();
  };

  $scope.open = function ($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.panicCallSesion = function(id,type){
    var postdata={
      "toId":id,
      "callToType":type,
      "callRequestDateTime":moment().format('YYYY-MM-DD hh:mm:ss')
    };
    
    TripboardBoardCallService.get(postdata, (data) => {
     
      if (!data['success']) {
        ToasterService.showError('Error', data['message']);
        return;
      }else{
        ToasterService.showSuccess('Success','Call Ended');
      }

    }, function (error) {
      console.error(error);
    });
  }

  $scope.getAllTrips = function () {

    // $scope.fullRoster = TripboardResponse.tempResponse.tripsdetails;
    // $scope.stats = TripboardResponse.tempResponse.stats;
    // $scope.rosters = $scope.fullRoster;
    

    let postData = {
      "site_id": $scope.selectedSiteID,
      "to_date": moment($scope.filterDate).format('YYYY-MM-DD')
    }
    console.log(postData)
    TripboardService.get(postData, (data) => {
      console.log('TripboardService data', data);
      if (!data['success']) {
        ToasterService.showError('Error', data['message']);
        return;
      }
      $scope.fullRoster = data.data.tripsdetails;
      $scope.rosters = $scope.fullRoster;
      $scope.stats =  data.data.stats;

    }, function (error) {
      console.error(error);
    });

  }
  //date picker function


  $scope.showPopup = false;
  $scope.showModal = (row) => {
    console.log('showModal', row);
    $scope.modelData = row;
    $scope.showPopup = true;
    return ;

    // var mapProp = {
    //   center: new google.maps.LatLng(51.508742, -0.120850),
    //   zoom: 5,
    // };
    // var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);
    var map = new google.maps.Map(document.getElementById('googleMap'), {
      zoom: 4,
      center: { lat: 25.291, lng: 153.027 },
      mapTypeId: 'terrain'
    });

    // Define a symbol using SVG path notation, with an opacity of 1.
    var lineSymbol = {
      path: 'M 0,-1 0,1',
      strokeOpacity: 1,
      scale: 2
    };


    // Create the polyline, passing the symbol in the 'icons' property.
    // Give the line an opacity of 0.
    // Repeat the symbol at intervals of 20 pixels to create the dashed effect.
    var line = new google.maps.Polyline({
      path: [{ lat: 32.291, lng: 157.027 }, { lat: 22.291, lng: 153.027 }, { lat: 28.291, lng: 158.027 }, { lat: 18.291, lng: 153.027 }],
      strokeOpacity: 0,
      icons: [{
        icon: lineSymbol,
        offset: '0',
        repeat: '5px'
      }],
      map: map
    });


    var modal = document.getElementById("myModal");
    modal.style.display = "block";

    // Get the button that opens the modal
    // var btn = document.getElementById("myBtn");

    // // Get the <span> element that closes the modal
    var closepop = document.getElementsByClassName("closepop")[0];


    // When the user clicks the button, open the modal 
    // btn.onclick = function() {

    // }

    // When the user clicks on <span> (x), close the modal
    closepop.onclick = function () {
      modal.style.display = "none";
    }


    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

  }

  $scope.filterTrips = function (status) {
    $scope.rosters = $scope.fullRoster.filter(item => item.current_status === status)
  }


});