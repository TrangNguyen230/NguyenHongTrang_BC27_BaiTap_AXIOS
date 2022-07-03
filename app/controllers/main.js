// Định nghĩa lớp đối tượng
function User(
  id,
  account,
  name,
  password,
  email,
  language,
  type,
  image,
  description
) {
  this.id = id;
  this.account = account;
  this.name = name;
  this.password = password;
  this.email = email;
  this.language = language;
  this.type = type;
  this.image = image;
  this.description = description;
}

main();

function main() {
  apiGetUser().then(function (result) {
    // Nhận kết quả API trả về
    var users = result.data;

    // Duyệt mảng và khởi tạo đối tượng
    for (let i = 0; i < users.length; i++) {
      var user = users[i];
      users[i] = new User(
        user.id,
        user.account,
        user.name,
        user.password,
        user.email,
        user.language,
        user.type,
        user.image,
        user.description
      );
    }

    // Gọi hàm display hiển thị ra giao diện
    display(users);
  });
}

// Hàm hiển thị
function display(users) {
  let html = "";
  for (let i = 0; i < users.length; i++) {
    var user = users[i];

    html += `
      <tr>
       <td>${i + 1}</td>
       <td>${user.account}</td>
       <td>${user.password}</td>
       <td>${user.name}</td>
       <td>${user.email}</td>
       <td>${user.language}</td>
       <td>${user.type}</td>
       <td>
        <button 
          class = "btn btn-success mx-2 "  
          data-toggle="modal"
          data-target="#myModal"
          data-type="update"
          data-id="${user.id}"
        > 
          Cập nhật
        </button>

        <button 
        class = "btn btn-danger" 
        data-type="delete"
        data-id="${user.id}"
        > Xóa
        </button>
       </td>
      <tr>
      `;
  }

  document.getElementById("tblDanhSachNguoiDung").innerHTML = html;
}

// Hàm thêm user
function addUser() {
  // DOM
  var account = document.getElementById("TaiKhoan").value;
  var name = document.getElementById("HoTen").value;
  var password = document.getElementById("MatKhau").value;
  var email = document.getElementById("Email").value;
  var image = document.getElementById("HinhAnh").value;
  var type = document.getElementById("loaiNguoiDung").value;
  var language = document.getElementById("loaiNgonNgu").value;
  var description = document.getElementById("MoTa").value;

  // Khởi tạo đối tượng User
  var user = new User(
    account,
    name,
    password,
    email,
    language,
    type,
    image,
    description
  );

  // Gọi API thêm user
  apiAddUser(user).then(function (result) {
    main();
    resetForm();
  });
}

// Hàm xóa user
function deleteUser(userID) {
  apiDeleteUser(userID).then(function (result) {
    main();
  });
}

// Hàm cập nhật user
function updateUser() {
  var account = document.getElementById("TaiKhoan").value;
  var name = document.getElementById("HoTen").value;
  var password = document.getElementById("MatKhau").value;
  var email = document.getElementById("Email").value;
  var image = document.getElementById("HinhAnh").value;
  var type = document.getElementById("loaiNguoiDung").value;
  var language = document.getElementById("loaiNgonNgu").value;
  var description = document.getElementById("MoTa").value;

  // Khởi tạo đối tượng User
  var user = new User(
    account,
    name,
    password,
    email,
    language,
    type,
    image,
    description
  );

  // Gọi API cập nhật user
  apiUpdateUser(user).then(function (result) {
    main();
    resetForm()
  })
}

// Hàm xử lý reset form và đóng modal
function resetForm() {
  document.getElementById("TaiKhoan").value = "";
  document.getElementById("HoTen").value = "";
  document.getElementById("MatKhau").value = "";
  document.getElementById("Email").value = "";
  document.getElementById("HinhAnh").value = "";
  document.getElementById("loaiNguoiDung").value = "";
  document.getElementById("loaiNgonNgu").value = "";
  document.getElementById("MoTa").value = "";

  // Đóng modal
  $("#myModal").modal("hide")
}

// Thay đổi nội dung modal
// DOM
document.getElementById("btnThemNguoiDung").addEventListener("click", showAddModal);
function showAddModal() {
  // Thay đổi text của modal
  document.querySelector(".modal-title").innerHTML = "Thêm người dùng";
  document.querySelector(".modal-footer").innerHTML = `
  <button class="btn btn-primary" data-type="add"> Thêm </button>
  <button class="btn btn-secondary"   data-toggle="modal"
  data-target="#myModal"> Hủy </button>
  `
}

// Ủy quyền lắng nghe event của các button từ thẻ .modal-footer
document.querySelector(".modal-footer").addEventListener("click", handleSubmit)
function handleSubmit(event) {
  var type = event.target.getAttribute("data-type");

  switch (type) {
    case "add":
      addUser();
      break;
    case "update":
      updateUser();
      break;
    default:
      break;
  }
}

// Uỷ quyền lắng nghe tất cả event của button Xoá và Cập nhật trong table cho tbody
document.getElementById("tblDanhSachNguoiDung").addEventListener("click", handleUserAction);

function handleUserAction(event) {
  // Loại button (delete || update)
  var type = event.target.getAttribute("data-type");
  // Id của user
  var id = event.target.getAttribute("data-id");

  switch (type) {
    case "delete":
      deleteUser(id);
      break;
    case "update":
      // Cập nhật giao diện lên modal và call API get thông tin của user và fill lên form
      showUpdateModal();
      break;
    default:
      break;
  }

}

// Hàm cập nhật giao diện modal và call API lấy thông tin user và hiển thị lên giao diện
function showUpdateModal(userID) {
  // Thay đổi text của modal heading/ modal footer
  document.querySelector(".modal-title").innerHTML = "Cập nhật người dùng";
  document.querySelector(".modal-footer").innerHTML = `
  <button class="btn btn-primary" data-type="update"> Cập nhật </button>
  <button class="btn btn-secondary" data-dismiss="modal"> Hủy </button>
  `;

  // Call API lấy chi tiết user
  apiGetUserDetail(userID).then(function (result) {
    // fill data lên form
    document.getElementById("TaiKhoan").value = user.account;
    document.getElementById("HoTen").value = user.name;
    document.getElementById("MatKhau").value = user.password;
    document.getElementById("Email").value = user.email;
    document.getElementById("HinhAnh").value = user.image;
    document.getElementById("loaiNguoiDung").value = user.type;
    document.getElementById("loaiNgonNgu").value = user.language;
    document.getElementById("MoTa").value = user.description;
  });
}

// DOM tới input search
document.getElementById("txtSearch").addEventListener("keypress", handleSearch);
function handleSearch(evt) {
  // Kiểm tra nếu key click vào không phải là Enter thì bỏ qua
  if(evt.key!== "Enter") return;

  // Nếu key click vào là Enter thì bắt đầu lấy value của input và get users
  var value = evt.target.value;
  apiGetUser(value).then(function(result) {
    // Tạo biến users nhận kết quả trả về từ API
    var users = result.data;
    
     // Duyệt mảng và khởi tạo đối tượng
     for (let i = 0; i < users.length; i++) {
      const user = users[i];
      users[i] = new User(
        user.id,
        user.account,
        user.name,
        user.password,
        user.email,
        user.language,
        user.type,
        user.image,
        user.description
      );
     }
     // Gọi hàm display
     display(users)
  })
}