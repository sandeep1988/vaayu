class AddAddressToSite < ActiveRecord::Migration[5.0]
  def change
    add_column :sites, :address, :string
  end
end
