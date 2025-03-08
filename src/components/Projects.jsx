import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { truncate, daysRemaining } from "../store";
import { FaEthereum } from "react-icons/fa";
import { useState } from "react";

function Projects({ projects }) {
  const [end, setEnd] = useState(4);
  const [collection, setCollection] = useState([]);
  const [count] = useState(4);

  const getCollection = () => projects.slice(0, end);
  useEffect(() => {
    setCollection(getCollection());
  }, [projects, end]);
  return (
    <div className="flex flex-col px-6">
      <div className="flex justify-center items-center flex-wrap gap-5">
        {collection.map((project, id) => (
          <ProjectCard key={id} project={project} id={id} />
        ))}
      </div>
      {projects.length > 0 && projects.length > collection.length ? (
        <div className="flex justify-center items-center my-5">
          <button
            type="button"
            className="inline-block px-6 py-2.5 border border-green-600
        font-medium text-xs leading-tight uppercase text-green-600
        rounded-full shadow-md bg-transparent hover:bg-green-700
        hover:text-white"
            onClick={() => setEnd(count + end)}
          >
            Load more
          </button>
        </div>
      ) : null}
    </div>
  );
}
function ProjectCard({ project, id }) {
  return (
    <div id="projects" className="rounded-lg shadow-lg bg-white">
      <Link to={`/project/${id}`}>
        <img
          src={project.imageURL}
          alt="project title"
          className="h-64 w-full object-cover rounded-xl"
        />
        <div className="p-4">
          <div className="">
            <h2>{project.title}</h2>
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                {/* <Identicon
                  string="0x15...1ea2"
                  size={15}
                  className="rounded-full shadow-md"
                /> */}
                <small className="text-gray-700">
                  {truncate(project.owner)}
                </small>
              </div>
              <small className="text-gray-500">
                {new Date().getTime() > Number(project.expiresAt + "000")
                  ? "Expired"
                  : daysRemaining(Number(project.expiresAt))}{" "}
              </small>
            </div>
            <div className="w-full bg-gray-300">
              <div
                className="text-xs font-medium text-center p-0.5 h-1 rounded-l-full bg-green-600"
                style={{ width: `${(project.raised / project.cost) * 100}` }}
              />
            </div>
            <div
              className="flex justify-between items-center 
        font-bold mt-1 mb-2 text-gray-700"
            >
              <small>{project.raised} ETH Raised</small>
              <small className="flex justify-start items-center">
                <FaEthereum />
                <span>{project.cost} ETH</span>
              </small>
            </div>
            <div
              className="flex justify-between items-center flex-wrap
            mt-4 mb-2 text-gray-500 font-bold"
            >
              <small>
                {project.backers} Backer{project.backers <= 1 ? "" : "s"}
              </small>
              <div>
                <small className="text-green-500">{project.status}</small>
                <div>
                  {true ? (
                    <small className="text-red-500">Expired</small>
                  ) : project?.status == 0 ? (
                    <small className="text-gray-500">Open</small>
                  ) : project?.status == 1 ? (
                    <small className="text-green-500">Accepted</small>
                  ) : project?.status == 2 ? (
                    <small className="text-gray-500">Reverted</small>
                  ) : project?.status == 3 ? (
                    <small className="text-red-500">Deleted</small>
                  ) : (
                    <small className="text-orange-500">Paid</small>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Projects;
