json.array!(@points) do |point|
  json.extract! point, :id, :x, :y, :angle
  json.url point_url(point, format: :json)
end
