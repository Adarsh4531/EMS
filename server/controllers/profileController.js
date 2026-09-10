import Employee from '../models/Employee.js'

//GET profile
//GET /api/profile

export const getProfile = async (req, res) => {
    try{
      const session = req.session
      const employee = await Employee.findOne({userId: session.userId})

      if(!employee){
        return res.json({ 
          firstName:"Admin",
          lastName:"",
          email: session.email,
        })
      }
      return res.json(employee)

    }catch(err){
      return res.status(500).json({ message: 'failed to fetch profile' });

    }
}

//Update profile
//PUT /api/profile

export const updateProfile = async (req, res) => {
  try{
    const session = req.session
    const employee = await Employee.findOne({userId: session.userId})

    if(!employee){
      return res.status(404).json({ message: 'Profile not found' })
    }

    if(employee.isDeleted){
      return res.status(403).json({ error: 'Profile is deleted' })
    }

    await Employee.findByIdAndUpdate(employee._id, {
      bio: req.body.bio 
    })

    return res.json({ message: 'Profile updated successfully' })

  }catch(err){
    return res.status(500).json({ message: 'Failed to update profile' })
  }
}