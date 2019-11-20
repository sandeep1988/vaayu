class ChangeDAtatypeGender < ActiveRecord::Migration[5.0]
  def change
  	change_column :employees, :gender, :integer
  end
end