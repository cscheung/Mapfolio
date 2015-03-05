class Floorplan < ActiveRecord::Base
	has_many :walls, dependent: :destroy
end
