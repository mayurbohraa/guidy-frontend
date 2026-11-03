import React from 'react';

import Sidebar from './ContributorSidebar';
import Navbar from '../Navbar';
import Sidepage2 from '../../routes/Sidepage2';
const Contributordashboard = props => {
  return (
    <div className="contributordashboard">
      <Sidebar />
      <div className="contributorDash2">
        <Navbar Name={props.Name} />
        <div className="workspace-scroll" role="region" aria-label="Dashboard content" tabIndex={0}>
          <Sidepage2 />
        </div>
      </div>
    </div>
  );
};
export default Contributordashboard;
