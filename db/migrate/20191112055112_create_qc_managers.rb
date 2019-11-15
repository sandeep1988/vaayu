class CreateQcManagers < ActiveRecord::Migration[5.0]
  def change
    create_table :qc_managers do |t|

      t.timestamps
    end
  end
end
