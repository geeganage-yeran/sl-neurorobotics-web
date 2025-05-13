
import pictute01 from "../img/pic.png";
import logo from "../img/logo.png";
import picture from "../img/picture.jpg";
import { IoMdCall } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { CgMail } from "react-icons/cg";
import { TbWorld } from "react-icons/tb";
import React, { useState } from "react";
import Footer from "../components/Footer";

function AboutUs() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phonenum, setPhonenum] = useState("");
  const [country, setCountry] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
  e.preventDefault();
  // You can handle the form submission logic here
  console.log("Form submitted", { name, email, phonenum, country, message });
};

  return (
    <div>
      <div
        className="h-[196px] flex justify-center content-center"
        style={{ backgroundColor: "#051923" }}
      >
        <div className="h-[109px] my-auto">
          <img className="w-[630px] h-[109px]" src={pictute01} alt="logo" />
        </div>
      </div>
      <div class="flex flex-col md:flex-row mt-5">
        <div className="w-[353px] h-[511px] bg-gray-300 ml-[76px]">
          <img
            class="h-60 w-full object-cover md:h-[416px] md:w-[286.7px] ml-[33px] mt-[58px]"
            src={logo}
            alt="Modern building architecture"
          />
        </div>
        <div className="w-[915px] h-[429px] ml-[20px]">
          <h1 class="text-6xl font-semibold" style={{ color: "#051923" }}>
            ABOUT US
          </h1>
          <p className="mt-2 font-medium text-2xl text-justify">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut iaculis
            neque et venenatis molestie. Etiam tortor libero, venenatis ac
            facilisis quis, volutpat pharetra elit. Duis massa velit, fermentum
            feugiat justo at, facilisis tristique tellus. Sed tincidunt luctus
            ante, vel vestibulum purus aliquam non. Maecenas dictum fringilla
            lacus, ut mollis mi lobortis sed. Ut at dui leo. Morbi vel
            vestibulum ex. Phasellus viverra nulla ipsum, ac elementum erat
            varius id. Proin est tortor, lacinia nec rhoncus ac, efficitur eu
            nisi. Morbi tristique neque vitae pulvinar consequat. Maecenas vitae
            dui et est imperdiet accumsan. Curabitur ullamcorper, risus a
            molestie congue, felis nisl.Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Quisque ac nisi congue, rhoncus eros eu, tempor
            odio. Curabitur consequat mauris orci, et fringilla sapien mattis
            eu. In risus quam, blandit ut fermentum vitae, lacinia vel dolor.
            Cras nec cursus velit. Duis porttitor fermentum eros quis iaculis.
            Lorem ipsum dolor sit.
          </p>
        </div>
      </div>
      <div className="mt-[48px] ml-[76px]">
        <img
          class="object-cover h-[494px] w-[1288px]"
          src={picture}
          alt="Modern building architecture"
        />
      </div>
      <div className="ml-[76px] h-[75px] mt-[47px]">
        <h1 class="text-6xl font-semibold" style={{ color: "#051923" }}>
          Get In Touch
        </h1>
      </div>

      <div className="flex flex-col md:flex-row mt-[55px] h-[800px]">
        <div className="w-[446px] h-[558px] ml-[76px] ">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.2212940274026!2d81.07679557448316!3d6.983191417651798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae4618a1a9fec37%3A0x1dd900702229654b!2sUva%20Wellassa%20University%20of%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1745739710767!5m2!1sen!2slk"
            className="w-full h-full"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="w-[915px] h-[429px] ml-[20px] ">
          <div className="icons">
            <div className="flex">
              <div className="w-[26px] h-[27.13px]">
                <IoMdCall size={26} color="#003554" />
              </div>
              <div className="ml-[23px]">
                <p className="font-semibold text-lg">+94 71 061 9833</p>
              </div>
            </div>
            <div className="flex mt-[34px]">
              <div className="w-[26px] h-[27.13px]">
                <FaLocationDot size={26} color="#003554" />
              </div>
              <div className="ml-[23px]">
                <p className="font-semibold text-lg">
                  SL Neurorobotics (PVT) LTD <br></br>
                  80/3/2, Temple Road, Rambukpotha, Badulla, Sri Lanka
                </p>
              </div>
            </div>
            <div className="flex mt-[34px]">
              <div className="w-[26px] h-[27.13px]">
                <CgMail size={26} color="#003554" />
              </div>
              <div className="ml-[23px]">
                <p className="font-semibold text-lg">
                  slneurorobotics@gmail.com
                </p>
              </div>
            </div>
            <div className="flex mt-[34px]">
              <div className="w-[26px] h-[27.13px]">
                <TbWorld size={26} color="#003554" />
              </div>
              <div className="ml-[23px]">
                <p className="font-semibold text-lg">www.slneurorobotics.com</p>
              </div>
            </div>
          </div>
          <h1
            className="font-medium mt-[45px]"
            style={{ color: "#051923", fontSize: "29.2px" }}
          >
            Send Us A Message
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="flex mt-3">
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-[376px] rounded-md sm:text-sm focus:ring-1"
                placeholder="Enter Your Name"
              />
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                class="mt-1 ml-[30px] px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-[376px] rounded-md sm:text-sm focus:ring-1"
                placeholder="Enter Your Email"
              />
            </div>
            <div className="flex mt-3">
              <input
                type="text"
                name="number"
                value={phonenum}
                onChange={(e) => setPhonenum(e.target.value)}
                required
                class="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-[376px] rounded-md sm:text-sm focus:ring-1"
                placeholder="Contact Number"
              />
              <select
                class="mt-1 ml-[30px] px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-[376px] rounded-md sm:text-sm focus:ring-1 "
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value={""} disabled>
                  Select Your Country
                </option>
                <option value={"Sri Lanka"}>Sri Lanka</option>
              </select>
            </div>
            <div className="mt-3">
              <textarea
                className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-[782px] h-[193px] rounded-md sm:text-sm focus:ring-1"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="mt-3">
              <button
                type="submit"
                class="rounded px-[18px] py-[10px] font-semibold text-lg"
                style={{ backgroundColor: "#051923", color: "#FFFFFF" }}
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default AboutUs
