require 'httparty'

class SMSWorker

  include Sidekiq::Worker
  sidekiq_options :retry => 0, :dead => false

  def perform(to, from, message)
    send_last_mile_sms = Configurator.where(:request_type => 'send_last_mile_sms').first

    if !to.blank? && !to.nil? && !from.blank? && !from.nil? && send_last_mile_sms.present? && send_last_mile_sms.value == '1'
      to = '91' << to
      from = '91' << from
      url = URI("https://api.msg91.com/api/v2/sendsms")
      http = Net::HTTP.new(url.host, url.port)
      http.use_ssl = true
      http.verify_mode = OpenSSL::SSL::VERIFY_NONE
      request = Net::HTTP::Post.new(url)
      request["content-type"] = 'application/json'
      request["authkey"] = '196066Awcqn3vREs5a72b829'
      request.body = {
          "sender": "SOCKET",
          "route": "4",
          "country": "91",
          "sms": [
            {
              "message": "#{message}",
              "to": [
                "#{to.to_i}"
              ]
            }
          ]
        }.to_json
      response = http.request(request)
      p "================================"
      puts response.body
      p "================================"

      # respone  = HTTParty.get("http://mahindrasms.com:8080/mConnector/dispatchapi?cname=mnmlog&tname=mnmlog&login=mnmlog&to=#{to.to_i}&text=#{message}")

      #p = RestAPI.new( ENV['PLIVO_AUTH_ID'],  ENV['PLIVO_AUTH_TOKEN'])
      #params = {
      #  'src' => from,
      #  'dst' => to,
      #  'text' => message
      #}
      #response = p.send_message(params)
      # response = HTTParty.post(URI.escape("https://alerts.solutionsinfini.com/api/v4/?api_key=#{ENV['SOLUTIONS_INFINI_API_KEY']}&method=sms&message=#{message}&to=#{to}&sender=#{ENV['SOLUTIONS_INFINI_SENDER']}"),
      # {})
    end
  end
  
end
