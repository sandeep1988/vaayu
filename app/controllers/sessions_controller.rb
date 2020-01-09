class SessionsController < Devise::SessionsController
  def new
    super
  end

  def create
  	user = User.find_by_email(params[:user][:username])
  	user = User.find_by_username(params[:user][:username]) if user.nil?
  	if user.present?
	  	if !( user.admin? || user.operator? || user.mdm_admin? || user.transport_desk_manager? || user.ct_manager?)
	  		flash[:notice] = 'You are not Authorised to Sign In'
	  		self.resource = resource_class.new(sign_in_params)	
	  		render :new
	  	elsif user.present? && user.is_password_expired == true
	  	  flash.now[:notice] = 'Your password has expired please reset password.'
	  		self.resource = resource_class.new(sign_in_params)	
	  		render :new
	  	else		
	  		super
	  	end
	else
		super
	end  	
  end	
end