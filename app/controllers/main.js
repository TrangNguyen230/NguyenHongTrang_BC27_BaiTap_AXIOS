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

  var isValid = validation();
  // Khởi tạo đối tượng User
  var user = new User(
    "", // do bạn truyền thiếu id nè => ok rồi đó ok nhé
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
    switch (isValid) {
      case "true":
        main();
        resetForm();
        break;
      case "false":
        return;
    }
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
  var id = document.getElementById("id").value;
  var account = document.getElementById("TaiKhoan").value;
  var name = document.getElementById("HoTen").value;
  var password = document.getElementById("MatKhau").value;
  var email = document.getElementById("Email").value;
  var image = document.getElementById("HinhAnh").value;
  var type = document.getElementById("loaiNguoiDung").value;
  var language = document.getElementById("loaiNgonNgu").value;
  var description = document.getElementById("MoTa").value;

  var isValid = validation();
  // Khởi tạo đối tượng User
  var user = new User(
    id,
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
    resetForm();
  });
}

// Hàm xử lý reset form và đóng modal
function resetForm() {
  document.getElementById("id").value = "";
  document.getElementById("TaiKhoan").value = "";
  document.getElementById("HoTen").value = "";
  document.getElementById("MatKhau").value = "";
  document.getElementById("Email").value = "";
  document.getElementById("HinhAnh").value = "";
  document.getElementById("loaiNguoiDung").value = "";
  document.getElementById("loaiNgonNgu").value = "";
  document.getElementById("MoTa").value = "";

  var isValid = validation();
  // Đóng modal
  switch (isValid) {
    case "false":
      $("#myModal").modal("show");
      break;
    case "true":
      $("#myModal").modal("hide");
      break;
  }
}

// Thay đổi nội dung modal
// DOM
document
  .getElementById("btnThemNguoiDung")
  .addEventListener("click", showAddModal);
function showAddModal() {
  // Thay đổi text của modal
  document.querySelector(".modal-title").innerHTML = "Thêm người dùng";
  document.querySelector(".modal-footer").innerHTML = `
  <button class="btn btn-primary" data-type="add"> Thêm </button>
  <button class="btn btn-secondary"   data-toggle="modal"
  data-target="#myModal"> Hủy </button>
  `;
}

// Ủy quyền lắng nghe event của các button từ thẻ .modal-footer
document.querySelector(".modal-footer").addEventListener("click", handleSubmit);
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
document
  .getElementById("tblDanhSachNguoiDung")
  .addEventListener("click", handleUserAction);

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
      showUpdateModal(id);
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
    var user = result.data;
    document.getElementById("id").value = user.id;
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
  if (evt.key !== "Enter") return;

  // Nếu key click vào là Enter thì bắt đầu lấy value của input và get users
  var value = evt.target.value;
  apiGetUser(value).then(function (result) {
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
    var isValid = validation();
    // Gọi hàm display
    display(users);
  });
}

// bạm còn chưa load được giá trị khi mà ấn cập nhật
// cái hàm updateUserAPI nó cần có thuộc tính id ở cái thằng user tham số nhận vào
// mình chưa thấy ở chỗ bạn gọi hàm này, bạn truyền user vào chưa có cái thuộc tính id
// khi ấn nút cập nhật bạn phải đi tìm cái uuer được nhấn để show lại thông tin lên modal

// bạn coi lại các vấn đề này nha

// Hàm điều kiện validation
function validation() {
  var account = document.getElementById("TaiKhoan").value;
  var name = document.getElementById("HoTen").value;
  var password = document.getElementById("MatKhau").value;
  var email = document.getElementById("Email").value;
  var image = document.getElementById("HinhAnh").value;
  var type = document.getElementById("loaiNguoiDung").value;
  var language = document.getElementById("loaiNgonNgu").value;
  var description = document.getElementById("MoTa").value;

  var isValid = true;

  // Kiểm tra input tài khoản
  if (!isRequired(account)) {
    isValid = false;
    document.getElementById("accountInput").innerHTML =
      "Tài khoản không được để trống ";
  }

  // Kiểm tra input tên
  var nameTest = new RegExp("^[A-Za-z] +$");
  if (!isRequired(name)) {
    isValid = false;
    document.getElementById("nameInput").innerHTML = "Tên không được để trống";
  } else if (!nameTest.test(name)) {
    isValid = false;
    document.getElementById("nameInput").innerHTML =
      "Tên không được bao gồm số hay các ký tự đặc biệt";
  }

  // Kiểm tra input email
  var mailTest = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$");
  if (!isRequired(email)) {
    isValid = false;
    document.getElementById("emailInput").innerHTML =
      "Email không được để trống";
  } else if (!mailTest.test(email)) {
    isValid = false;
    document.getElementById("emailInput").innerHTML =
      "Email không đúng định dạng";
  }

  // Kiểm tra input mật khẩu
  var passTest = new RegExp(
    "^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{6,8}$"
  );
  if (!isRequired(password)) {
    isValid = false;
    document.getElementById("passwordInput").innerHTML =
      "Mật khẩu không được để trống";
  } else if (!passTest.test(password)) {
    isValid = false;
    document.getElementById("passwordInput").innerHTML =
      "Mật Khẩu phải từ 6-10 ký tự (chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt)";
  }

  // Kiểm tra input hình ảnh
  if (!isRequired(image)) {
    isValid = false;
    document.getElementById("imageInput").innerHTML =
      "Hình ảnh không được để trống";
  }

  // Kiểm tra input loại người dùng
  if (!isRequired(type)) {
    isValid = false;
    document.getElementById("typeInput").innerHTML =
      "Loại người dùng không được để trống";
  }

  // Kiểm tra input ngôn ngữ
  if (!isRequired(language)) {
    isValid = false;
    document.getElementById("languageInput").innerHTML =
      "Ngôn ngữ không được để trống";
  }

  // Kiểm tra input mô tả
  var descriptionTest = new RegExp("^[A-Za-z]{0,60} +$");
  if (!isRequired(description)) {
    isValid = false;
    document.getElementById("descriptionInput").innerHTML =
      "Mô tả không được để trống";
  } else if (!descriptionTest.test(description)) {
    isValid = false;
    document.getElementById("descriptionInput").innerHTML = "Tối đa 60 ký tự";
  }

  return isValid;
}

// Các hàm kiểm tra xem input có rỗng hay không
function isRequired(value) {
  if (!value) {
    return false;
  }
  return true;
}
