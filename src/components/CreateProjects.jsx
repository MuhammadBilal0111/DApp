import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { setGlobalState, useGlobalState } from "../store";
import { createProject } from "../services/blockchain";

function CreateProjects() {
  const [createModal] = useGlobalState("createModal");
  const [data, setData] = useState({
    title: "",
    cost: "",
    expiresAt: "",
    description: "",
    imageURL: "",
  });

  const dateToTimeStamp = (dateStr) => {
    console.log(typeof dateStr);
    const dateObj = new Date(dateStr).getTime();
    return BigInt(dateObj / 1000);
  };

  const handlechange = (e) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProject({
      ...data,
      expiresAt: dateToTimeStamp(data?.expiresAt),
    });
    alert("Project created successfully");
    onClose();
  };
  const onClose = () => {
    setGlobalState("createModal", "scale-0");
    reset();
  };
  const reset = () => {
    setData({
      title: "",
      cost: "",
      expiresAt: "",
      description: "",
      imageURL: "",
    });
  };
  return (
    <section
      className={`fixed top-8 left-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-30 transform transition-transform duration-300 ${createModal}`}
    >
      <div
        className="bg-white shadow-xl shadow-black
        rounded-xl w-11/12 md:w-2/5 h-7/12 p-6"
      >
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex justify-between items-center">
            <p className="font-semibold">Add Project</p>
            <button
              onClick={onclose}
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
                  data?.imageURL ||
                  "https://media.wired.com/photos/5926e64caf95806129f50fde/master/pass/AnkiHP.jpg"
                }
                alt="project title"
                className="h-full w-full object-cover cursor-pointer"
              />
            </div>
          </div>

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl mt-5 p-2"
          >
            <input
              className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
              type="text"
              name="title"
              placeholder="Title"
              id="title"
              onChange={handlechange}
              value={data?.title}
              required
            />
          </div>

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl mt-5 p-2"
          >
            <input
              className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
              type="number"
              step={0.01}
              min={0.01}
              name="cost"
              id="cost"
              placeholder="cost (ETH)"
              onChange={handlechange}
              value={data?.cost}
              required
            />
          </div>

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl mt-5 p-2"
          >
            <input
              className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
              type="date"
              name="expiresAt"
              id="expiresAt"
              placeholder="Expires"
              onChange={handlechange}
              value={data?.expiresAt}
              required
            />
          </div>

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl mt-5 p-2"
          >
            <input
              className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
              type="url"
              name="imageURL"
              id="imageURL"
              placeholder="Image URL"
              onChange={handlechange}
              value={data?.imageURL}
              required
            />
          </div>

          <div
            className="flex justify-between items-center
          bg-gray-300 rounded-xl mt-5 p-2"
          >
            <textarea
              className="block w-full bg-transparent
            border-0 text-sm text-slate-500 focus:outline-none
            focus:ring-0"
              type="text"
              id="description"
              name="description"
              placeholder="Description"
              onChange={handlechange}
              value={data?.description}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            className="inline-block px-6 py-2.5 bg-green-600
            text-white font-medium text-md leading-tight
            rounded-full shadow-md hover:bg-green-700 mt-5"
          >
            Submit Project
          </button>
        </form>
      </div>
    </section>
  );
}

export default CreateProjects;
