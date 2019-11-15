class CreateOperationsSupervisors < ActiveRecord::Migration[5.0]
  def change
    create_table :operations_supervisors do |t|

      t.timestamps
    end
  end
end
