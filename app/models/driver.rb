require 'services/google_service'

class Driver < ApplicationRecord
  extend AdditionalFinders
  include UserData
  include AASM
  # include ComplianceNotificationConcern

  DATATABLE_PREFIX = 'driver'
  NOTIFICATION_FIELDS = { badge_expire_date: "Badge", licence_validity: "Licence" }

  has_one :user, :as => :entity
  has_one    :vehicle

  belongs_to :business_associate
  belongs_to :logistics_company
  belongs_to :site

  has_many   :trips, dependent: :destroy
  has_many   :notifications, dependent: :destroy
  has_many   :drivers_shifts
  has_many   :driver_requests, dependent: :destroy
  has_many   :checklists
  has_many   :compliance_notifications

  validates :permanent_address, presence: true
  validates :local_address, presence: true
  validates :badge_number, presence: true
  validates :aadhaar_number, uniqueness: true, allow_blank: true
  validates :licence_number, presence: true, length: { is: 15 }
  validates :verified_by_police, presence: true
  validates :site, presence: true
  validates :business_associate, presence: true
  validates :logistics_company, presence: true

  after_update :update_notification

  after_create :create_new_checklist

  after_update :update_driver_sort_status
  
  aasm column: :status do
    state :off_duty, initial: true
    state :on_duty
    state :on_leave

    event :go_off_duty do
      transitions to: :off_duty, after: :unassign_vehicle
    end

    event :go_on_duty do
      transitions to: :on_duty, after: :start_shift
    end

    event :go_on_leave do
      transitions to: :on_leave, after: :unassign_vehicle
    end
  end

  def paired_vehicle
    if vehicle.blank?
      @trip = trips.eager_load(:vehicle).where(driver: self).order(scheduled_date: :desc).limit(1).first
      if @trip&.vehicle.present?
        @trip.vehicle.plate_number
      end
    else
      vehicle.plate_number
    end
  end

  def operating_organization_name
    logistics_company.try(:name)
  end

  def operating_organization_phone
    # @TODO: make operators as required association
    if logistics_company.present?
      logistics_company.operators.first.try(:name)
    end
  end

  # Get first upcoming employee trip
  def closest_unstarted_trip
    @driver_trip = trips.where(status: :active).order(scheduled_date: :desc).where.not(book_ola: true).limit(1).first
    if @driver_trip.blank?
      @driver_trip = trips.today_or_later.where.not(status: [:canceled, :completed, :created, :ingested]).where.not(book_ola: true).order(scheduled_date: :asc).limit(1).first
    end
    @driver_trip
  end

  def attach_vehicle(vehicle)
    if vehicle.driver.present? && vehicle.driver != self
      errors.add(:base, 'The vehicle is already in use')
      false
    else
      self.update(vehicle: vehicle)
    end
  end

  def self.find_by_user_id(user_id)
    Driver.joins(:user).merge(User.driver.where(id: user_id)).first
  end

  def current_shift
    self.drivers_shifts.order(start_time: :desc).first
  end

  def driver_status
    #Get all the trips for this driver
    if vehicle.present? && vehicle.status != 'vehicle_ok'
      @status = "Car Broke Down"
      return @status.html_safe
    end    

    @trips = Trip.find_by_sql("select count(*) as count, status from trips where driver_id = #{self.id} and status in ('active', 'assigned', 'assign_requested', 'assign_request_expired') group by status")

    @active = 0
    @assigned = 0
    @assign_requested = 0

    @trips.each do |trip|
      if trip.status == 'active'
        @active = trip.count
      elsif trip.status == 'assigned'
        @assigned = trip.count
      elsif trip.status == 'assign_requested' || trip.status == 'assign_requested_expired'
        @assign_requested = trip.count
      end
    end

    # @trips = Trip.where(:driver_id => self.id).where(:status => ['active', 'assigned', 'assign_requested', 'assign_request_expired'])
    # @trips.each do |trip|
    #     if trip.status == 'active'
    #         @active = @active + 1
    #     end
    #     if trip.status == 'assigned'
    #         @assigned = @assigned + 1
    #     end
    #     if trip.status == 'assign_requested' || trip.status == 'assign_requested_expired'
    #         @assign_requested = @assign_requested + 1
    #     end                
    # end
    

    @status = self.status

    if @active != 0
        if @active == 1
            @status += '<br>' + @active.to_s + " active trip"
        else
            @status += '<br>' + @active.to_s + " active trips"
        end
    end

    if @assigned != 0
        if @assigned == 1
            @status += '<br>' + @assigned.to_s + " assigned trip"
        else
            @status += '<br>' + @assigned.to_s + " assigned trips"
        end
    end

    if @assign_requested != 0
        if @assign_requested == 1
            @status += '<br>' + @assign_requested.to_s + " assign trip requested"
        else
            @status += '<br>' + @assign_requested.to_s + " assign trips requested"
        end
    end

    # unless user.last_active_time == "2009-01-01 00:00:00"
    #     # Last active time of the user
    #     @status += '<br>' + 'Last Active: ' + user.last_active_time.strftime("%m/%d/%Y  %I:%M%p").to_s
    # end

    #Return status for each driver
    @status.html_safe
  end

  def driver_trip_exception(exception_type)
    # Send notification to the operator to indicate car broke down
    case exception_type
    when 'Car Broke Down'
      message = 'car_broke_down'
      # Connect a call between driver and operator
      @user = User.driver.where(id: user.id).first
      @user_operator = User.operator.order('last_active_time DESC').first
      if @user.present?
        make_call(:From => @user_operator.phone, :To => @user.phone, :CallerId => ENV['EXOTEL_CALLER_ID'], :CallType => 'trans')
      end
    when 'On Leave'
      message = 'on_leave'
    end

    #Get active or assigned trip of a driver
    @driver_trip = Trip.where(status: :active).where(:driver_id => user.entity.id).order(scheduled_date: :desc).limit(1).first
    if @driver_trip.blank?
      @driver_trip = Trip.today_or_later.where(:driver_id => user.entity.id).where.not(status: [:canceled, :completed]).order(scheduled_date: :asc).limit(1).first
    end    

    if @driver_trip.present?
      @notification = Notification.where(:trip => @driver_trip, :driver => self, :message => "#{message}_trip", :resolved_status => false).first

      if @notification.blank?
        Notification.create!(:trip => @driver_trip, :driver => self, :message => "#{message}_trip", :resolved_status => false, :new_notification => true).send_notifications
      end
    else

      @notification = Notification.where(:driver => self, :message => message).first

      if @notification.blank?
        Notification.create!(:driver => self, :message => message, :resolved_status => true, :new_notification => true).send_notifications
      end
    end
    
  end

  def send_off_duty
    self.go_off_duty!
    # Notify driver about change in duty status
    data = {driver_id: self.user_id, data: {driver_id: self.user_id, push_type: :driver_off_duty}}
    PushNotificationWorker.perform_async(
        self.user_id,
        :driver_off_duty,
        data)
  end

  def call_operator
    @user = User.driver.where(id: self.user_id).first
    @user_operator = User.operator.order('last_active_time DESC').first
    if @user.present? && @user_operator.present?
      make_call(:From => self.logistics_company.phone, :To => @user.phone, :CallerId => ENV['EXOTEL_CALLER_ID'], :CallType => 'trans')
    end
  end

  def update_pickup_times
    @trips = Trip.where(:status => ['assigned', 'assign_request_expired', 'assign_requested', 'created', 'assign_request_declined'])
    @trips.each do |trip|
      #Find the distance of start location of this driver from start location of the trip
      if trip.check_in?
        trip_route = trip.trip_routes.order('scheduled_route_order ASC').where.not(status: [:canceled, :missed ]).first
      elsif trip.check_out?
        trip_route = trip.trip_routes.order('scheduled_route_order ASC').first
      end

      begin
        start_location = user.current_location
        end_location = [trip_route.scheduled_start_location[:lat], trip_route.scheduled_start_location[:lng]]        
        route = GoogleService.new.directions(
            start_location,
            end_location,
            mode: 'driving',
            avoid: 'tolls',
            departure_time: Time.now.in_time_zone('Chennai')
        )
        route_data = route.first[:legs]
        initial_duration = (route_data[0][:duration_in_traffic][:value].to_f / 60).ceil
        @driver_first_pickup = DriverFirstPickup.where(:trip => trip, :driver => self).first
        
        if @driver_first_pickup.present?
          @driver_first_pickup.update!(:pickup_time => initial_duration, :time => Time.now)
        else
          DriverFirstPickup.create!(:pickup_time => initial_duration, :time => Time.now, :trip => trip, :driver => self)
        end
      rescue
        #Do nothing
      end
    end
  end

  def first_pickup_eta(trip_id)
    trip = Trip.find_by_prefix(trip_id)
    #Find current location of the Driver
    driver_location = self.user.current_location
    start_location = []
    end_location = []

    if driver_location.present?
      start_location = driver_location
      if trip.check_in?
        trip_route = trip.trip_routes.order('scheduled_route_order ASC').where.not(status: [:canceled, :missed ]).first
        if trip_route.present?
          end_location = [trip_route.scheduled_start_location[:lat], trip_route.scheduled_start_location[:lng]]
        end
      else
        end_location = trip.site.location
      end     
    end

    begin
      eta = "#{get_eta(start_location, end_location)}m"
    rescue
      eta = ""
    end
    
    eta
  end

  def self.create_checklist
    Driver.all.select("id").each { |d| Checklist.create_checklist(d.id) }
  end

  def self.create_notification
    configuration = { badge_expire_date: {field: "driver_badge_expiry_date_notification_lead_time", flag: "show_driver_badge_expiry_date_notification"}, licence_validity: {field: "driver_licence_expiry_date_notification_lead_time", flag: "show_driver_licence_expiry_date_notification"}}
    Driver.all.each do |driver|
      ComplianceNotification.create_provisioning_notification(configuration, driver)
    end
  end

  def update_notification
    configuration = { badge_expire_date: {field: "driver_badge_expiry_date_notification_lead_time", flag: "show_driver_badge_expiry_date_notification"}, licence_validity: {field: "driver_licence_expiry_date_notification_lead_time", flag: "show_driver_licence_expiry_date_notification"}}
    ComplianceNotification.create_provisioning_notification(configuration, self)
  end

  def create_new_checklist
    configuration = { badge_expire_date: {field: "driver_badge_expiry_date_notification_lead_time", flag: "show_driver_badge_expiry_date_notification"}, licence_validity: {field: "driver_licence_expiry_date_notification_lead_time", flag: "show_driver_licence_expiry_date_notification"}}
    Checklist.create_checklist(self.id)
    ComplianceNotification.create_provisioning_notification(configuration, self)
  end

  def update_driver_sort_status
    status = -1
    if self.status == 'on_leave'
      status = 0  
    end

    notification = self.compliance_notifications.active.order(updated_at: :desc).first
    # This notification to be shown below any car broke down or leave notification
    if notification.present?
      notification.checklist? ? status = 1 : status = 2
    end

    driver_request = DriverRequest.where(:driver => self).where('start_date > ?', Time.now).where(:request_state => [:cancel, :pending]).first
    if driver_request.present?
      status = 3
    end

    self.update_column('sort_status', status)
  end

  def has_active_trip
    trips.where(status: [:active, :assigned, :assign_requested, :assign_request_expired]).first.present?
  end

  protected
  def unassign_vehicle
    self.update(vehicle: nil)
    self.end_shift
  end

  def start_shift
    DriversShift.create!(:driver => self, :vehicle => vehicle, :start_time => Time.now.utc)
  end

  def end_shift
    time_diff = ((Time.now.utc - self.current_shift.start_time)/60).to_i
    self.current_shift.update(:end_time => Time.now.utc, :duration => time_diff)
  end

  def make_call(params)
    HTTParty.post(URI.escape("https://#{ENV['EXOTEL_SID']}:#{ENV['EXOTEL_TOKEN']}@twilix.exotel.in/v1/Accounts/#{ENV['EXOTEL_SID']}/Calls/connect"),
    {
      :query => params,
      :body => params
    })
  end

  def get_eta(start_location, end_location)
    route = GoogleService.new.directions(
        start_location,
        end_location,
        mode: 'driving',
        avoid: 'tolls',
        departure_time: Time.now.in_time_zone('Chennai')
    )
    route_data = route.first[:legs]

    eta = (route_data[0][:duration_in_traffic][:value] / 60).ceil    
  end
end
