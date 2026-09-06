import mongoose from "mongoose"

import dns from 'dns'

dns.setServers([
  "1.1.1.1",
  "8.8.8.8"
])

async function connectDB()
{
  await mongoose.connect(process.env.MONGO_URI)
  console.log("Database connected")
}

export default  connectDB


