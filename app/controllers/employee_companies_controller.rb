class EmployeeCompaniesController < ApplicationController
  before_action :set_company, only: [:update, :destroy]
  def index
    if current_user.admin?
      @employee_companies = EmployeeCompany.all.order('id DESC')
    elsif (logistics_company = current_user.entity.logistics_company)
      @employee_companies = EmployeeCompany.where(:logistics_company => logistics_company).order('id DESC')
    end
    # @employee_company = EmployeeCompany.new
    respond_to do |format|
      format.html
      format.json { render json: EmployeeCompaniesDatatable.new(view_context)}
    end
  end

  def get_all
    @employee_companies = EmployeeCompany.all
    @logistics_companies = LogisticsCompany.all
    render :json => {
      employee_companies: @employee_companies,
      logistics_companies: @logistics_companies,
      current_user: current_user
    }
  end

  def create
    if current_user.operator? || current_user.admin?
      # attr = company_params.merge!(:logistics_company_id => current_user.entity.logistics_company.id)
      @employee_company = EmployeeCompany.new(company_params)
      respond_to do |format|
        if @employee_company.save
          format.json { render json: EmployeeCompanyDatatable.new(@employee_company), status: :created, location: @employee_companies}
        else
          format.json { render json: @employee_company.errors, status: '404' }
        end
      end
    else
      render :json => { :errors => 'You have not permissions for create company' }
      # format.json { render json: {:error => 'You have not permissions for create company'}, status: '404' }
    end
  end


  def update
    # TODO: use CanCan gem
    if current_user.admin? || (current_user.operator? && current_user.entity.logistics_company.id == @employee_company.logistics_company_id)
      respond_to do |format|
        if @employee_company.update(company_params)
          format.json { render json: EmployeeCompanyDatatable.new(@employee_company), status: :ok, location: @employee_company }
        else
          format.json { render json: @employee_company.errors, status: :unprocessable_entity }
        end
      end
    else
      render :json => { :errors => 'You have not permissions for edit company' }
    end
  end

  def destroy
    if current_user.admin? || (current_user.operator? && current_user.entity.logistics_company.id == @employee_company.logistics_company_id)
      @employee_company.destroy
      respond_to do |format|
        format.json { head :no_content }
      end
    end
  end


  private
    def set_company
      @employee_company = EmployeeCompany.find_by_prefix(params[:id])
    end

    def company_params
      params['company'] = params['data'].values.first
      params.require(:company).permit(
          :id, :name, :hq_address, :business_type, :pan, :service_tax_no, :logistics_company_id,
          :standard_price, :pay_period, :time_on_duty_limit, :distance_limit, :rate_by_time, :service_tax_percent,
          :rate_by_distance, :agreement_date, :swachh_bharat_cess, :krishi_kalyan_cess, :profit_centre, :invoice_frequency
      )
    end
end
