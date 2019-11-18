class CreateBaManagers < ActiveRecord::Migration[5.0]
  def change
    create_table :ba_managers do |t|

      t.timestamps
    end
  end
end
