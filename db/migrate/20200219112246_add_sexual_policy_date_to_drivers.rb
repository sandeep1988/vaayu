class AddSexualPolicyDateToDrivers < ActiveRecord::Migration[5.0]
  def change
  	add_column :drivers, :sexual_policy_date, :date
  end
end
