json.array!(@floorplans) do |floorplan|
  json.extract! floorplan, :id, :name, :created_by
  json.url floorplan_url(floorplan, format: :json)
end
