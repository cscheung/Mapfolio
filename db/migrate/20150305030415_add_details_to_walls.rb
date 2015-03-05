class AddDetailsToWalls < ActiveRecord::Migration
  def change
    add_column :walls, :x1, :float
    add_column :walls, :y1, :float
    add_column :walls, :x2, :float
    add_column :walls, :y2, :float
  end
end
