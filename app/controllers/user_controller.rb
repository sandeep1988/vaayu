class UserController < ApplicationController

  before_action :set_user, only: [:edit, :update, :destroy]

  def index
    @users = User.all.order("created_at DESC")
  end

  def new
    @user = User.new
  end

  def create_user
    entity = Operator.last
    @user = User.create!(email: params[:user][:email], username: params[:user][:username] , password: params[:user][:password], role: 2, f_name: params[:user][:f_name], l_name: params[:user][:l_name], phone: params[:user][:phone] , entity:entity)
    redirect_to users_path
  end  

  def create

  end

  def edit

  end

  def update
    respond_to do |format|
      if @user.update(user_params)
        format.html { redirect_to user_profile_edit_path, notice: 'Congratulations! Your profile was successfully updated.' }
      else
        format.html { render :'home/profile_edit' }
        format.json { render json: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy

  end

  private
    def set_user
      @user = User.find(params[:id])
    end

    def user_params
      params.require(:user).permit(
          :id, :f_name, :m_name, :l_name, :email, :role, :phone, :avatar
      )
    end

end