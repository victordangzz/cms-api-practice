import express from 'express'
import cors from 'cors'
import { CONFIG_ENV } from '@/constants/config'
import { PREFIX_API } from '@/constants/path'
import userRouter from '@/routes/user.route'
import { defaultErrorHandle } from '@/middlewares/errors.middleware'

// Thứ nhất là ngay chỗ này cú pháp process.env.PORT không sai.
// Nhưng em dùng như này sẽ bị lỗi. Và phải dùng cú pháp config() để có thể dùng được tất cả OBJECT bên trong process
// Thứ hai là lý do nên dùng constants/config.ts để có thể gọi 1 lần duy nhất config() - Tránh gọi đi gọi lại nhiều lần. Còn em đang gọi trực tiếp như này là hiệu năng code sẽ bị chậm đi rất nhiều
// Đã sửa
const port = CONFIG_ENV.PORT || 9000
const app = express()
app.use(
  cors({
    origin: '*'
  })
)
app.use(express.json())
app.use(PREFIX_API, userRouter)
app.use(defaultErrorHandle) // Đặt sau tất cả các route và middleware khác
app.listen(port, () => {
  console.log(`🚀 Server API running on ${CONFIG_ENV.STATUS} with port ${port}`)
})
