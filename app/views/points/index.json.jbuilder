json.array!(@points) do |point|
  json.extract! point, :id, :wall_id, :x, :y, :z, :alpha, :beta, :gamma
  json.url point_url(point, format: :json)
end
