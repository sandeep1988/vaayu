class CreateMdmAdmins < ActiveRecord::Migration[5.0]
  def change
    create_table :mdm_admins do |t|

      t.timestamps
    end
  end
end
