import bcrypt from 'bcrypt'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
//Login for employee and admin
//POST /api/auth/login

export const login = async (req, res) => {
  try {
    const { email, password, role_type } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findOne({ email})

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (role_type ==="admin" && user.role !== "ADMIN") {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (role_type ==="employee" && user.role !== "EMPLOYEE") {
      return res.status(403).json({ message: 'Access denied' });
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const payload = { 
      userId: user._id.toString(),
      email: user.email,
      role: user.role 
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.json({ token, user: payload })


  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Login failed' });

  }
}

//GET session for employee and admin
//GET /api/auth/session

export const session = async (req, res) => {
  const session = req.session
  return res.json({ user: session })
}

//change password for employee and admin
//POST /api/auth/change-password

export const changePassword = async (req, res) => {
  try{
    const session = req.session
    const {currentPassword, newPassword} = req.body
    if(!currentPassword || !newPassword){
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(session.userId)
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password)

    if(!isValid){
      return res.status(401).json({ message: 'Invalid current password' })
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    await User.findByIdAndUpdate(session.userId, {password: hashed})

    return res.json({ success:true})
  }catch(err){
    return res.status(500).json({ message: 'Failed to change password' });
  }
}