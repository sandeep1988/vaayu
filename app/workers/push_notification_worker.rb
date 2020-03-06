require 'fcm'
class PushNotificationWorker

  include Sidekiq::Worker
  sidekiq_options :retry => 3, :dead => false, :queue => "push_notifier"

  def perform(receiver_id, push_type, data, receiver_type = :user)
    if push_type != 'driver_new_trip_assignment'
      data.merge!({push_type: push_type, priority: "high", content_available: true})
    end

    fcm = FCM.new( ENV['FCM_API_KEY'] )
    fcm_prefix = ENV['FCM_TOPIC_PREFIX']
    puts "request ------>  #{fcm_prefix}_#{receiver_type}_#{receiver_id}, #{data}"
    response = fcm.send_to_topic("#{fcm_prefix}_#{receiver_type}_#{receiver_id}", data)
    # puts "request ------>  #{fcm_prefix}_#{receiver_type}_#{receiver_id}, #{data}"
    puts "response ------> #{response}"

    raise Exceptions::PushNotificationFailedError.new(response[:response]) unless response[:status_code] == 200
  end
  
end
