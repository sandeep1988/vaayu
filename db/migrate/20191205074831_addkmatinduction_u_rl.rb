class AddkmatinductionURl < ActiveRecord::Migration[5.0]
  def change
  	add_column :vehicles, :km_doc_upload_url, :string
  end
end
