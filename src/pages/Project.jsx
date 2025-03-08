import React, { useEffect, useState } from "react";
import ProjectDetails from "../components/ProjectDetails";
import ProjectBacker from "../components/ProjectBacker";
import UpdateProjects from "../components/UpdateProject";
import BackProject from "../components/BackProject";
import DeleteProject from "../components/DeleteProject";
import { getBackers, loadProject } from "../services/blockchain";
import { useParams } from "react-router-dom";
import { useGlobalState } from "../store/index";

function Project() {
  const { id } = useParams();
  const [project] = useGlobalState("project");
  const [backers] = useGlobalState("backers");
  const [loaded, setLoaded] = useState(false);
  console.log("backers", backers);
  useEffect(() => {
    const loadProjectById = async (id) => {
      await loadProject(id);
      await getBackers(id);
      setLoaded(true);
    };
    loadProjectById(id);
  }, []);
  return loaded ? (
    <>
      <ProjectDetails project={project} />
      <UpdateProjects project={project} />
      <DeleteProject project={project} />
      <BackProject project={project} />
      <ProjectBacker backers={backers} />
    </>
  ) : null;
}

export default Project;
