import {Router} from 'express'
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../controllers/employeeController.js'
import { protect, protectAdmin } from '../middleware/auth.js'


const employeeRoutes = Router()

employeeRoutes.get('/', protect, protectAdmin, getEmployees)
employeeRoutes.post('/', protectAdmin, protect, createEmployee)
employeeRoutes.put('/:id', protectAdmin, protect, updateEmployee)
employeeRoutes.delete('/:id', protectAdmin, protect, deleteEmployee)

export default employeeRoutes