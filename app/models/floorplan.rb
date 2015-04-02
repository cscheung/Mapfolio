class Floorplan < ActiveRecord::Base
	has_many :walls, dependent: :destroy
	accepts_nested_attributes_for :walls,
		:allow_destroy => true,
		:reject_if     => :all_blank
end
