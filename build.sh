sudo docker-compose -f docker-compose-qa.yml up --build -d web sidekiq
sudo docker-compose -f docker-compose-qa.yml scale  web=35 sidekiq=3 location_service=2 api_ms=4
