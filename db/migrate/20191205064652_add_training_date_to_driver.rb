class AddTrainingDateToDriver < ActiveRecord::Migration[5.0]
  def change
  	add_column :drivers, :training_date, :datetime
  end
end
