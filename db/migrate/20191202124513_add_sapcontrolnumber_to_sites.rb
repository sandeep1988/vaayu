class AddSapcontrolnumberToSites < ActiveRecord::Migration[5.0]
  def change
  	add_column :sites, :sap_control_number, :string
  end
end
