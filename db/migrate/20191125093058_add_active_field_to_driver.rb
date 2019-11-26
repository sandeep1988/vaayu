class AddActiveFieldToDriver < ActiveRecord::Migration[5.0]
  def change
  	add_column :drivers, :active, :boolean, default: true
  end
end
