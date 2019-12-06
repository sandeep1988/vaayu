class ChangeDateFormatInMyTable < ActiveRecord::Migration[5.0]
  def up
    change_column :drivers, :training_date, :date
  end

  def down
    change_column :drivers, :training_date, :datetime
  end
end
