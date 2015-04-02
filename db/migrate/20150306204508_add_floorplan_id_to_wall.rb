class AddFloorplanIdToWall < ActiveRecord::Migration
  def change
    add_column :walls, :floorplan_id, :integer
  end
end
