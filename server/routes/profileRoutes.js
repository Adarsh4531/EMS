import {Router} from 'express'
import {protect} from '../middleware/auth.js'
import { getProfile } from '../controllers/profileController.js'
import { updateProfile } from '../controllers/profileController.js'


const profileRoutes = Router()

profileRoutes.get('/', protect, getProfile)
profileRoutes.post('/', protect, updateProfile)

export default profileRoutes