import React from 'react'
import icon from "../img/icon.png";
import { FaFacebook } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaYoutube } from "react-icons/fa";

function Footer() {
  return (
   <>
    <footer className="bg-gray-900 text-gray-300 px-8 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between">
            <div>
              <div className="flex items-center space-x-3">
                {/* Replace with your logo */}
                <div>
                  <img src={icon} alt="" className="w-[410px] h-[71px]" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6">
                SL Neurorobotics (Pvt) LTD <br />
                80/3/2, Temple Road, Rambukpotha, Badulla, <br />
                Sri Lanka
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
              {/* Product Links */}
              <div>
                <h3 className="text-white text-lg mb-4 font-semibold">
                  Product
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:underline">
                      Product 1
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Product 2
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Product 3
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Product 4
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="text-white text-lg mb-4 font-semibold">
                  Company
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:underline">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Patents
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:underline">
                      Terms of Use
                    </a>
                  </li>
                </ul>
              </div>

              {/* Follow Icons */}
              <div>
                <h3 className="text-white text-lg mb-4 font-semibold">
                  Follow
                </h3>
                <div className="flex space-x-4">
                  <a href="#">
                    <FaFacebook size={19}/>
                  </a>
                  <a href="#">
                    <IoLogoWhatsapp size={19}/>
                  </a>
                  <a href="#">
                    <FaYoutube size={19} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
          © 2025 SL Neurorobotics, All rights reserved.
          <p className="mt-2 text-xs">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </p>
        </div>
      </footer>
   </>
  )
}

export default Footer
