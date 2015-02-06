class CreatePoints < ActiveRecord::Migration
  def change
    create_table :points do |t|
      t.float :x
      t.float :y
      t.float :z
      t.float :alpha
      t.float :beta
      t.float :gamma

      t.timestamps null: false
    end
  end
end
