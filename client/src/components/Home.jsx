import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

export const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="max-h-screen">
      <nav className="md:flex md:justify-between md:w-12/13 md:m-auto p-5 md:p-10 md:items-center relative">
        <div className="company-logo w-[50%] md:w-[20%]">
          <h1 className="text-4xl font-medium z-60 text-gray-300">
            Yeong<span className="text-purple-500 font-light">Sil</span>
          </h1>
        </div>

        {/* Hamburger Icon */}
        <div className="lg:hidden">
          {!isOpen && (
            <button
              className="absolute right-5 top-7"
              onClick={() => setIsOpen(true)}
            >
              <i className="ri-menu-3-line text-3xl text-gray-400"></i>
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <div
          className={`${
            isOpen ? "block" : "hidden"
          } lg:flex flex-col lg:flex-row gap-5 lg:gap-10 absolute lg:static right-0 top-0  bg-[#111] lg:bg-transparent p-6 lg:p-0 min-w-[360px] h-[400px]  md:h-auto lg:w-auto z-50`}
        >
          {/* Cross Icon */}
          <div className="lg:hidden flex justify-end">
            <button
              className="absolute right-5 top-7"
              onClick={() => setIsOpen(false)}
            >
              <i className="ri-close-line text-3xl text-gray-400"></i>
            </button>
          </div>

          <ul className="mt-12 lg:mt-0 flex flex-col lg:flex-row items-center gap-5">
            <li>
              <Link to="/about" className="text-xl text-gray-300">
                About
              </Link>
            </li>
            <li>
              <Link to="/services" className="text-xl text-gray-300">
                Services
              </Link>
            </li>
            <li>
              <Link to="/docs" className="text-xl text-gray-300">
                Documentation
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-xl text-gray-300">
                Contact
              </Link>
            </li>
          </ul>

          <ul className="flex justify-center lg:justify-start gap-3 mt-4 lg:mt-0">
            <li>
              <Link to="#">
                <i className="ri-github-line text-2xl text-gray-400"></i>
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="ri-reddit-line text-2xl text-gray-400"></i>
              </Link>
            </li>
            <li>
              <Link to="#">
                <i className="ri-twitter-line text-2xl text-gray-400"></i>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="hero mb-0 relative ">
        <div className="hero-top md:mt-30 flex flex-col w-[80%] md:w-[80%] items-center justify-center m-auto mt-20 z-20">
          <h1 className=" text-5xl md:text-8xl text-center lg:leading-17 pt-3 bg-linear-to-bl from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">
            "Hey Yeong Sil"
            <br />{" "}
            <span className="text-white lg:text-4xl md:text-3xl text-2xl leading-0 m-0 p-0">
              Your Caring, AI-Powered Memory Assistant
            </span>
          </h1>
          <p className="w-[80%] mt-9 text-center md:text-xl text-gray-300 text-shadow-lg text-shadow-black md:w-[73%] leading-8">
            Yeong Sil is a voice-activated AI assistant designed to support
            individuals with memory loss. With face recognition, natural
            conversation, and personalized reminders, it helps users stay
            connected, independent, and reassured—bridging the gap between care
            and technology.
          </p>
          <Link
            to="/about"
            className=" bg-transparent hover:bg-linear-to-bl from-violet-500 to-fuchsia-500 transition-all border-purple-400 border-2 hover:bg-purple-500 text-white px-14 mt-8 py-2 rounded-md z-40 "
          >
            Learn More
          </Link>
        </div>
        <div className="hero-bottom absolute -bottom-63 left-auto w-full z-10">
          <img
            src="/image/hero-img.png"
            alt="hero"
            className=" md:w-full opacity-35"
          />
        </div>
      </div>
    </div>
  );
};
