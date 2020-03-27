class Scheduled::AutoSendNotificationToDriver
	include Sidekiq::Worker
	include Sidetiq::Schedulable

	# Every 5 minutes minutes
	recurrence { hourly.minute_of_hour(0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55) }

	def perform
		 trips = Trip.where("status = ? OR status = ?", 'assinged', 'assigned_requested').to_a
		 trips.each do |trip|
			 planned_date = trip.planned_date + 5.hours + 30.minutes 
			 time_flag = Time.now >= (trip.planned_date + 4.hours + 30.minutes) && Time.now < (trip.planned_date + 5.hours + 30.minutes)
			 if time_flag
			 trip = Trip.find(154879)
				check_notification_status(trip)
			 else
				puts "Not in an hour range for #{planned_date}, with respect to current time #{Time.now}"
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
	 	
		#preparing JSON for Mobile
		data = {driver_id: user_id, data: {driver_id: user_id, trip_id: trip.id, planned_date: trip.planned_date, push_type: :hourly_before_trip }}
		data.merge!(notification: { title: "Next Trip Reminder", body: "Notification Text:Your next trip #{trip.id} is scheduled for #{trip.planned_date + 5.hours + 30.minutes}, please visit \"Upcoming Trips\" menu to take action on the same." })
		#send notification
		PushNotificationWorker.perform_async(user_id, :hourly_before_trip, data)
		
		#update in notification table that notification is sent
		Notification.create!(message: "notify driver an hour before", trip_id: trip.id, driver_id: trip.driver_id, status: "created")
	end

end
