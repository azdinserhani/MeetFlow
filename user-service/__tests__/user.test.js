import { getUserById } from "../controller/userController.mjs";

const mockRequest = {
  params: {
    id: 8,
  },
};

const mockResponse = {
  json: jest.fn(),
  status: jest.fn().mockReturnThis(),
};

describe("get user by id", () => {
  it("should return user by id", async () => {
    await getUserById(mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: "success",
      data: {
        id: 8,
        first_name: "azdine",
        last_name: "serhani",
        email: "azdinee@gmail.com",
        profile_img: null,
        created_at: new Date("2025-01-14T13:08:41.725Z"),
        updated_at: null,
      },
    });
  });
});
