class ADdFieldToSite < ActiveRecord::Migration[5.0]
  def change
  	add_column :sites, :contact_email, :string
  	add_column :sites, :active, :boolean, default: true
  	add_column :sites, :sez, :string
  	add_column :sites, :lut_date, :datetime
  	add_column :sites, :lut_no, :string
  end
end
