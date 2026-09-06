import {Router} from "express"
import {protect} from "../middleware/auth.js"
import {clockInOut,getAttendence} from "../controllers/attendenceController.js"

const attendenceRouter = Router()

attendenceRouter.post("/",protect,clockInOut)
attendenceRouter.get('/',protect,getAttendence)

export default attendenceRouter