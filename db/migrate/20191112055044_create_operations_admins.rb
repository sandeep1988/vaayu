class CreateOperationsAdmins < ActiveRecord::Migration[5.0]
  def change
    create_table :operations_admins do |t|

      t.timestamps
    end
  end
end
