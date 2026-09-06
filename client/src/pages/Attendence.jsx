import { useCallback, useEffect, useState } from "react"
import { dummyAttendanceData } from "../assets/assets"
import Loading from "../components/Loading"
import CheckInButton from "../components/attendence/CheckInButton"
import AttendenceStats from "../components/attendence/AttendenceStats"
import AttendenceHistory from "../components/attendence/AttendenceHistory"


const Attendence = () => {

  const [history, sethistory] = useState([])
  const [loading, setloading] = useState(true)
  const [isdeleted, setisdeleted] = useState(false)

  const fetchData = useCallback(async ()=>{
    sethistory(dummyAttendanceData)
    setTimeout(()=>{
      setloading(false)
    },1000)
  },[])

  useEffect(()=>{
    fetchData()
  },[fetchData])


  if(loading) return <Loading />

  const today = new Date()
  today.setHours(0,0,0,0)
  const todayRecord = history.find((r)=> new Date(r.date).toDateString()=== today.toDateString())
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Attendence</h1>
        <p className="page-subtitle">Track your work hours and daily check-ins</p>
      </div>

      {isdeleted ?(
        <div className="mb-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl">
          <p className="text-rose-600"> You can no longer clock in or out because your employee records have been marked as deleted</p>
        </div>
      ) : (
        <div className="mb-8">
          <CheckInButton todaysRecord={todayRecord} onAction={fetchData} />
        </div>
      )}

      <AttendenceStats history={history} />
      <AttendenceHistory history={history} />
    </div>
  )
}

export default Attendence