class AddSapControlNumberToCustomer < ActiveRecord::Migration[5.0]
  def change
  	add_column :employee_companies, :sap_control_number, :string
  end
end
