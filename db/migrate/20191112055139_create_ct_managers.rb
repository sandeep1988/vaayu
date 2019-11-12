class CreateCtManagers < ActiveRecord::Migration[5.0]
  def change
    create_table :ct_managers do |t|

      t.timestamps
    end
  end
end
