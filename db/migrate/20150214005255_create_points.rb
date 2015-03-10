class CreatePoints < ActiveRecord::Migration
  def change
    create_table :points do |t|
      t.integer :x
      t.integer :y
      t.float :angle

      t.timestamps null: false
    end
  end
end
