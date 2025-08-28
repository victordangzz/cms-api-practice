const MSG = {
  VALIDATION_ERR: 'Validate error',
  EMAIL_IS_REQUIRED: 'Email là bắt buộc',
  EMAIL_MUST_BE_STRING: 'Email phải là dạng chuỗi ký tự',
  EMAIL_LENGTH: 'Email có độ dài từ 5 đến 160 ký tự',
  EMAIL_INVALID: 'Email chưa đúng định dạng',
  EMAIL_ALREADY_EXISTS: 'Email đã tồn tại',
  PASSWORDS_DO_NOT_MATCH: 'Mật khẩu xác nhận không khớp',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Mật khẩu xác nhận là bắt buộc',
  PASSWORD_IS_REQUIRED: 'Mật khẩu là bắt buộc',
  PASSWORD_LENGTH: 'Mật khẩu có độ dài từ 6 đến 160 ký tự',
  PASSWORD_IS_NOT_STRONG: 'Mật khẩu chưa đủ bảo mật',
  EMAIL_OR_PASSWORD_INCORRECT: 'Email hoặc mật khẩu chưa chính xác',
  LOGIN_SUCCESS: 'Đăng nhập tài khoản thành công',
  LOGOUT_SUCCESS: 'Đăng xuất tài khoản thành công',
  REGISTER_SUCCESS: 'Đăng ký tài khoản thành công',
  NAME_MUST_BE_STRING: 'Họ và tên phải là dạng chuỗi',
  NAME_LENGTH: 'Họ và tên có độ dài từ 3 đến 160 ký tự',
  USER_NOT_FOUND: 'Người dùng không tồn tại',
  INVALID_PASSWORD: 'Mật khẩu không chính xác'
} as const

export default MSG
