import React, { useState, useEffect } from "react";
import {
  UilEye,
  UilCheckCircle,
  UilTimesCircle,
} from "@iconscout/react-unicons";
import { guidyGet, guidyPost } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";

const Requests = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  async function fetchResources() {
    const resources = (await guidyGet(apiRoutes.fetchAdminResources)).data;
    setResources(resources);
  }

  async function updateResources(resourceId, status) {
    await guidyPost(apiRoutes.updateResource(resourceId), {
      status: status,
    });
    fetchResources();
  }
  return (
    <div className="requests">
      <span>Requests</span>

      <div className="request-list">
        {resources.map((item, index) => {
          return (
            <div className="request-item">
              <span className="text">
                <span>{index + 1}</span>
                <span>{item.resourceName}</span>{" "}
                <span>-{item.user.firstName + " " + item.user.lastName}</span>
              </span> 
              <span>
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
                  <UilEye className="req-icons" />
                  </a>
                <UilCheckCircle
                  className="req-icons"
                  style={{ color: "#50C878" }}
                  onClick={() => updateResources(item._id, "accepted")}
                />
                <UilTimesCircle
                  className="req-icons"
                  style={{ color: "red" }}
                  onClick={() => updateResources(item._id, "denied")}
                />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
