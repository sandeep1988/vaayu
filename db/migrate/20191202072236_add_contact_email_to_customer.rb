class AddContactEmailToCustomer < ActiveRecord::Migration[5.0]
  def change
  	add_column :employee_companies, :contact_email, :string
  end
end
