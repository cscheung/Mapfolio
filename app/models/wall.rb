class Wall < ActiveRecord::Base
    has_many :points, dependent: :destroy
    accepts_nested_attributes_for :points
end
