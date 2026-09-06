import Attendence from "../models/Attendence.js"
import Employee from "../models/Employee.js"
import {inngest} from "../inngest/index.js"


//Clock in and clock out functionality for employees


//POST/api/attendence
export const clockInOut = async (req, res) => {
  try{
    const session = req.session
    const employee = await Employee.findOne({userId: session.userId})
    if(!employee) return res.status(404).json({error:"Employee not found"})
      
      if(employee.isDeleted) return res.status(403).json({error:"Your account is deactivated"})

        const today = new Date()
        today.setHours(0,0,0,0)

        const existing = await Attendence.findOne({
          employeeId:employee._id,
          date:today,
        })

        const now = new Date()

        if(!existing){
          const isLate = now.getHours() >= 9 && now.getMinutes() > 0

          const attendence = await Attendence.create({
            employeeId : employee._id,
            date:today,
            checkIn:now,
            status:isLate ? "LATE" :"PRESENT"
          })

          await inngest.send({
            name:"employee/check-out",
            data:{
              employeeId:employee._id,
              attendenceId:attendence._id
            }
          })


          return res.json({success:true,type:"CHECK_IN",data:attendence})
        }else if(!existing.checkOut){
          const checkInTime = new Date(existing.checkIn).getTime()
          const diffMs = now.getTime() - checkInTime
          const diffHours = diffMs/(1000*60*60)

          existing.checkOut = now

          //Compute working hrs and day type

          const workingHours = parseFloat(diffHours.toFixed(2))
          let dayType = "Half Day"
          if(workingHours>=8) dayType = "Full Day"
          else if(workingHours>=6) dayType = "Three Quarter Day"
          else if (workingHours>=4) dayType = "Half Day"
          else dayType = 'Short Day'

          existing.workingHours = workingHours
          existing.dayType = dayType

          await existing.save()
          return res.json({success:true,type:"CHECK_OUT",data:existing})

        }else{
          return res.json({success:true,type:"CHECK_OUT",data:existing})

        }

  }catch(err){

    console.error("Attendence Error",error)
    return res.status(500).json({error:"Operation failed"})

  
  }
}

//GET attendence for employee
//GET /api/attendence
export const getAttendence = async (req, res) => {
  try{
    const session = req.session
    const employee = await Employee.findOne({userId: session.userId})
    if(!employee) return res.status(404).json({error:"Employee not found"})

    const limit = parseInt(req.query.limit || 30)
    const history = await Attendence.find({employeeId:employee._id}).sort({date:-1}).limit(limit)

    return res.json({data:history,
      employee: {isDeleted:employee.isDeleted}
    })

    return res.json({
      data:history,
      employee: {isDeleted:employee.isDeleted}
    })


  }catch(err){
    return res.status(500).json({error:"Failed to fetch attendence"})

    
  }
}