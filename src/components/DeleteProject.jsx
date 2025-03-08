import React from "react";
import { setGlobalState, useGlobalState } from "../store";
import { FaTimes } from "react-icons/fa";
import { deleteProject } from "../services/blockchain";
import { useNavigate } from "react-router-dom";

function DeleteProject({ project }) {
  const navigate = useNavigate();
  const [deleteModal] = useGlobalState("deleteModal");

  const handleSubmit = async () => {
    await deleteProject(project?.id);
    navigate("/");
    alert("Project deleted successfully");
    onClose();
  };
  return (
    <section
      className={`fixed top-0 left-0 w-screen h-screen flex
items-center justify-center bg-black bg-opacity-50
transform transition-transform duration-300 ${deleteModal}`}
    >
      <div
        className="bg-white shadow-xl shadow-black
    rounded-xl w-11/12 md:w-2/5 h-7/12 p-6"
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <p className="font-semibold">{project?.title}</p>
            <button
              onClick={() => setGlobalState("deleteModal", "scale-0")}
              type="button"
              className="border-0 bg-transparent focus:outline-none"
            >
              <FaTimes />
            </button>
          </div>
          <div className="flex justify-center items-center mt-5">
            <div className="rounded-xl overflow-hidden h-20 w-20">
              <img
                src={
                  project?.imageURL ||
                  "https://media.wired.com/photos/5926e64caf95806129f50fde/master/pass/AnkiHP.jpg"
                }
                alt={project?.title}
                className="h-full w-full object-cover cursor-pointer"
              />
            </div>
          </div>

          <div
            className="flex flex-col justify-between items-center
       mt-5 p-2"
          >
            <p>Are you sure?</p>
            <small className="text-red-500">This is irreversible</small>
          </div>
          <button
            className="inline-block px-6 py-2.5 bg-green-600
        text-white font-medium text-md leading-tight
        rounded-full shadow-md hover:bg-green-700 mt-5"
            onClick={handleSubmit}
          >
            Back Project
          </button>
        </div>
      </div>
    </section>
  );
}

export default DeleteProject;
