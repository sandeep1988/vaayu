class AddPartyFieldToSites < ActiveRecord::Migration[5.0]
  def change
  	add_column :sites, :party_name, :string
  end
end
