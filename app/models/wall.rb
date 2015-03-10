class Wall < ActiveRecord::Base
    has_many :points, dependent: :destroy
    belongs_to :floorplan
end
