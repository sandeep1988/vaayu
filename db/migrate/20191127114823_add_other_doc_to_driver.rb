class AddOtherDocToDriver < ActiveRecord::Migration[5.0]
  def up
    add_attachment :drivers, :other_doc
  end

  def down
    remove_attachment :drivers, :other_doc
  end
end
