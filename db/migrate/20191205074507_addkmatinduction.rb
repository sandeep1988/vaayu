class Addkmatinduction < ActiveRecord::Migration[5.0]
  def up
    add_attachment :vehicles, :km_doc_upload
  end
  def down
    remove_attachment :vehicles, :km_doc_upload
  end
end
