import ProjectList from '@/components/custom/dashboard/ProjectList'
import { WelcomBanner } from '@/components/custom/dashboard/WelcomBanner'
import React from 'react'

const DashboardPage = () => {
  return (
    <div>
        {/* welcome banner */}
        <WelcomBanner/>
        
        {/* project list / empty state  */}
        <ProjectList/>

    </div>
  )
}

export default DashboardPage