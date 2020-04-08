class ShiftsController < ApplicationController
  before_action :set_shift, only: [:show, :edit, :update, :destroy, :change_status]
  before_action :set_site, only: [ :edit ]
  before_action :active_shift_present, only: :change_status

  # GET /shifts
  # GET /shifts.json
  def index
    render json: Provisioning::ManageShiftsDatatable.new(view_context)
  end

  # GET /shifts/1
  # GET /shifts/1.json
  def show
  end

  # GET /shifts/new
  def new
    @shift = Shift.new
    @site = Site.all.map {|x| [x.name, x.id]}
  end

  # GET /shifts/1/edit
  def edit
  end

  # POST /shifts
  # POST /shifts.json
  def create
    @shift = Shift.new(shift_params)
    shift = Shift.where(site_id: params[:shift][:site_id])
    shift = shift.where(:working_day => params[:shift][:working_day])
    shift = shift.where(:start_time => params[:shift][:start_time])
    if shift.present?
      messge =  "Shift is already present for this site for Start time."
    else
      shift = Shift.where(site_id: params[:shift][:site_id])
      shift = shift.where(:working_day => params[:shift][:working_day])
      shift = shift.where(:end_time => params[:shift][:end_time])
      messge =  "Shift is already present for this site for End time." if shift.present?
    end
    if shift.present?
      @datatable_name = "shifts"
      render js: "alert('#{messge}')"
      # "alert('Shift is already present for this site with working days .')"
      return false
    else
      @shift.save
      @site = Site.find(params[:shift][:site_id]) 
       if @site.employees.present?
        @site.employees.each do |emp|
          ShiftUser.create(shift_id: @shift.id, user_id:emp.user_id )
        end
       end
      @errors = @shift.errors.full_messages.to_sentence
      @datatable_name = "shifts"
    end

    respond_to do |format|
      format.js { render file: "shared/create" }
      format.html { redirect_to provisioning_path(anchor: @datatable_name) }
    end
  end

  # PATCH/PUT /shifts/1
  # PATCH/PUT /shifts/1.json
  def update
    # shift = Shift.where(start_time: params[:shift][:start_time], end_time:params[:shift][:end_time],site_id: params[:shift][:site_id], working_day: params[:shift][:working_day]).where.not(id: @shift.id)
    shift = Shift.where(site_id: params[:shift][:site_id]).where.not(id: @shift.id)
    shift = shift.where(:working_day => params[:shift][:working_day])
    shift = shift.where(:start_time => params[:shift][:start_time])
    if shift.present?
      messge =  "Shift is already present for this site for Start time."
    else
      shift = Shift.where(site_id: params[:shift][:site_id]).where.not(id: @shift.id)
      shift = shift.where(:working_day => params[:shift][:working_day])
      shift = shift.where(:end_time => params[:shift][:end_time])
      messge =  "Shift is already present for this site for End time." if shift.present?
    end
    # shift = shift.where(:start_time => params[:shift][:start_time]).or(shift.where(:end_time => params[:shift][:end_time]))
    # shift = shift.where(:working_day => params[:shift][:working_day])
    if shift.present?
      @datatable_name = "shifts"
      render js: "alert('#{messge}')"
      # render js: "alert('Shift is already present for this site.')"
      return false
    else
      @shift.update(shift_params)
      @errors = @shift.errors.full_messages.to_sentence
      @datatable_name = "shifts"
    end  

    respond_to do |format|
      format.js { render file: "shared/create" }
      format.html { redirect_to provisioning_path(anchor: @datatable_name) }
    end
  end

  # DELETE /shifts/1
  # DELETE /shifts/1.json
  def destroy
    @shift.destroy
    respond_to do |format|
      format.html { redirect_to shifts_url, notice: 'Shift was successfully destroyed.' }
      # format.json { head :no_content }
    end
  end

  def change_status
    @shift.send(params[:status].concat("!").to_sym)
  end

  def validate
    shift = if params[:id].present?
      obj = Shift.find(params[:id])
      obj.assign_attributes(shift_params)
      obj
    else
      Shift.new(shift_params)
    end
    shift.valid?
    render json: shift.errors.messages, status: 200
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_shift
      @shift = Shift.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def shift_params
      params.require(:shift).permit(:name, :start_time, :end_time, :site_id, :status, :working_day)
    end

    def active_shift_present
      render json: 'Sorry, Shift has few upcoming trips. So we cant deactivate', status: '401' and return if @shift.employee_trips.upcoming.present?
    end

    def set_site
      site_id = Shift.find(params[:id]).site_id
      if site_id != nil
        @site = Site.includes(params[:site_id]).map {|x| [x.name, x.id]}
      end
    end
end
