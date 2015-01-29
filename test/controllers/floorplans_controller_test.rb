require 'test_helper'

class FloorplansControllerTest < ActionController::TestCase
  setup do
    @floorplan = floorplans(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:floorplans)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create floorplan" do
    assert_difference('Floorplan.count') do
      post :create, floorplan: { created_by: @floorplan.created_by, name: @floorplan.name }
    end

    assert_redirected_to floorplan_path(assigns(:floorplan))
  end

  test "should show floorplan" do
    get :show, id: @floorplan
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @floorplan
    assert_response :success
  end

  test "should update floorplan" do
    patch :update, id: @floorplan, floorplan: { created_by: @floorplan.created_by, name: @floorplan.name }
    assert_redirected_to floorplan_path(assigns(:floorplan))
  end

  test "should destroy floorplan" do
    assert_difference('Floorplan.count', -1) do
      delete :destroy, id: @floorplan
    end

    assert_redirected_to floorplans_path
  end
end
