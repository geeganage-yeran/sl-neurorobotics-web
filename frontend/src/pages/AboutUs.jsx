
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
    <div className="w-full">
    <div className="h-48 flex justify-center items-center bg-[#051923]">
      <img className="w-4/5 max-w-2xl h-auto" src={pictute01} alt="logo" />
    </div>
    <div className="flex flex-col md:flex-row mt-5 px-4 md:px-12">
      <div className="bg-gray-300 flex justify-center md:w-1/3 py-3">
        <img
          className="h-60 md:h-[416px] w-auto "
          src={logo}
          alt="Logo"
        />
      </div>
      <div className="md:w-2/3 mt-6 md:mt-0 md:ml-6">
        <h1 className="text-3xl md:text-6xl font-semibold text-[#051923]">ABOUT US</h1>
        <p className="mt-3 text-base md:text-xl text-justify font-medium">
          orem ipsum dolor sit amet, consectetur adipiscing elit. Ut iaculis
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

    <div className="mt-12 px-4 md:px-12">
      <img
        className="w-full h-auto object-cover"
        src={picture}
        alt="Modern building"
      />
    </div>

    <div className="mt-12 px-4 md:px-12">
      <h1 className="text-3xl md:text-6xl font-semibold text-[#051923]">Get In Touch</h1>
    </div>

    <div className="flex flex-col lg:flex-row gap-6 mt-10 px-4 md:px-12">

      <div className="w-full lg:w-1/3 h-[300px] md:h-[500px]">
        <iframe
           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.2212940274026!2d81.07679557448316!3d6.983191417651798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae4618a1a9fec37%3A0x1dd900702229654b!2sUva%20Wellassa%20University%20of%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1745739710767!5m2!1sen!2slk"
          className="w-full h-full rounded-md"
          allowFullScreen=""
          loading="lazy"
        ></iframe>
      </div>

      <div className="w-full lg:w-2/3">
        <div className="space-y-6">
          <div className="flex items-start">
            <IoMdCall size={26} color="#003554" />
            <p className="ml-4 font-semibold text-lg">+94 71 061 9833</p>
          </div>
          <div className="flex items-start">
            <FaLocationDot size={26} color="#003554" />
            <p className="ml-4 font-semibold text-lg">
              SL Neurorobotics (PVT) LTD<br />
              80/3/2, Temple Road, Rambukpotha, Badulla, Sri Lanka
            </p>
          </div>
          <div className="flex items-start">
            <CgMail size={26} color="#003554" />
            <p className="ml-4 font-semibold text-lg">slneurorobotics@gmail.com</p>
          </div>
          <div className="flex items-start">
            <TbWorld size={26} color="#003554" />
            <p className="ml-4 font-semibold text-lg">www.slneurorobotics.com</p>
          </div>
        </div>

        <h2 className="text-2xl font-medium text-[#051923] mt-8">Send Us A Message</h2>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Enter Your Name"
            />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Enter Your Email"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              name="number"
              value={phonenum}
              onChange={(e) => setPhonenum(e.target.value)}
              required
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md"
              placeholder="Contact Number"
            />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md"
            >
              <option value="" disabled>Select Your Country</option>
              <option value="Sri Lanka">Sri Lanka</option>
            </select>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full h-40 px-3 py-2 border border-slate-300 rounded-md"
            placeholder="Message"
          ></textarea>

          <button
            type="submit"
            className="px-6 py-3 bg-[#051923] text-white font-semibold rounded-md"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>

    <Footer />
  </div>
  )
}

export default AboutUs
