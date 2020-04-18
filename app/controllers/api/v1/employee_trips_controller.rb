require 'services/trip_validation_service'

module API::V1
  class EmployeeTripsController < BaseController
    before_action :set_employee_trip, except: :create
    before_action :set_employee, except: :show
    before_action :set_trip_route, only: :exception

    api :GET, '/employee_trips/:id'
    description 'Returns employee trip by id'
    param :id, :number, required: true
    formats [ :json ]
    error code: 401, desc: 'Unauthorized'
    error code: 403, desc: 'Employee cannot access others trip data'
    error code: 404, desc: 'Employee trip not found'
    example'
    {
      "id": 1,
      "date": "2016-10-31T08:00:00.000Z",
      "trip_type": "check_in",
      "status": "created"
    }'
    # @TODO: test
	def show
		authorize! :read, @employee_trip
		#tetsing trip id
		p "=====employee_trip trip===="
		p @employee_trip.trip
		###updatinging code starts here
		if @employee_trip.trip.present?
			p "===== is coming here "
			p @employee_trip.trip.start_date
			#check_start_date = @employee_trip.trip.start_date.in_time_zone("Kolkata")
			p "=== check start date "
			#p check_start_date
			p "===current time "
			p Time.now.in_time_zone("Kolkata")
			p "=====employee trip status "
			p @employee_trip.trip.status
			#"completed"
			#if (@employee_trip.trip.status == "active" && check_start_date >= Time.now.in_time_zone("Kolkata"))
				p "===== 123 is coming here "
				@trip = @employee_trip.trip
				@site = @trip.try(:site)
				@vehicle = @trip.try(:vehicle)
				if @trip.present?
					@config_values = TripValidationService.employee_config_params(@trip)
				end
			#end
		end
		###updatinging code end here     
    end

    api :POST, '/employee_trips/:id/cancel'
    description 'Send request to cancel employee trip'
    param :id, :number, required: true
    formats [ :json ]
    error code: 401, desc: 'Unauthorized'
    error code: 403, desc: 'Employee cannot access others trip data'
    error code: 404, desc: 'Employee trip not found'
    example '
    {
     "success": true
    }'
    def cancel
      authorize! :edit, @employee_trip

      @trip_change_request = @employee_trip.trip_change_requests.new(
          reason: params[:reason],
          request_type: :cancel,
          employee: @employee,
          bus_rider: @employee.bus_travel
      )

      if @trip_change_request.save

        #Pick this variable from the Configurator
        #Generate Notification for Auto approve Cancel request
        if @employee_trip.trip.present?
          @employee_canceled_trip_notification = Notification.where(:trip => @employee_trip.trip, :employee => @employee, :message => 'employee_canceled_trip').first
          if @employee_canceled_trip_notification.blank?
            Notification.create!(:trip => @employee_trip.trip, :employee => @employee, :message => 'employee_canceled_trip', :new_notification => true, :resolved_status => true, :reporter => "Employee: #{@employee.full_name}").send_notifications    
          end

          @cancel_request_approved_notification = Notification.where(:trip => @employee_trip.trip, :employee => @employee, :message => 'cancel_request_approved').first

          if @cancel_request_approved_notification.blank?
            Notification.create!(:trip => @employee_trip.trip, :employee => @employee, :message => 'cancel_request_approved', :new_notification => true, :resolved_status => true, :reporter => "Vaayu System").send_notifications
          end
        end
        @trip_change_request.approve!
        @trip_change_request.reload

        render 'api/v1/trip_change_requests/create', status: 200
      else
        render 'api/v1/trip_change_requests/_error', status: 422
      end
    end

    api :POST, '/employee_trips/:id'
    description 'Send request to change employee trip date/time'
    param :id, :number, required: true
    formats [ :json ]
    error code: 401, desc: 'Unauthorized'
    error code: 403, desc: 'Employee cannot access others trip data'
    error code: 404, desc: 'Employee trip not found'
    example '
    {
     "success": true
    }'
    def update
		
      authorize! :edit, @employee_trip

      @trip_change_request = @employee_trip.trip_change_requests.new(
          reason: params[:reason],
          request_type: :change,
          employee: @employee,
          bus_rider: @employee.bus_travel
      )
	  p "=== checking"
	  p @trip_change_request
	  p "=== new date time"
	  p Time.at(params[:new_date].to_i)
	  p "=== new date time UTC"
	  p Time.at(params[:new_date].to_i).in_time_zone("UTC")
	  
	  @trip_change_request.new_date = Time.at(params[:new_date].to_i) if params[:new_date].present?

      if @trip_change_request.save

        #Pick this variable from the Configurator
        if Configurator.get('change_request_require_approval') == '0'
          #Generate Notification for Auto Approve Change Request          
          if @employee_trip.trip.present?
            @employee_changed_trip_notification = Notification.where(:trip => @employee_trip.trip, :employee => @employee, :message => 'employee_changed_trip').first

            if @employee_changed_trip_notification.blank?
              Notification.create!(:trip => @employee_trip.trip, :employee => @employee, :message => 'employee_changed_trip', :new_notification => true, :resolved_status => true, :reporter => "Employee: #{@employee.full_name}").send_notifications
            end

            @change_request_approved_notification = Notification.where(:trip => @employee_trip.trip, :employee => @employee, :message => 'change_request_approved').first

            if @change_request_approved_notification.blank?
              Notification.create!(:trip => @employee_trip.trip, :employee => @employee, :message => 'change_request_approved', :new_notification => true, :resolved_status => true, :reporter => "Vaayu System").send_notifications
            end
          end
          @trip_change_request.approve!
          @trip_change_request.reload
        else
          #Generate Notification for Change Request
          if @employee_trip.trip.present?
            @employee_changed_trip_notification = Notification.where(:trip => @employee_trip.trip, :employee => @employee, :message => 'employee_changed_trip').first

            if @employee_changed_trip_notification.blank?
              Notification.create!(:trip => @employee_trip.trip, :employee => @employee, :message => 'employee_changed_trip', :new_notification => true, :resolved_status => true, :reporter => "Employee: #{@employee.full_name}").send_notifications
            end
          end
        end

        render 'api/v1/trip_change_requests/create', status: 200
      else
        render 'api/v1/trip_change_requests/_error', status: 422
      end
    end

    api :POST, '/employee_trips'
    description 'Send request for a trip'
    formats [ :json ]
    error code: 401, desc: 'Unauthorized'
    error code: 403, desc: 'Employee cannot access others trip data'
    error code: 404, desc: 'Employee trip not found'
    example '
    {
     "success": true
    }'
    def create
		p "=== trip created"
      authorize! :request_trip, @employee

      shift = false
      if params[:shift] == true
        shift = true
      end
      if params[:trip_type] == "check_out"
        e_t= Time.at(params[:new_date].to_i) if params[:new_date].present?
        end_time = e_t.strftime("%H:%M")
        if @employee.shifts.where(end_time: end_time).first.present?
          shift_selected_id = @employee.shifts.where(end_time: end_time).first.id if end_time.present?
        else 
          shift_selected_id = nil  
        end  
      elsif params[:trip_type] == "check_in"
        s_t = Time.at(params[:new_date].to_i) if params[:new_date].present?
        start_time = s_t.strftime("%H:%M")
        if @employee.shifts.where(start_time: start_time).first.present?
          shift_selected_id = @employee.shifts.where(start_time: start_time).first.id if start_time.present?
        else
          shift_selected_id = nil
        end  
      end
		p "===shift_selected_id : #{shift_selected_id}"
      @trip_change_request = TripChangeRequest.new(
          trip_type: params[:trip_type],
          request_type: :new_trip,
          employee: @employee,
          bus_rider: @employee.bus_travel,
          schedule_date: params[:schedule_date],
          shift: true,
          shift_id: shift_selected_id
      )

      @trip_change_request.new_date = Time.at(params[:new_date].to_i) if params[:new_date].present?

      if @trip_change_request.save
        render 'api/v1/trip_change_requests/create', status: 200
      else
        render 'api/v1/trip_change_requests/_error', status: 422
      end
    end

    api :POST, '/employee_trips/:id/rate'
    description 'Rate trip (employee)'
    param :id, :number, required: true
    formats [ :json ]
    error code: 401, desc: 'Unauthorized'
    error code: 403, desc: 'Employee cannot access others trip data'
    error code: 404, desc: 'Employee trip not found'
    example '
    {
     "success": true
    }'
    def rate
      authorize! :edit, @employee_trip

      unless @employee_trip.rate(params[:rating], params[:rating_feedback], params[:trip_issues])
        render '_errors', status: 422
      end
    end

    api :POST, '/employee_trips/:id/exception'
    description 'Employee marked that smth wrong with his trip (still on board or driver not arrived)'
    param :id, :number, required: true
    formats [ :json ]
    error code: 401, desc: 'Unauthorized'
    error code: 403, desc: 'User cannot access trip he does not belongs to'
    error code: 404, desc: 'Trip route not found'
    example '
    {
      "success": true,
      "id": 1,
      "exception_type": "still_on_board",
      "status": "open",
      "date": 1482830372
    }'
    # @TODO: test
    def exception
      authorize! :edit, @employee_trip

      if @trip_route
        @trip_route_exception = @trip_route.trip_route_exceptions.new( exception_type: params[:exception_type], date: Time.now )

        if @trip_route_exception.save
          reporter = "Employee: #{@employee.full_name}"
          @notification = Notification.where(:trip => @trip_route.trip, :driver => @trip_route.trip.driver, :employee => @employee, :message => @trip_route_exception.exception_type, :resolved_status => false).first

          if @notification.blank?
            Notification.create!(:trip => @trip_route.trip, :driver => @trip_route.trip.driver, :employee => @employee, :message => @trip_route_exception.exception_type, :resolved_status => false,:new_notification => true, :reporter => reporter).send_notifications
          end
        else
          @errors = @trip_route_exception.errors.full_messages
          render 'api/v1/base/_errors', status: 422
        end
      else
        render 'api/v1/employee_trips/_error_not_in_trip', status: 422
      end
    end

    api :GET, '/employee_trips/:id/dismiss_trip'
    description 'Do not show missed trip to employee'
    param :id, :number, required: true
    formats [ :json ]
    error code: 401, desc: 'Unauthorized'
    error code: 403, desc: 'User cannot access trip he does not belongs to'
    error code: 404, desc: 'Trip route not found'
    example '
    {
      "success": true
    }'
    # @TODO tests
    def dismiss_trip
      authorize! :edit, @employee_trip

      if @employee_trip.update(dismissed: true)
        render 'api/v1/base/_success', status: 200
      else
        @errors = @employee_trip.errors.full_messages
        render 'api/v1/base/_errors', status: 422
      end

    end

    def trip_rated
      @employee_trip.update(is_rating_screen_shown: true)
    end

    def employee_on_board
      @employee_trip.update(is_still_on_board_screen_shown: true)
    end

    protected

    def set_employee_trip
      @employee_trip = EmployeeTrip.find(params[:id])
    end

    def set_employee
      @employee = current_user.entity
    end

    def set_trip_route
      @trip_route = @employee_trip.trip_route
    end
  end
end