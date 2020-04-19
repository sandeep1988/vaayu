class API::V2::VehiclesController < ApplicationController
  before_action :set_vehicle, only: [:show, :edit, :update, :destroy]
  skip_before_action :authenticate_user!
  # before_action :validate_plate_number, only: [:create]
  before_action :check_insurance_date, only: [:create]
  before_action :check_puc_validity_date, only: [:create] 
  before_action :check_permit_validity_date, :check_fitness_validity_date, :check_road_tax_validity_date, only: [:create]
  respond_to :json
  # GET /api/v2/vehicles
  # GET /api/v2/vehicles.json
  def index
    @vehicles = Vehicle.all.order("created_at DESC")
    render json: { success: true , message: "Loaded vehicles", data: { Vehicle: @vehicles }, errors: {} }, status: :ok
  end

  # GET /api/v2/vehicles/1
  # GET /api/v2/vehicles/1.json
  def show
    if @vehicle.present?
      render json: {success: true , message: "Loaded vehicles", data: { vehicle: @vehicle }, errors: {} },status: :ok
    else
      render json: {success: false , message: "No vehicle found", data: {}, errors: {} }, status: :ok
    end
  end

  # GET /api/v2/vehicles/new
  def new
    @vehicle = Vehicle.new
  end

  # GET /api/v2/vehicles/1/edit
  def edit
  end

  # POST /api/v2/vehicles
  # POST /api/v2/vehicles.json
  def create
    save_draft(params)
  end

  # PATCH/PUT /api/v2/vehicles/1
  # PATCH/PUT /api/v2/vehicles/1.json
  def update
    @vehicle = Vehicle.find(params[:id]) if params[:id].present?
   if @vehicle.update(vehicle_params)
      render json: {success: true , message: "UPDATE SUCCESS", data: { vehicle: @vehicle } , errors: {} },status: :ok
    else
      render json: {success: false , message: "UPDATE FAIL", errors: { errors: @vehicle.errors.full_messages } } , status: :ok 
    end
  end

  # DELETE /api/v2/vehicles/1
  # DELETE /api/v2/vehicles/1.json
  def destroy
    if @vehicle.destroy
      render json: {success: true , message: "Deleted vehicle", data: { vehicle: @vehicle }},status: :ok
    else
      render json: {success: false , message: "DELETE FAIL", data: {}, errors: @vehicle.errors },status: :ok
    end
  end

  def vehicle_profile_picture
      @vehicle = Vehicle.find(params["id"]) if params["id"].present?
      if params[:vehicle_picture_doc].present?
        @vehicle.vehicle_picture_doc  = params[:vehicle_picture_doc] 
        if @vehicle.update(vehicle_picture_url: @vehicle.vehicle_picture_doc.url.gsub("//",''))
          render json: {success: true , message: "UPDATE SUCCESS", data: { vehicle: @vehicle } },status: :ok
        else
          render json: {success: false , message: "UPDATE FAIL", errors: { errors: @vehicle.errors.full_messages } } , status: :ok 
        end
      end
    end

  def find_category_seat_by_vehicle
    vehicle = VehicleModel.find_by_make_model(params[:make_model]) if params[:make_model].present?
    vehicle_data = { capacity: vehicle.capacity.to_i , vehicle_category: vehicle.vehicle_category.category_name } if vehicle.present? && vehicle.vehicle_category.present?
    success =  {success: true , message: "Get vehicle data ", status: :ok, data: vehicle_data , errors: {} }
    not_found = {success: false , message: "Not found vehicle data", status: :ok, errors: {} }
    render json: vehicle_data.present? ? success : not_found
  end


  def get_vehicle_model_data
    vehicle_models = VehicleModel.all
    result = []
    if vehicle_models.present?
      vehicle_models.each do |vehicle_model|
      @vehicle_data = { make_model: vehicle_model.make_model, capacity: vehicle_model.capacity.to_i , vehicle_category: vehicle_model.vehicle_category.category_name }
        result << @vehicle_data
      end
      success =  {success: true , message: "Listing of VehicleModel", status: :ok, data: { model_list: result } , errors: {} }
      render json: success
    else
      not_found = {success: false , message: "Not found VehicleModel data", status: :not_found, errors: {} }
      render json: not_found
    end
  end

  def validate_plate_number
    if params[:id].present? && params[:plate_number].present?
        vehicle = Vehicle.where(:plate_number => params[:plate_number]).first
        if vehicle.nil? || vehicle.id == params[:id] .to_i
         render json: {success: true , message: "Valid plate number", data: {}, errors: { } ,status: :ok }
        else
          render json: {success: false , message: "Invalid plate number", data: {}, errors: { } ,status: :ok }
        end
    end
  end

  # def validate_plate_number_old
  #   # if params[:id].present? && params[:plate_number].present?
  #   #   vehicle = Vehicle.where(:id => params[:id], :plate_number => params[:plate_number]).first
  #   #     render json: { success: true , message: "Vehicle got", data:{ vehicle: vehicle }, errors: {} }, status: :ok if vehicle.present?
  #   # else params[:plate_number].present?
  #   #   vehicle = Vehicle.where(plate_number: params[:plate_number]).last
  #   #   result = Vehicle.pluck(:plate_number).include? params[:plate_number]
  #   #   render json: {success: true , message: "Vehicle registration number should not be duplicate", data:{ plate_number: params[:plate_number] }, errors: {} }, status: :ok if result && vehicle.induction_status != "Draft" && vehicle.present?
  #   #   render json: { success: false , message: "Registration number is unique", data: { plate_number: params[:plate_number] } , errors: {} }, status: :ok if result == false
  #   #   render json: { success: true , message: "Registration number is unique", data: { plate_number: params[:plate_number] } , errors: {} }, status: :ok if result &&  vehicle.induction_status == "Draft" && vehicle.present?
  #   # end
  # end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_vehicle
      @vehicle = Vehicle.find(params[:id])
      render json: {success: :not_found} unless @vehicle
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def vehicle_params
      # params.permit(:business_associate_id, :plate_number, :model,:seats,:ac,:fuel_type,:colour,:registration_date, :fitness_doc_url, :insurance_date, :authorization_certificate_validity_date, :business_area_id, :make_year, :puc_validity_date, :fitness_validity_date, :permit_validity_date, :road_tax_validity_date, :ac,:fuel_type, :driver_id, :last_service_date, :last_service_km, :km_at_induction, :permit_type, :authorization_certificate_validity_date, :date_of_registration, :status, :device_id, :gps_provider_id, :insurance_doc_url, :rc_book_doc_url, :puc_doc_url, :commercial_permit_doc_url, :road_tax_doc_url, :vehicle_picture_url, :authorization_certificate_doc_url, :site_id, :created_by, :updated_by )
      params.permit(:business_associate_id, :plate_number, :model,:category,:seats,:ac, :colour,:puc_validity_date,:insurance_date,:permit_validity_date,:road_tax_validity_date,:authorization_certificate_validity_date,:fitness_validity_date, :fuel_type, :induction_status, :registration_steps, :insurance_doc, :insurance_doc_url, :rc_book_doc, :rc_book_doc_url, :puc_doc_url, :puc_doc, :commercial_permit_doc_url, :commercial_permit_doc, :road_tax_doc_url, :road_tax_doc, :fitness_doc_url, :fitness_doc, :vehicle_picture_url, :vehicle_picture_doc, :authorization_certificate_doc, :authorization_certificate_doc_url,:site_id, :shift_end_time, :shift_start_time, :device_id, :gps_provider_id, :km_at_induction, :km_doc_upload_url, :km_doc_upload, :created_by, :updated_by )
    end

    def save_draft(params)
      if params[:registration_steps] == "Step_1"
        @vehicle = Vehicle.new(vehicle_params)
        @vehicle.make_year = @vehicle.make_year.present? ? @vehicle.make_year : 2015
        @vehicle.induction_status = "Draft"
        @vehicle.site_id = params[:site_id].to_i if params[:site_id].present?
        @vehicle.shift_start_time = params[:shift_start_time] if params[:shift_start_time].present?
        @vehicle.shift_end_time = params[:shift_end_time] if params[:shift_end_time].present?
        login_user = User.where(:uid => request.headers["uid"]).first
        @vehicle.update(created_by: login_user.id) if login_user.present?
        @vehicle.update(created_by: current_user.id.to_i) if !login_user.present?
        if @vehicle.save
          @vehicle.update_attribute('registration_steps', 'Step_1')
           render json: { success: true , message: "Success First step", data: { vehicle_id: @vehicle.id }, errors: {} }, status: :ok
        else
          render json: {success: false , message: "Fail First step", data: {}, errors: { errors: @vehicle.errors.full_messages } ,status: :ok }
        end
      elsif params[:registration_steps] == "Step_2"
        @vehicle = Vehicle.find(params[:vehicle_id].to_i)
          if validate_first_step(@vehicle) == true
            if @vehicle.update(vehicle_params)
              @vehicle.update_attribute('registration_steps', 'Step_2')
                render json: {success: true , message: "Success second step", data: { vehicle_id:  @vehicle.id }, errors: {} }, status: :ok if @vehicle.id.present?
            else
              render json: {success: false , message: "Fail Second step", data: {}, errors: { errors: @vehicle.errors.full_messages } },status: :ok
            end
          else
            render json: {success: false , message: "Please complete Step 1 first", data: {}, errors: { errors: validate_first_step(@vehicle) } },status: :ok
          end
      elsif params[:registration_steps] == "Step_3"
        @vehicle = Vehicle.find(params[:vehicle_id]) if params[:vehicle_id].present?
          if params[:insurance_doc].blank? or params[:rc_book_doc].blank? or params[:puc_doc].blank? or  params[:commercial_permit_doc].blank? or params[:road_tax_doc].blank? or params[:vehicle_picture_doc].blank? or params[:fitness_doc].blank? or params[:km_doc_upload].blank?
              render json: {success: false , message: "Please Upload all docs", data: {}, errors: {},status: :ok }
          else  
            if validate_first_and_second_step(@vehicle)== true
              if @vehicle.update(vehicle_params)
                @vehicle.update_attribute('registration_steps', 'Step_3')
                upload_insurance_doc(@vehicle) if @vehicle.present?
                upload_rc_book_doc(@vehicle) if @vehicle.present?
                upload_puc_doc(@vehicle) if @vehicle.present?
                upload_commercial_permit_doc(@vehicle) if @vehicle.present?
                upload_road_tax_doc(@vehicle) if @vehicle.present?
                km_doc_upload(@vehicle) if @vehicle.present?
                # upload_authorization_certificate_doc(@vehicle) if @vehicle.present?
                upload_vehicle_picture_doc(@vehicle) if @vehicle.present?
                upload_fitness_doc(@vehicle) if @vehicle.present?

                @vehicle.update(induction_status: "Registered") if @vehicle.present?
                @vehicle.update(compliance_status: "Ready For Allocation") if @vehicle.present?
                @vehicle.update(date_of_registration: Time.now )
                # @vehicle.update(created_by: current_user.id) if current_user.present?
                render json: {success: true , message: "Success Final step", data:{vehicle_id: @vehicle.id } , errors: {} }, status: :ok if @vehicle.id.present?
              else
                render json: {success: false , message: "Fail Final step", data: {}, errors: { errors: @vehicle.errors.full_messages.split(",")  } },status: :ok 
              end
            else
              render json: {success: false , message: "Please complete Step 1 and 2 form", data: {}, errors: { errors: validate_first_and_second_step(@vehicle) } },status: :ok
            end
      end
      else
        render json: { success: false , message: "You have not assign registration steps", data: {}, errors: {} },status: :ok
      end
    end

  
  def validate_first_step(vehicle)
    result = false
    Vehicle::VEHICLE_STEP[:Step_1].each do |i|
      other_result = vehicle[i].present?
      result = other_result
    end
    return true
  end

   def upload_insurance_doc(vehicle)
    if vehicle.insurance_doc.url.present?
      vehicle.update(insurance_doc_url: vehicle.insurance_doc.url.gsub("//",''))
      DocumentRenewalRequest.create(status: "New", resource_id: vehicle.id, document_id: "5", document_url: "#{vehicle.insurance_doc.url.gsub("//",'')}", expiry_date: vehicle.insurance_date , created_by: 0, resource_type: "Vehicle" )
      logger.info "Insurance_doc done"
    end 
  end 

  def upload_rc_book_doc(vehicle)
    if vehicle.rc_book_doc.url.present?
      vehicle.update(rc_book_doc_url: vehicle.rc_book_doc.url.gsub("//",''))
      #DocumentRenewalRequest.create(status: "Renew", resource_id: vehicle.id, document_id: "13", document_url: "https://#{vehicle.rc_book_doc.url.gsub("//",'')}", expiry_date: driver.puc_validity_date , created_by: 0, resource_type: "Vehicle" ) if driver.puc_validity_date.present?
      logger.info "rc_book done"
    end 
  end 

  def upload_puc_doc(vehicle)
    if vehicle.puc_doc.url.present?
      vehicle.update(puc_doc_url: vehicle.puc_doc.url.gsub("//",''))
      DocumentRenewalRequest.create(status: "New", resource_id: vehicle.id, document_id: "13", document_url: "#{vehicle.puc_doc.url.gsub("//",'')}", expiry_date: vehicle.puc_validity_date , created_by: 0, resource_type: "Vehicle" )
      logger.info "puc_doc done"
    end 
  end 

  def upload_commercial_permit_doc(vehicle)
    if vehicle.commercial_permit_doc.url.present?
      vehicle.update(commercial_permit_doc_url: vehicle.commercial_permit_doc.url.gsub("//",''))
      DocumentRenewalRequest.create(status: "New", resource_id: vehicle.id, document_id: "14", document_url: "#{vehicle.commercial_permit_doc.url.gsub("//",'')}", expiry_date: vehicle.permit_validity_date , created_by: 0, resource_type: "Vehicle" )
      logger.info "commercial_permi done"
    end 
  end 

  def upload_road_tax_doc(vehicle)
    if vehicle.road_tax_doc.url.present?
      vehicle.update(road_tax_doc_url: vehicle.road_tax_doc.url.gsub("//",''))
      DocumentRenewalRequest.create(status: "New", resource_id: vehicle.id, document_id: "15", document_url: "#{vehicle.road_tax_doc.url.gsub("//",'')}", expiry_date: vehicle.road_tax_validity_date , created_by: 0, resource_type: "Vehicle" )
      logger.info "road_tax done"
    end 
  end 

  # def upload_authorization_certificate_doc(vehicle)
  #   if vehicle.authorization_certificate_doc.url.present?
  #     vehicle.update(authorization_certificate_doc_url: vehicle.authorization_certificate_doc.url.gsub("//",''))
  #     DocumentRenewalRequest.create(status: "New", resource_id: vehicle.id, document_id: "18", document_url: "#{vehicle.authorization_certificate_doc.url.gsub("//",'')}", expiry_date: vehicle.road_tax_validity_date , created_by: 0, resource_type: "Vehicle" ) if vehicle.authorization_certificate_validity_date.present?
  #     logger.info "authorization certificate doc done"
  #   end 
  # end 

  def upload_vehicle_picture_doc(vehicle)
    if vehicle.vehicle_picture_doc.url.present?
      vehicle.update(vehicle_picture_url: vehicle.vehicle_picture_doc.url.gsub("//",''))
      logger.info "vehicle picture doc done"
    end 
  end 

  def km_doc_upload(vehicle)
    if vehicle.km_doc_upload.url.present?
      vehicle.update(km_doc_upload_url: vehicle.km_doc_upload.url.gsub("//",''))
      logger.info "km_doc_upload picture doc done"
    end 
  end 

  def upload_fitness_doc(vehicle)
    if vehicle.fitness_doc.url.present?
      vehicle.update(fitness_doc_url: vehicle.fitness_doc.url.gsub("//",''))
      DocumentRenewalRequest.create(status: "New", resource_id: vehicle.id, document_id: "16", document_url: "#{vehicle.fitness_doc.url.gsub("//",'')}", expiry_date: vehicle.fitness_validity_date , created_by: 0, resource_type: "Vehicle" )
      logger.info "fitness doc done"
    end 
  end 



  def check_insurance_date
    if params[:registration_steps] == "Step_2"
      if params[:insurance_date].present? && params[:insurance_date].to_date < Date.today 
        render json: {success: false , message: "Your insurance date has expired", data: {}, errors: "Record not updated",status: :ok }
      end
    end
  end

  def check_puc_validity_date
    if params[:registration_steps] == "Step_2"
      if params[:puc_validity_date].present? && params[:puc_validity_date].to_date < Date.today 
        render json: {success: false , message: "Your puc validity date has expired", data: {}, errors: { errors: "Record not updated" },status: :ok }
      end
    end
  end

  def check_permit_validity_date
    if params[:registration_steps] == "Step_2"
      if params[:permit_validity_date].present? && params[:permit_validity_date].to_date < Date.today 
        render json: {success: false , message: "Your permit validity date has expired", data: {}, errors: { errors: "Record not updated" },status: :ok }
      end
    end
  end

  # def check_authorization_certificate_validity_date
  #   if params[:registration_steps] == "Step_2"
  #     if params[:authorization_certificate_validity_date].present? && params[:authorization_certificate_validity_date].to_date < Date.today 
  #       render json: {success: false , message: "Your authorization certificate validity date has expired", data: {}, errors: { errors: "Record not updated" },status: :ok }
  #     end
  #   end
  # end

  def check_fitness_validity_date
    if params[:registration_steps] == "Step_2"
      if params[:fitness_validity_date].present? && params[:fitness_validity_date].to_date < Date.today 
        render json: {success: false , message: "Your fitness validity date has expired", data: {}, errors: { errors: "Record not updated" },status: :ok }
      end
    end
  end

  def check_road_tax_validity_date
    if params[:registration_steps] == "Step_2"
      if params[:road_tax_validity_date].present? && params[:road_tax_validity_date].to_date < Date.today 
        render json: {success: false , message: "Your road tax validity date has expired", data: {}, errors: "Record not updated",status: :ok }
      end
    end
  end


  def validate_first_and_second_step(vehicle)
      result = {}
      vehicles_step = Vehicle::VEHICLE_STEP[:Step_1].concat Vehicle::STEP_VEHICLE[:Step_2]
      vehicles_step.each do |i|
        other_result = { i => vehicle[i].present? } 
        result.merge!(other_result)
      end
      return true
    end
end


