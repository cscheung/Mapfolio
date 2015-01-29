class CreateFloorplans < ActiveRecord::Migration
  def change
    create_table :floorplans do |t|
      t.string :name
      t.string :created_by

      t.timestamps null: false
    end
  end
end
