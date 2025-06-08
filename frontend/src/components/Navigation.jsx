
import picture02 from "../img/picture2.png";
import { IoSearch } from "react-icons/io5";
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <div className="flex justify-around h-[114px]">
            <div className="mt-[35px]">
            <a href="" className="font-semibold" style={{ fontSize: "23px" }}>
            <img className="w-[306px] h-[56px]" src={picture02} alt="logo" />
              </a>
            </div>
            <div
              className="w-[70px] h-[35px] mt-[44px] hover:border-b-4"
              style={{ borderColor: "#003554" }}
            >
              <a href="" className="font-semibold" style={{ fontSize: "23px" }}>
                Home
              </a>
            </div>
            <div
              className="w-[122px] h-[35px] mt-[44px] hover:border-b-4"
              style={{ borderColor: "#003554" }}
            >
              <a href="#" className="font-semibold" style={{ fontSize: "23px" }}>
                Resources
              </a>
            </div>
            <div
              className="w-[105px] h-[35px] mt-[44px] hover:border-b-4"
              style={{ borderColor: "#003554" }}
            >
              <a href="#" className="font-semibold" style={{ fontSize: "23px" }}>
                Products
              </a>
            </div>
            <div
              className="w-[106px] h-[35px] mt-[44px] hover:border-b-4"
              style={{ borderColor: "#003554" }}
            >
              <a href="" className="font-semibold" style={{ fontSize: "23px" }}>
                About Us
              </a>
            </div>
            <div
              className="w-[95px] h-[35px] mt-[44px] hover:border-b-4"
              style={{ borderColor: "#003554" }}
            >
              <a href="#" className="font-semibold" style={{ fontSize: "23px" }}>
                Contact
              </a>
            </div>
            <div className="w-[35px] h-[35px] mt-[44px]">
              <a href="#">
                <IoSearch size={35} />
              </a>
            </div>
            <div className="mt-[39px]">
              <a href="">
                <button
                  class="rounded px-[12px] py-[8px] font-semibold text-lg w-[126px] h-[45px]"
                  style={{ backgroundColor: "#051923", color: "#FFFFFF" }}
                >
                  Account
                </button>
              </a>
            </div>
          </div>
  )
}

export default Navigation
