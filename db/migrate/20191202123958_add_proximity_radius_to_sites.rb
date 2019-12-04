class AddProximityRadiusToSites < ActiveRecord::Migration[5.0]
  def change
  	add_column :sites, :proximity_radius, :string
  end
end
