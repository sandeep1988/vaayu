class AddContactNumberToSites < ActiveRecord::Migration[5.0]
  def change
  	add_column :sites, :contact_phone, :string
  end
end
