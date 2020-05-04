class AddDrivinglicenceissuedateToDriver < ActiveRecord::Migration[5.0]
  def change
  	add_column :drivers, :driving_licence_issue_date, :date
  end
end
