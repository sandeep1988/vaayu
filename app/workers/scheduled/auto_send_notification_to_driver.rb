class Scheduled::AutoSendNotificationToDriver
	include Sidekiq::Worker
	include Sidetiq::Schedulable

	# Every 5 minutes minutes
	recurrence { hourly.minute_of_hour(0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55) }

	def perform
		 trips = Trip.where("status = ? OR status = ? OR status = ?", "assigned", "assign_requested", "assign_request_expired").to_a
		 
		 trips.each do |trip|
			
			#planned_date = trip.planned_date + 5.hours + 30.minutes 
			
			current_time = Time.at(Time.now).in_time_zone("Kolkata")
			trip_planned_date_actual = Time.at(trip.planned_date).in_time_zone("Kolkata")
			trip_planned_date_1_hour_early = Time.at(trip.planned_date - 1.hours).in_time_zone("Kolkata")			
			
			p "trip : #{trip.id} || current time : #{current_time} || trip_planned_date_actual : #{trip_planned_date_actual} || trip_planned_date_1_hour_early : #{trip_planned_date_1_hour_early}"
			
			 #time_flag = Time.now >= (trip.planned_date + 4.hours + 30.minutes) && Time.now < (trip.planned_date + 5.hours + 30.minutes)
			 
			 time_flag = current_time >= trip_planned_date_1_hour_early && current_time < trip_planned_date_actual
			 
			 if time_flag
				check_notification_status(trip)
			 else
				puts "Not in an hour range for #{trip_planned_date_actual}, with respect to current time #{Time.now}"
			 end	
		 end 
	end


	def check_notification_status(trip)
		notification = Notification.find_by(message: "notify driver an hour before", trip_id: trip.id, driver_id: trip.driver_id)
		if notification && notification.status == 'created'
			return
		else
			notification_reminder(trip)
		end	
	end


	def notification_reminder(trip)
	 	user_id = Driver.find(trip.driver_id).user_id
	 	@user = User.find(user_id)	 	
		
		#trip time display formate starts here
		trip_plan_time = Time.at(trip.planned_date).in_time_zone("Kolkata").strftime('%d %b %Y %H:%M %p')
		#trip time display formate end here
		
		#preparing JSON for Mobile
		data = {driver_id: user_id, data: {driver_id: user_id, trip_id: trip.id, planned_date: trip.planned_date, push_type: :hourly_before_trip }}
		data.merge!(notification: { title: "Next Trip Reminder", body: "Your next trip ##{trip.id} is scheduled for #{trip_plan_time}, please visit \"Upcoming Trips\" menu to take action on the same." })
		p "=========notification data========="
		p data 
		#send notification
		PushNotificationWorker.perform_async(user_id, :hourly_before_trip, data)
		#send SMS
		SMSWorker.perform_async(@user.phone, ENV['OPERATOR_NUMBER'], "Your next trip #{trip.id} is scheduled for #{trip_plan_time}, please visit Alyte Driver mobile app to take action on the same.");
		
		#update in notification table that notification is sent
		Notification.create!(message: "notify driver an hour before", trip_id: trip.id, driver_id: trip.driver_id, status: "created")
	end

end
