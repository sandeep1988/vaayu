require 'services/trip_validation_service'
require 'httparty'

module API::V1
  class TripsController < BaseController
    before_filter :authenticate_user!, :unless => :is_from_sms?
    skip_before_filter :authenticate_user!, :only => :panic_sms
    before_action :set_trip, :except => :panic_sms
    before_action :set_trip_routes, only: [ :driver_arrived, :on_board, :completed, :missed, :resolve_exception, :not_on_board ]

    api :GET, '/trips/:id'
    description 'Return trip by id'
    param :id, :number, required: true
    formats [ :json ]
    error code: 401, desc: 'Unauthorized'
    error code: 403, desc: 'User cannot access trip he does not belongs to'
    error code: 404, desc: 'Trip not found'
    example'{
      "id": 4,
      "status": "assigned",
      "trip_type": "check_out",
      "passengers": 2,
      "approximate_duration": 95,
      "approximate_distance": 77349,
      "date": 1480342200,
      "site": {
        "id": 1,
        "name": "Site_test",
        "location": {
          "latitude": "49.443687",
          "longitude": "32.051969"
        }
      },
      "trip_routes": [
        {
          "id": 7,
          "route_order": 0,
          "status": "not_started",
          "eta": 1480342800,
          "employee": {
            "id": 4,
            "username": "employee",
            "f_name": "Employee",
            "m_name": null,
            "l_name": "Test",
            "email": "employee@n3wnormal.com",
            "phone": "6665544",
            "home_address": "22 Heroiv Stalinhradu str, Cherkasy, Ukraine",
              "home_address_location": {
                "latitude": "49.435964",
                "longitude": "32.093944"
              }
          }
        },
        {
          "id": 8,
          "route_order": 1,
          "status": "not_started",
          "eta": 1480347720,
          "employee": {
            "id": 5,
            "username": "employee2",
            "f_name": "Employee2",
            "m_name": null,
            "l_name": "Test",
            "email": "employee2@n3wnormal.com",
            "phone": "66655442",
            "home_address": "Koneva 5, Cherkasy",
            "home_address_location": {
              "latitude": "49.416254",
              "longitude": "31.275124"
            }
          }
        }
      ]
    }'
    def show
      if !is_from_sms?
        authorize! :read, @trip
      end
      @config_values = TripValidationService.driver_config_params(@trip)
    end

    api :GET, '/trips/:id/start'
    description 'Driver started the trip'
    param :id, :number, required: true
    formats [ :json ]
    error code: 401, desc: 'Unauthorized'
    error code: 403, desc: 'User cannot access trip he does not belongs to'
    error code: 404, desc: 'Trip not found'
    example'{
      "success": true
    }'
    def start
      # current_user = Driver.find 1347
      flag = check_first_trip_completed(current_user,  @trip)
      if !flag
        begin
          # Update the trip route by factoring in the driver current location
          unless params[:lat].blank? || params[:lng].blank?
            @trip.update_route(params[:lat], params[:lng])
          end

          if @trip.start_trip!
            unless params[:request_date].blank?
              @trip.save_actual_start_trip_date(params[:request_date])
            end
            unless params[:lat].blank? || params[:lng].blank?
              @trip.set_trip_location({:lat => params[:lat].to_f, :lng => params[:lng].to_f}, 0, "0")
              #if ENV["CALCULATE_ETA"] == "true"
                #CalculateEtaWorker.perform_async(@trip.id)
              #end
            end
            @config_values = TripValidationService.driver_config_params(@trip)
            render 'show', status: 200
          else
            @trip.reload
            @config_values = TripValidationService.driver_config_params(@trip)
            render 'show', status: 422
          end
        rescue
          @trip.update(:cancel_status => "Backend Issue")
          @trip.cancel_complete_trip
          render '_errors', status: 451
        end
      end
    end

    api :GET, '/trips/:id/decline_trip_request'
    description 'Driver declines incoming trip request'
    param :id, :number, required: true
    formats [ :json ]
    error code: 401, desc: 'Unauthorized'
    error code: 403, desc: 'User cannot access trip he does not belongs to'
    error code: 404, desc: 'Trip not found'
    example'{
      "success": true
    }'
    def decline_trip_request
      unless @trip.driver && @trip.driver.user == current_user
        render '_trip_assign_request_expired', status: 422
        return
      end

      if !is_from_sms?
        authorize! :manage_trip_request, @trip
      end

      if @trip.assign_request_declined!
        @trip.unassign_driver_info
        @trip.unassign_driver!
        render 'decline_trip_request', status: 200
      else
        render '_errors', status: 422
      end

    end

    api :GET, '/trips/:id/accept_trip_request'
    description 'Driver accept incoming trip request'
    param :id, :number, required: true
    formats [ :json ]
    error code: 401, desc: 'Unauthorized'
    error code: 403, desc: 'User cannot access trip he does not belongs to'
    error code: 404, desc: 'Trip not found'
    example'{
      "success": true,
      "trip": {
        "id": 2,
        "status": "assigned",
        "trip_type": "check_in",
        "date": 1479106800
      }
    }'
    def accept_trip_request
      begin
        if !is_from_sms?
          unless @trip.driver && @trip.driver.user == current_user
            render '_trip_assign_request_expired', status: 422
            return
          end
          authorize! :manage_trip_request, @trip
        end

        if @trip.assign_request_accepted!
          unless params[:request_date].blank?
            @trip.save_actual_trip_accept_date(params[:request_date])
          end

          render 'accept_trip_request', status: 200
        else
          @trip.reload
          render 'accept_trip_request', status: 422
        end
      rescue
        @trip.update(:cancel_status => "Backend Issue")
        @trip.cancel_complete_trip
        render '_errors', status: 451
      end      
    end


    api :POST, '/trips/:id/trip_routes/driver_arrived'
    description 'Driver marked that he\'s arrived'
    param :id, :number, required: true
    formats [ :json ]
    error code: 401, desc: 'Unauthorized'
    error code: 403, desc: 'User cannot access trip he does not belongs to'
    error code: 404, desc: 'Trip not found'
    example '
    {
      "success": true
    }'
    def driver_arrived
      begin
        if !is_from_sms?
          authorize! :driver_arrived, @trip
        end

        errors = false
        #Geo fence check
        @trip_routes.each do |trip_route|
          if @trip.trip_type == 'check_in'
            unless params[:lat].blank? || params[:lng].blank?
              trip_route.check_driver_arrived_geofence(params[:lat], params[:lng])
            end        
          else
            unless params[:lat].blank? || params[:lng].blank?
              #Send notification only once
              trip_route.check_driver_arrived_geofence(params[:lat], params[:lng])
              break
            end          
          end
        end

        @trip_routes.each do |trip_route|
          unless params[:lat].blank? || params[:lng].blank?
            trip_route.update(driver_arrived_location: {:lat => params[:lat].to_f, :lng => params[:lng].to_f})
          end

          unless params[:request_date].blank?
            trip_route.set_actual_driver_arrived_date(params[:request_date])
          end

          if !trip_route.driver_arrived?
            errors = true unless trip_route.driver_arrived!
          end
        end

        if errors
          @config_values = TripValidationService.driver_config_params(@trip)
          render 'show', status: 422
        else
          if @trip.active?
            #if ENV["CALCULATE_ETA"] == "true"          
              #CalculateEtaWorker.perform_async(@trip.id)
            #end
          end        
          @config_values = TripValidationService.driver_config_params(@trip)
          render 'show', status: 200
        end
      rescue
        @trip.update(:cancel_status => "Backend Issue")
        @trip.cancel_complete_trip
        render '_errors', status: 451
      end      
    end

    api :POST, '/trips/:id/trip_routes/on_board'
    description 'Driver marked that employee was boarded'
    param :id, :number, required: true
    formats [ :json ]
    error code: 401, desc: 'Unauthorized'
    error code: 403, desc: 'User cannot access trip he does not belongs to'
    error code: 404, desc: 'Trip not found'
    example '
    {
      "success": true
    }'
    def on_board
      begin
        if !is_from_sms?
          authorize! :on_board, @trip
        end

        errors = false

        #Geo fence check
        @trip_routes.each do |trip_route|
          if @trip.trip_type == 'check_in'
            unless params[:lat].blank? || params[:lng].blank?
              trip_route.check_on_board_geofence(params[:lat], params[:lng])
            end
          else
            unless params[:lat].blank? || params[:lng].blank?
              #Send notification only once
              trip_route.check_on_board_geofence(params[:lat], params[:lng])
            end          
          end
        end

        @trip_routes.each do |trip_route|
          unless params[:lat].blank? || params[:lng].blank?
            trip_route.update(check_in_location: {:lat => params[:lat].to_f, :lng => params[:lng].to_f})
          end

          unless params[:request_date].blank?
            trip_route.set_actual_on_board_date(params[:request_date])
          end

          if !trip_route.on_board?  
            errors = true unless trip_route.boarded!
          end
        end

        if errors
          @trip.reload
          @config_values = TripValidationService.driver_config_params(@trip)
          render 'show', status: 422
        else
          if @trip.active?
            #if ENV["CALCULATE_ETA"] == "true"
              #CalculateEtaWorker.perform_async(@trip.id)
            #end
          end        
          @config_values = TripValidationService.driver_config_params(@trip)
          render 'show', status: 200
        end
      rescue
        @trip.update(:cancel_status => "Backend Issue")
        @trip.cancel_complete_trip
        render '_errors', status: 451
      end      
    end

    api :POST, '/trips/:id/trip_routes/completed'
    description 'Driver marked that employee has been delivered'
    param :id, :number, required: true
    formats [ :json ]
    error code: 401, desc: 'Unauthorized'
    error code: 403, desc: 'User cannot access trip he does not belongs to'
    error code: 404, desc: 'Trip not found'
    example '
    {
      "success": true
    }'
    def completed
      begin
        if !is_from_sms?
          authorize! :on_board, @trip
        end

        errors = false

        #Geo fence check
        @trip_routes.each do |trip_route|
          if @trip.trip_type == 'check_in'
            unless params[:lat].blank? || params[:lng].blank?
              trip_route.check_completed_geofence(params[:lat], params[:lng])
              break
            end
          else
            unless params[:lat].blank? || params[:lng].blank?
              #Send notification only once
              trip_route.check_completed_geofence(params[:lat], params[:lng])
            end          
          end
        end

        @trip_routes.each do |trip_route|
          unless params[:lat].blank? || params[:lng].blank?
            trip_route.update(drop_off_location: {:lat => params[:lat].to_f, :lng => params[:lng].to_f})
          end

          unless params[:request_date].blank?
            trip_route.set_actual_completed_date(params[:request_date])
          end

          if !trip_route.completed?
            if trip_route.not_on_board?
              errors = true unless trip_route.not_on_board_completed!
            else
              errors = true unless trip_route.completed!
            end            
          end
        end

        if errors
          @trip.reload
          @config_values = TripValidationService.driver_config_params(@trip)
          render 'show', status: 422
        else
          if @trip.active?
            #if ENV["CALCULATE_ETA"] == "true"
              #CalculateEtaWorker.perform_async(@trip.id)
            #end
          end        
          @trip.reload # Reload trip attributes after it has been updated
          @config_values = TripValidationService.driver_config_params(@trip)
          render 'show', status: 200
        end
      rescue
        @trip.update(:cancel_status => "Backend Issue")
        @trip.cancel_complete_trip
        render '_errors', status: 451
      end      
    end

    api :POST, '/trips/:id/trip_routes/not_on_board'
    description 'Driver marked that he has moved to next step'
    param :id, :number, required: true
    formats [ :json ]
    error code: 401, desc: 'Unauthorized'
    error code: 403, desc: 'User cannot access trip he does not belongs to'
    error code: 404, desc: 'Trip not found'
    example '
    {
      "success": true
    }'
    def not_on_board
      begin
        if !is_from_sms?
          authorize! :not_on_board, @trip
        end

        errors = false

        @trip_routes.each do |trip_route|
          unless params[:lat].blank? || params[:lng].blank?
            trip_route.update(move_to_next_step_location: {:lat => params[:lat].to_f, :lng => params[:lng].to_f})
          end

          unless params[:request_date].blank?
            trip_route.set_move_to_next_step_date(params[:request_date])
          end

          if trip_route.driver_arrived?
            errors = true unless trip_route.not_on_board!
          end
        end

        if errors
          @trip.reload
          @config_values = TripValidationService.driver_config_params(@trip)
          render 'show', status: 422
        else      
          @trip.reload # Reload trip attributes after it has been updated
          @config_values = TripValidationService.driver_config_params(@trip)
          render 'show', status: 200
        end
      rescue
        @trip.update(:cancel_status => "Backend Issue")
        @trip.cancel_complete_trip
        render '_errors', status: 451
      end      
    end

    def change_status_request_assigned
      @trip.assign_driver_accept_restarted!
      @trip.reload      
    end

    # def assign_driver
    #   @driver = Driver.find(params['driver_id'])
    #   @vehicle = @driver.vehicle
    #   @trip = Trip.find(params[:id])
      
    #   if params['last_paired_vehicle'].present?
    #     @last_paired_vehicle = Vehicle.where('plate_number' => params['last_paired_vehicle'])&.first&.id
    #   end

    #   if @vehicle.present? && @trip.employee_trips.count > @vehicle&.seats
    #     render :json => { :error => 'To many people to one car' }
    #     return
    #   else
    #     @employee_trips = EmployeeTrip.joins(:trip_route).where(:trip => @trip).order('trip_routes.scheduled_route_order ASC')
    #     get_trip_data(@employee_trips)
    #     if params[:exception] == 'true'
    #       @exception = 1
    #     else
    #       @exception = 0
    #     end
    #     # render 'show_trip_on_dispatch'
    #     render json: { :success => true, :trip => @trip, :employee_trips => @employee_trips, :submit => true, :exception => @exception, :driver => @driver, :vehicle => @vehicle, :last_paired_vehicle => @last_paired_vehicle }
    #   end
    # end

    def resolve_exception
      errors = []
      @trip_route_exception = TripRouteException.where(:trip_route => @trip_routes).where(:exception_type => 'employee_no_show').where(:status => 'open')
      @trip_route_exception.each do |trip_route_exception|
        if !trip_route_exception.resolved!
          # return full trip to driver to maintain actual app status
          errors.push(trip_route_exception.errors.full_messages)
        end
      end

      @notification = Notification.where(:trip => @trip, :message => 'employee_no_show', :employee => @trip_routes.first.employee_trip.employee, :resolved_status => false)
      @notification.each do |notification|
        notification.update!(resolved_status: true)
      end

      if errors.blank?
        if current_user.driver?
          @trip.reload
          @config_values = TripValidationService.driver_config_params(@trip)
          render 'api/v1/trips/show', status: 200
        else
          render 'api/v1/base/_success', status: 200
        end
      else
        render 'api/v1/base/_errors', status: 422
      end
    end

    def verify_driver_image
      if params[:result].to_i.present? and params[:id].present? and params[:employee_trip_id].present?
        if params[:result].to_i.zero?
          render json: { status: 200}
        else
          render json: { status: 404}
          send_notification(params)
        end
      end
    end

    def panic_sms
      to = params[:ph].to_i
      message = "PANIC ALERT raised by Emp:#{params[:emp]}, ID:#{params[:id]}, PH:#{params[:ph]} on #{params[:vehicle_no]}, #{params[:name]}, #{params[:ph2]} on #{params[:dateTime]}"
      response = HTTParty.get("http://mahindrasms.com:8080/mConnector/dispatchapi?cname=mnmlog&tname=mnmlog&login=mnmlog&to=#{to}&text=#{message}")
      puts "#{response}"
      p "#{message}"
    end

    protected
    def set_trip
      @trip = Trip.find(params[:id])
    end

    def check_first_trip_completed(user,trip)
      todays_trips = user.trips.where('start_date >= ?', Time.new.in_time_zone('Chennai').beginning_of_day)
      if todays_trips.present?
        if ((user.trips.pluck(:id).index(trip.id) - 1 ) >= 0)
          last_trip = user.trips.pluck(:id).at(user.trips.pluck(:id).index(trip.id) -1 )
          if user.trips.find(last_trip).status != "completed"
            render json: { success: false , message: "Please start first trip then you can start second trip", data: {}, errors: { "errors": ["Please start first trip then you can start second trip"] }}, status: :ok
          else
            return false
          end
        end
      end
    end

    def send_notification(params)
      data = { employee_trip_id: params[:employee_trip_id].to_i } if params[:employee_trip_id].present?
      data = data.merge!(push_type: :driver_face_detection)
      data.merge!(notification: { title: I18n.t("push_notification.driver_face_verified.title"), body: I18n.t("push_notification.driver_face_verified.body") })
        VerifiedDriverImage.perform_async(params)
        trip = Trip.find (params[:id]) if params[:id].present?
        trip.employees.each do |employee|
          user = employee.user.id
          PushNotificationWorker.perform_async(user, :driver_face_detection, data, :user) if employee.present?
       end 
    end

    def set_trip_routes
      @trip_routes = @trip.trip_routes.where(id: params[:trip_routes])
    end



    def is_from_sms?
      if params[:is_from_sms] == "true"
        current_user = User.find(params[:uid])
      end
      params[:is_from_sms] == "true"
    end

    def get_trip_data(employee_trips)
      @address_mapping = {}
      @eta_mapping = {}
      @status_mapping = {}
      @status_length_mapping = {}
      @colspan_mapping = {}
      @rowspan_mapping = {}
      @last = nil
      
      last_checked = ''
      reset = false
      employee_trips.each do |et|
        if @address_mapping.has_key? et&.trip_route&.scheduled_route_order
          @address_mapping[et&.trip_route&.scheduled_route_order] << et
        else
          @address_mapping[et&.trip_route&.scheduled_route_order] = [et]
        end
      end

      @address_mapping.each do |address, ets|
        height = 0
        total = ets.size
        last = ets&.first&.employee&.id
        @eta_mapping[last] = ets.size

        ets.each do |et|

          
          if et.trip_route.status == 'missed' || et.trip_route.status == 'canceled'
            if et.trip_route.status == 'canceled' && !et.trip_route.cancel_exception?
              @status_mapping[et&.employee.id] = 'Canceled'                      
            elsif et.trip_route.status == 'canceled' && et.trip_route.cancel_exception? && et.trip_route.cab_fare.blank?
              @status_mapping[et&.employee.id] = 'CWE'
            elsif et.trip_route.status == 'canceled' && et.trip_route.cancel_exception? && !et.trip_route.cab_fare.blank?
              @status_mapping[et&.employee.id] = 'Booked Ola/Uber'
            elsif et.trip_route.status == 'missed'
              @status_mapping[et&.employee.id] = 'No Show'
            end
            @rowspan_mapping[et&.employee&.id] = 1
            @colspan_mapping[et&.employee&.id] = 1
            if !@last.nil?
              @rowspan_mapping[last] = height
            end
            last = nil
            height = 0
            total = total - 1
          else
            height = height + 1
            if last.nil?
              last = et&.employee&.id
            end
            @rowspan_mapping[et&.employee&.id] = 0
            @rowspan_mapping[last] = height
          end



          # if et.trip_route.status != 'canceled' && et.trip_route.status != 'missed'
          #   if reset
          #     last_checked = et&.employee.id
          #   end
          #   if @eta_mapping[last_checked].nil?
          #     @eta_mapping[last_checked] = 1
          #   else
          #     @eta_mapping[last_checked] = @eta_mapping[last_checked] + 1  
          #   end
          #   reset = false
          # else
          #   if et.trip_route.status == 'canceled' && !et.trip_route.cancel_exception?
          #     @status_length_mapping[et&.employee.id] = 1
          #     @status_mapping[et&.employee.id] = 'Canceled'                      
          #   elsif et.trip_route.status == 'canceled' && et.trip_route.cancel_exception? && et.trip_route.cab_fare.blank?
          #     @status_length_mapping[et&.employee.id] = 1
          #     @status_mapping[et&.employee.id] = 'CWE'
          #   elsif et.trip_route.status == 'canceled' && et.trip_route.cancel_exception? && !et.trip_route.cab_fare.blank?
          #     @status_length_mapping[et&.employee.id] = 1
          #     @status_mapping[et&.employee.id] = 'Booked Ola/Uber'
          #   elsif et.trip_route.status == 'missed'
          #     @status_length_mapping[et&.employee.id] = 1
          #     @status_mapping[et&.employee.id] = 'No Show'
          #   end
          #   if !reset
          #     last_checked = et&.employee.id
          #   end    
          #   @eta_mapping[last_checked] = 1
          #   reset = true
          # end
        end
      end
    end
  end
end
