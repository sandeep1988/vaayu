class CreateCommercialManagers < ActiveRecord::Migration[5.0]
  def change
    create_table :commercial_managers do |t|

      t.timestamps
    end
  end
end
