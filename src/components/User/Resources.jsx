import React, { useEffect, useState } from "react";
import { guidyGet } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";

const Resources = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    const resources = (await guidyGet(apiRoutes.fetchResources)).data;
    setResources(resources);
  }

  return (
    <div className="resources">
      <span>Resources</span>
      <table>
        <tr>
          <th>Sr.</th>
          <th>Course</th>
          <th>File Name</th>
          <th>Action</th>
        </tr>

        {resources.map((item, index) => {
          return (
            <>
              <tr>
                <td>{index + 1}</td>
                <td>{item.subject?.name}</td>
                <td>{item.resourceName}</td>
                <td>
                  <a
                    href={
                      window.location.protocol +
                      "//" +
                      window.location.hostname +
                      ":4000/" +
                      item.resourceURL
                    }
                    download={item.resourceName}
                  >
                    <button>View</button>
                  </a>
                </td>
              </tr>
            </>
          );
        })}
      </table>
    </div>
  );
};

export default Resources;
