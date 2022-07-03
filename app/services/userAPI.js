var baseUrl = "https://62c05e55d40d6ec55ccfa379.mockapi.io/api/user";

// Hàm call API lấy danh sách user
function apiGetUser(search) {
    return axios({
      url: baseUrl,
      method: "GET",
      params: {
        name: search,  
      },
    });
  }
  //
  
  // Hàm call API thêm user
  function apiAddUser(user) {
    return axios({
      url: baseUrl,
      method: "POST",
      data: user,
    });
  }
  
  // Hàm call API xoá user
  function apiDeleteUser(userId) {
    return axios({
      url: `${baseUrl}/${userId}`,
      method: "DELETE",
    });
  }
  
  // Hàm call API lấy chi tiết user
  function apiGetUserDetail(userId) {
    return axios({
      url: `${baseUrl}/${userId}`,
      method: "GET",
    });
  }
  
  // Hàm call API cập nhật user
  function apiUpdateUser(user) {
    return axios({
      url: `${baseUrl}/${user.id}`,
      data: user,
      method: "PUT",
    });
  }