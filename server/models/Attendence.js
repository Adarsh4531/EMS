import mongoose from "mongoose";


const AttendenceSchema = mongoose.Schema({
 employeeId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Employee",
    required:true,
 },
 date:{
    type:Date,
    required:true,
 },
 checkIn:{
    type:Date,
    default:null,
 },
checkOut:{
    type:Date,
    default:null,
 },
 status:{
    type:String,
    enum:["PRESENT","ABSENT","LATE"],
    default:"PRESENT"
 },
 workingHours:{
    type:Number,
    default:null
 },
 dayType:{
    type:String,
    enum:["full Day","half Day","Three Quarter Day","Short Day",null],
    default:null
 },
},{timestamps:true})

AttendenceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

const Attendence =  mongoose.models.Attendence || mongoose.model("Attendence",AttendenceSchema)

export default Attendence