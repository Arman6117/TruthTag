import React from 'react'
import Dashboard from './_components/dashboard'
import connectToDB from '@/lib/db'

const DashboardPage = () => {
  // await connectToDB()
  return (
    <main  className='mt-7'>
      <Dashboard/>
    </main>
  )
}

export default DashboardPage