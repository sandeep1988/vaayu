class AddWorkingdayFieldToShift < ActiveRecord::Migration[5.0]
  def change
  	add_column :shifts, :working_day, :string
  end
end
