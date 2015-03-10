json.array!(@walls) do |wall|
  json.extract! wall, :id
  json.url wall_url(wall, format: :json)
end
