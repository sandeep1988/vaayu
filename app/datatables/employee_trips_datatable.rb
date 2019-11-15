require 'services/trip_validation_service'

class EmployeeTripsDatatable
  include DatatablePagination

  delegate :params, to: :@view

  def initialize(view, current_user = nil)
    @view = view
    @current_user = current_user
    @is_nodal_allowed = TripValidationService.is_nodal_allowed
  end

  def as_json(options = {})
    @employee_trips = data
    {
        sEcho: params[:sEcho].to_i,
        iTotalRecords: @employee_trips.count,
        iTotalDisplayRecords: @employee_trips.count,
        aaData: @employee_trips
    }
  end

  # TODO: mark employee trip as mised or smth
  def empl_trips
    name = params['search'].split(' ')
    if name[0].present? && name[1].present?
      query = 'users.f_name like "%' + name[0] + '%" and users.l_name like "%' + name[1] + '%"'
    else
      query = 'users.f_name like "%' + params['search'] + '%" or users.l_name like "%' + params['search'] + '%"'
    end

    if params['bus_rider'].blank?
      bus_rider = [true, false]
    else
      if params['bus_rider'] == '1'
        bus_rider = [true]
      else
        bus_rider = [false]
      end
    end

    filter_params_data = filter_params

    startDate = filter_params_data['startDate']
    endDate = filter_params_data['endDate']
    tripType = filter_params_data['trip_type']

    #Do the step below in case transport desk manager has ability to approve/reject requests or in case it is employer or admin
    if @current_user || @current_user.employer? || (@current_user.transport_desk_manager? && ENV["ENABLE_TRANSPORT_DESK_MANAGER_APPROVE"] == "true")
      trip_change_request = TripChangeRequest
          .includes(:employee => [:site, :user])
          .where(:request_type => :new_trip)
          .where(query)
          .where('employees.bus_travel' => bus_rider)
          .where(:request_state => 'created')
          .where(:new_date => startDate..endDate)
          .where(:trip_type => tripType)
          .where('employees.is_guard' => '0')
          .order('trip_change_requests.new_date ASC')

      trip_change_request_clustered_employees = TripChangeRequest
          .includes(:employee_trip, :employee => [:site, :user])
          .where(query)
          .where(:request_type => [:cancel, :change])
          .where(:request_state => 'created')
          .where('employee_trips.date > ?', startDate)
          .where('employee_trips.date < ?', endDate)
          .where('employee_trips.trip_type' => tripType)
          .where('employee_trips.bus_rider' => bus_rider)
          .where.not('employee_trips.employee_cluster_id' => nil)
          .where('employees.is_guard' => '0')
          .order('employee_trips.date ASC')  

      employee_trip_request = EmployeeTrip
             .includes(:trip_change_requests, :employee => [:site, :user])
             .where(query)
             .where(:bus_rider => bus_rider)
             .where(:status => ['upcoming', 'unassigned', 'reassigned'])
             .where(:date => startDate..endDate)
             .where(:trip_type => tripType)
             .where(:employee_cluster => nil)
             .where('employees.is_guard' => '0')
             .order('employee_trips.date ASC')
             .to_a.uniq {|e| [e.date, e.employee_id, e.trip_type]}    

      trips =  trip_change_request + trip_change_request_clustered_employees + employee_trip_request

      # if(ENV["GEOHASH_AUTO_CLUSTERING"] == "true")
      #   trips.sort do |a,b|
      #     date1 = ""
      #     date2 = ""
      #     if a.has_attribute?(:date)
      #       date1 = a.date
      #     elsif a.has_attribute?(:new_date) && a.request_type != "cancel"
      #       date1 = a.new_date
      #     else
      #       date1 = a.employee_trip.date
      #     end

      #     if b.has_attribute?(:date)
      #       date2 = b.date
      #     elsif b.has_attribute?(:new_date) && b.request_type != "cancel"
      #       date2 = b.new_date
      #     else
      #       date2 = b.employee_trip.date
      #     end

      #     if date1 == date2
      #       a.employee.geohash <=> b.employee.geohash
      #     else
      #       date1 <=> date2
      #     end
      #   end
      # else
      #   trips
      # end
    elsif @current_user.line_manager?
      new_trip_request = TripChangeRequest.joins(:employee => [:user])
          .includes(:employee => [:site, :user])
          .where(query)
          .where('employees.bus_travel' => bus_rider)
          .where(:request_type => :new_trip)
          .where(:request_state => 'created')
          .where(:new_date => startDate..endDate)
          .where(:trip_type => tripType)
          .where('employees.is_guard' => '0')
          .order('trip_change_requests.new_date ASC')

      trip_change_request = TripChangeRequest.joins(:employee_trip, :employee => [:user])
          .includes(:employee => [:site, :user])
          .where(query)
          .where(:request_type => [:cancel, :change])
          .where(:request_state => 'created')
          .where('employee_trips.date > ?', startDate)
          .where('employee_trips.date < ?', endDate)
          .where('employee_trips.trip_type' => tripType)
          .where('employees.is_guard' => '0')
          .order('employee_trips.date ASC')

      trips = new_trip_request + trip_change_request

      # if(ENV["GEOHASH_AUTO_CLUSTERING"] == "true")
      #   trips.sort do |a,b| 
      #     date1 = ""
      #     date2 = ""
      #     if a.request_type == 'cancel'
      #       date1 = a.employee_trip.date
      #     else
      #       date1 = a.new_date
      #     end

      #     if b.request_type == 'cancel'
      #       date2 = b.employee_trip.date
      #     else
      #       date2 = b.new_date
      #     end      
      #     if date1 == date2
      #       a.employee.geohash <=> b.employee.geohash
      #     else
      #       date1 <=> date2
      #     end
      #   end
      # else
      #   trips
      # end
    else
      employee_trip_request = EmployeeTrip
                   .includes(:employee => [:site, :user])
                   .joins(:employee => [:site, :user])
                   .where(query)
                   .where(:bus_rider => bus_rider)
                   .where(:status => ['upcoming', 'unassigned', 'reassigned'])
                   .where(:date => startDate..endDate)
                   .where(:trip_type => tripType)
                   .where(:is_clustered => false)
                   .where('employees.is_guard' => '0')
                   .order('employee_trips.date ASC')     
                   .to_a.uniq {|e| [e.date, e.employee_id, e.trip_type]}
      employee_trip_request
    end
  end

  private

  def data
    # i = 0
    # j = 0
    # date = ""
    # datetime = ""
    employee_trips = fetch_employee_trips
    employee_trips.map do |trip|
      # if j == 0
      #   if trip.has_attribute?(:date)
      #     date = trip.date.strftime("%H:%M")
      #     datetime = trip.date.strftime("%m/%d/%Y")
      #   else
      #     if trip.request_type == "cancel"
      #       date = trip.employee_trip.date.strftime("%H:%M")
      #       datetime = trip.employee_trip.date.strftime("%m/%d/%Y")              
      #     else
      #       date = trip.new_date.strftime("%H:%M")
      #       datetime = trip.new_date.strftime("%m/%d/%Y")              
      #     end
      #   end
      # else
      #   if trip.has_attribute?(:date)
      #     if (j % 4 == 0) || date != trip.date.strftime("%H:%M") || datetime != trip.date.strftime("%m/%d/%Y")
      #       date = trip.date.strftime("%H:%M")
      #       datetime = trip.date.strftime("%m/%d/%Y")          
      #       i = i + 1
      #     end
      #   else
      #     if trip.request_type == "cancel"
      #       if (j % 4 == 0) || date != trip.employee_trip.date.strftime("%H:%M") || datetime != trip.employee_trip.date.strftime("%m/%d/%Y")
      #         date = trip.employee_trip.date.strftime("%H:%M")
      #         datetime = trip.employee_trip.date.strftime("%m/%d/%Y")          
      #         i = i + 1
      #       end              
      #     else
      #       if (j % 4 == 0) || date != trip.new_date.strftime("%H:%M") || datetime != trip.new_date.strftime("%m/%d/%Y")
      #         date = trip.new_date.strftime("%H:%M")
      #         datetime = trip.new_date.strftime("%m/%d/%Y")          
      #         i = i + 1
      #       end              
      #     end            
      #   end
      # end

      # j = j + 1
      EmployeeTripDatatable.new(trip, employee_trips, nil, nil, @current_user, @is_nodal_allowed).data      
    end
  end

  def fetch_employee_trips
    @trip ||= fetch_trip
  end

  def fetch_trip
    empl_trips
    #if(ENV["GEOHASH_AUTO_CLUSTERING"] == "true")
    #  trip = empl_trips[0]
    #  zones = empl_trips[1]
    #  # trip = Kaminari.paginate_array(trip).page(page).per(per_page)
    #  # zones = Kaminari.paginate_array(zones).page(page).per(per_page)
    #  return trip, zones
    #else
    #  # trip = empl_trips
    #  # if @current_user || @current_user.employer? || (@current_user.transport_desk_manager? && ENV["ENABLE_TRANSPORT_DESK_MANAGER_APPROVE"] == "true") || @current_user.line_manager?
    #  #   # trip = Kaminari.paginate_array(trip).page(page).per(per_page)
    #  # else
    #  #   # trip = trip.page(page).per(per_page)
    #  # end
    #  trip      
    #end
  end
  
  # get params from date filter
  def filter_params
    today = Time.zone.now.beginning_of_day.in_time_zone('UTC')
    tommorow = Time.zone.now.tomorrow.end_of_day.in_time_zone('UTC')
    startdate = Time.zone.parse(params['startDate']).in_time_zone('UTC') unless params['startDate'].blank?
    endDate = Time.zone.parse(params['endDate']).in_time_zone('UTC') unless params['endDate'].blank?
    tripType = params['direction'].blank? ? ['0', '1'] : params['direction']

    if params['bus_rider'].blank?
      bus_rider = [true, false]
    else
      if params['bus_rider'] == '1'
        bus_rider = [true]
      else
        bus_rider = [false]
      end
    end

    if params['endDate'].blank?
      employee_trip = EmployeeTrip
         .where(:status => ['upcoming', 'unassigned', 'reassigned'])
         .where(:trip_type => tripType)
         .where(:bus_rider => bus_rider)
         .where(:date => startdate..startdate.end_of_day)
         .order('employee_trips.date ASC')
         .limit(1)
         .first

      # new_trip_request = []

      # if !bus_rider
      #   new_trip_request = TripChangeRequest
      #       .where(:request_type => :new_trip)
      #       .where(:request_state => 'created')
      #       .where(:new_date => startdate..startdate.end_of_day)
      #       .where(:trip_type => tripType)
      #       .order('trip_change_requests.new_date ASC')
      #       .limit(1)
      #       .first
      # end

      if employee_trip.present?
        endDate = employee_trip.date.in_time_zone('UTC')
      end

      # if new_trip_request.present?
      #   if endDate.blank? || new_trip_request.new_date.in_time_zone('UTC') < endDate
      #     endDate = new_trip_request.new_date.in_time_zone('UTC')
      #   end
      # end
    end
    
    {
        'startDate' => startdate,
        'endDate'=> endDate.blank? ? startdate.end_of_day : endDate,
        'trip_type' => tripType
    }
  end

  def possible_sort_columns
    %w[status date]
  end

  # def set_zones 
  #   @employee_trips = EmployeeTrip.joins(:employee).where(:date => filter_params['startDate']..filter_params['endDate']).where(trip_type: filter_params['trip_type']).where(status: :upcoming).group_by(&:employee_trip_date)
  #   @zone = 1
  #   @ret_trips = []
  #   @ret_zones = []

  #   @employee_trips.each do |et|      
  #     #Refresh the employee_trips array
  #     size = 6
  #     @trips = EmployeeTrip.joins(:employee).where(trip_type: filter_params['trip_type']).where(status: :upcoming).where(date: et.last.first.date).order('employees.distance_to_site desc')

  #     while @trips.size > 0 do
  #       case size
  #       when 6
  #         @trips_grouped_by_geohash = @trips.group_by(&:employee_geohash_substring_six)
  #       when 5
  #         @trips_grouped_by_geohash = @trips.group_by(&:employee_geohash_substring_five)
  #       when 4
  #         @trips_grouped_by_geohash = @trips.group_by(&:employee_geohash_substring_four)
  #       when 3
  #         @trips_grouped_by_geohash = @trips.group_by(&:employee_geohash_substring_three)
  #       when 2
  #         break
  #       end

  #       @trips_grouped_by_geohash.each do |grouped_trips|
  #         if grouped_trips.last.size == 3 || grouped_trips.last.size == 4
  #           array_to_remove = []
  #           grouped_trips.last.each do |trip|
  #             #Set the zone for this
  #             @ret_trips.push(trip)
  #             @ret_zones.push(@zone)
  #             array_to_remove.push(trip)
  #           end
  #           @zone = @zone + 1
  #           @trips = @trips - array_to_remove
  #         elsif ((grouped_trips.last.size < 3) && (size <= 3)) || (grouped_trips.last.size > 4)
  #           int_arr = [grouped_trips.last.size]
  #           new_int_arr = int_arr

  #           while all_elements_are_less_than_equal_four(int_arr)
  #             new_int_arr = []
  #             int_arr.each do |i|
  #               if i > 4
  #                 i1 = i / 2
  #                 i2 = i - i1
  #                 new_int_arr.push(i1)
  #                 new_int_arr.push(i2)
  #               else
  #                 new_int_arr.push(i)
  #               end
  #             end
  #             int_arr = new_int_arr
  #           end
  #           new_int_arr.each do |arr|
  #             i = 0
  #             array_to_remove = []
  #             while i < arr
  #               i = i + 1
  #               trip = grouped_trips.last.shift
  #               @ret_trips.push(trip)
  #               @ret_zones.push(@zone)
  #               array_to_remove.push(trip)
  #             end
  #             @zone = @zone + 1
  #             @trips = @trips - array_to_remove
  #           end
  #         end
  #       end
  #       size = size - 1
  #     end
  #   end
  #   return @ret_trips, @ret_zones   
  # end

  # def all_elements_are_less_than_equal_four(int_arr)
  #   int_arr.each do |i|
  #     if i > 4
  #       return true
  #     end
  #   end
  #   return false
  # end
  
end
