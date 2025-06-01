import React from "react";
import epoc from "../img/epoc.png";
import ar from "../img/ar.gif";
import Footer from "../components/Footer";


function Product() {
  return (
    <div>
      <div className="px-4 md:px-12">
        <div className="flex flex-col text-center gap-4">
          <h1 className="font-semibold text-[#051923] text-5xl md:text-7xl">Shop</h1>
          <h1>
            Check out our full collection of products tailored to your needs.
          </h1>
          <h1>
            <form class="md:w-[450px] mx-auto bg-transparent">
              <div class="relative">
                <input
                  type="search"
                  id="default-search"
                  class="block w-full p-2 ps-4 pr-12 text-sm border border-black rounded-3xl"
                  placeholder="Search ..."
                  required
                />
                <button
                  type="submit"
                  class="absolute end-1 top-1/2 -translate-y-1/2 p-2 rounded-full"
                >
                  <svg
                    class="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </h1>
        </div>
        <div className="flex justify-center gap-6 md:gap-14 pt-8 flex-col md:flex-row ">
          <div class="w-full max-w-sm  rounded-lg shadow-sm bg-[#00355412]">
            <div className="px-5 p-3">
              <span class="text-2xl font-semibold text-black">
                14 channel wireless EEG
              </span>
            </div>
            <div className="px-5">
              <div class="flex items-center justify-between">
                <span class="text-4xl font-semibold text-[#003554]">
                  Epoc X
                </span>
                <div class="px-5 py-2.5 ">
                  <a href="">
                    {" "}
                    <img src={ar} className="w-[58px] h-[58px] " />
                  </a>
                  <span className="font-medium text-[9px]">View with AR</span>
                </div>
              </div>
            </div>
            <div className="px-5">
              <span class="text-[20px] font-bold text-[#003554]">$999.00</span>
            </div>

            <a href="#">
              <img class="p-8 rounded-t-lg transition-all duration-300 hover:scale-110" src={epoc} alt="product image"/>
            </a>
            <div class="px-5 pb-5">
              <div class="flex items-center gap-2">
                <a
                  href="#"
                  class="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#003554] border hover:text-[#003554] hover:bg-transparent hover:border-[#003554]"
                >
                  Buy now
                </a>
                <a
                  href="#"
                  class="text-[#003554] font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-[#003554] hover:bg-[#003554] hover:text-white"
                >
                  Add to cart
                </a>
              </div>
            </div>
          </div>
           <div class="w-full max-w-sm  rounded-lg shadow-sm bg-[#00355412]">
            <div className="px-5 p-3">
              <span class="text-2xl font-semibold text-black">
                14 channel wireless EEG
              </span>
            </div>
            <div className="px-5">
              <div class="flex items-center justify-between">
                <span class="text-4xl font-semibold text-[#003554]">
                  Epoc X
                </span>
                <div class="px-5 py-2.5 ">
                  <a href="">
                    {" "}
                    <img src={ar} className="w-[58px] h-[58px]" />
                  </a>
                  <span className="font-medium text-[9px]">View with AR</span>
                </div>
              </div>
            </div>
            <div className="px-5">
              <span class="text-[20px] font-bold text-[#003554]">$999.00</span>
            </div>

            <a href="#">
              <img class="p-8 rounded-t-lg transition-all duration-300 hover:scale-110" src={epoc} alt="product image" />
            </a>
            <div class="px-5 pb-5">
              <div class="flex items-center gap-2">
                <a
                  href="#"
                  class="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#003554] border hover:text-[#003554] hover:bg-transparent hover:border-[#003554]"
                >
                  Buy now
                </a>
                <a
                  href="#"
                  class="text-[#003554] font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-[#003554] hover:bg-[#003554] hover:text-white"
                >
                  Add to cart
                </a>
              </div>
            </div>
          </div>
              <div class="w-full max-w-sm  rounded-lg shadow-sm bg-[#00355412]">
            <div className="px-5 p-3">
              <span class="text-2xl font-semibold text-black">
                14 channel wireless EEG
              </span>
            </div>
            <div className="px-5">
              <div class="flex items-center justify-between">
                <span class="text-4xl font-semibold text-[#003554]">
                  Epoc X
                </span>
                <div class="px-5 py-2.5 ">
                  <a href="">
                    {" "}
                    <img src={ar} className="w-[58px] h-[58px]" />
                  </a>
                  <span className="font-medium text-[9px]">View with AR</span>
                </div>
              </div>
            </div>
            <div className="px-5">
              <span class="text-[20px] font-bold text-[#003554]">$999.00</span>
            </div>

            <a href="#">
              <img class="p-8 rounded-t-lg transition-all duration-300 hover:scale-110" src={epoc} alt="product image" />
            </a>
            <div class="px-5 pb-5">
              <div class="flex items-center gap-2">
                <a
                  href="#"
                  class="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#003554] border hover:text-[#003554] hover:bg-transparent hover:border-[#003554]"
                >
                  Buy now
                </a>
                <a
                  href="#"
                  class="text-[#003554] font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-[#003554] hover:bg-[#003554] hover:text-white"
                >
                  Add to cart
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-6 md:gap-14 py-8 flex-col md:flex-row">
          <div class="w-full max-w-sm  rounded-lg shadow-sm bg-[#00355412]">
            <div className="px-5 p-3">
              <span class="text-2xl font-semibold text-black">
                14 channel wireless EEG
              </span>
            </div>
            <div className="px-5">
              <div class="flex items-center justify-between">
                <span class="text-4xl font-semibold text-[#003554]">
                  Epoc X
                </span>
                <div class="px-5 py-2.5 ">
                  <a href="">
                    {" "}
                    <img src={ar} className="w-[58px] h-[58px]" />
                  </a>
                  <span className="font-medium text-[9px]">View with AR</span>
                </div>
              </div>
            </div>
            <div className="px-5">
              <span class="text-[20px] font-bold text-[#003554]">$999.00</span>
            </div>

            <a href="#">
              <img class="p-8 rounded-t-lg transition-all duration-300 hover:scale-110" src={epoc} alt="product image" />
            </a>
            <div class="px-5 pb-5">
              <div class="flex items-center gap-2">
                <a
                  href="#"
                  class="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#003554] border hover:text-[#003554] hover:bg-transparent hover:border-[#003554]"
                >
                  Buy now
                </a>
                <a
                  href="#"
                  class="text-[#003554] font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-[#003554] hover:bg-[#003554] hover:text-white"
                >
                  Add to cart
                </a>
              </div>
            </div>
          </div>
           <div class="w-full max-w-sm  rounded-lg shadow-sm bg-[#00355412]">
            <div className="px-5 p-3">
              <span class="text-2xl font-semibold text-black">
                14 channel wireless EEG
              </span>
            </div>
            <div className="px-5">
              <div class="flex items-center justify-between">
                <span class="text-4xl font-semibold text-[#003554]">
                  Epoc X
                </span>
                <div class="px-5 py-2.5 ">
                  <a href="">
                    {" "}
                    <img src={ar} className="w-[58px] h-[58px]" />
                  </a>
                  <span className="font-medium text-[9px]">View with AR</span>
                </div>
              </div>
            </div>
            <div className="px-5">
              <span class="text-[20px] font-bold text-[#003554]">$999.00</span>
            </div>

            <a href="#">
              <img class="p-8 rounded-t-lg transition-all duration-300 hover:scale-110" src={epoc} alt="product image" />
            </a>
            <div class="px-5 pb-5">
              <div class="flex items-center gap-2">
                <a
                  href="#"
                  class="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#003554] border hover:text-[#003554] hover:bg-transparent hover:border-[#003554]"
                >
                  Buy now
                </a>
                <a
                  href="#"
                  class="text-[#003554] font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-[#003554] hover:bg-[#003554] hover:text-white"
                >
                  Add to cart
                </a>
              </div>
            </div>
          </div>
              <div class="w-full max-w-sm  rounded-lg shadow-sm bg-[#00355412]">
            <div className="px-5 p-3">
              <span class="text-2xl font-semibold text-black">
                14 channel wireless EEG
              </span>
            </div>
            <div className="px-5">
              <div class="flex items-center justify-between">
                <span class="text-4xl font-semibold text-[#003554]">
                  Epoc X
                </span>
                <div class="px-5 py-2.5 ">
                  <a href="">
                    {" "}
                    <img src={ar} className="w-[58px] h-[58px]" />
                  </a>
                  <span className="font-medium text-[9px]">View with AR</span>
                </div>
              </div>
            </div>
            <div className="px-5">
              <span class="text-[20px] font-bold text-[#003554]">$999.00</span>
            </div>

            <a href="#">
              <img class="p-8 rounded-t-lg transition-all duration-300 hover:scale-110" src={epoc} alt="product image" />
            </a>
            <div class="px-5 pb-5">
              <div class="flex items-center gap-2">
                <a
                  href="#"
                  class="text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-[#003554] border hover:text-[#003554] hover:bg-transparent hover:border-[#003554]"
                >
                  Buy now
                </a>
                <a
                  href="#"
                  class="text-[#003554] font-medium rounded-lg text-sm px-5 py-2.5 text-center border border-[#003554] hover:bg-[#003554] hover:text-white"
                >
                  Add to cart
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default Product;
