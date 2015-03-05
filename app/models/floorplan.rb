class Floorplan < ActiveRecord::Base
	has_many :walls, dependent: :destroy
	accepts_nested_attributes_for :walls
end
