import React from 'react'

import Sidebar from './ContributorSidebar'
import Navbar from '../Navbar'
import Sidepage2 from '../../routes/Sidepage2'

const Contributordashboard = (props) => {
  return (
    <div className="contributordashboard">
      <Sidebar />
      <div className="contributorDash2">
        <Navbar Name={props.Name} />
        <Sidepage2 />
      </div>
    </div>
  )
}

export default Contributordashboard