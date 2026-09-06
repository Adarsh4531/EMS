import "dotenv/config";
import connectDB from './config/db.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';


const TemporaryPassword = "admin123";

async function registerAdmin(){
  try{
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    if(!ADMIN_EMAIL){
      console.log("Missing Email")
    }

    await connectDB()

    const existingAdmin = await User.findOne({email:process.env.ADMIN_EMAIL})

    if(existingAdmin){
      console.log("User already exists as role",existingAdmin.role)
      process.exit(0)

    }
    const hashedPasssword = await bcrypt.hash(TemporaryPassword,10)
  
    const admin = await User.create({
      email:process.env.ADMIN_EMAIL,
      password:hashedPasssword,
      role:"ADMIN"
    })
    console.log("Admin user created successfully ")
  console.log('\nEmail:', admin.email);
  console.log('Temporary Password:', TemporaryPassword);
  process.exit(0)
  }catch(err){
    console.log("Seed Failed",err)
  }
}

registerAdmin()