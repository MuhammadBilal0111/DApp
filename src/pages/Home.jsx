import React, { useEffect } from "react";
import Hero from "../components/Hero";
import Project from "../components/Projects";
import CreateProjects from "../components/CreateProjects";
import AddButton from "../components/AddButton";
import { loadProjects } from "../services/blockchain";
import { useGlobalState } from "../store";

function Home() {
  const [projects] = useGlobalState("projects");
  useEffect(() => {
    const fetchData = async () => {
      const projects = await loadProjects();
      console.log(projects);
    };
    fetchData();
    return () => {};
  }, []);
  return (
    <section>
      <Hero />
      <Project projects={projects} />
      <CreateProjects />
      <AddButton />
    </section>
  );
}

export default Home;
