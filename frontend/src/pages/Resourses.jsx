import React from "react";
import headeeg from "../img/headeeg.png";
import headeeg2 from "../img/headeeg2.png";
import Footer from "../components/Footer";
import Navigation from "../components/Navigation";

function Resourses() {
  const handlescroll = () => {
    const section = document.getElementById("section-1");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      {/* <Navigation /> */}
      <div>
        <div className="px-4 lg:px-12 flex flex-col-reverse lg:flex-row bg-[#F5F5F5] py-10 gap-y-6 lg:gap-y-0">
          <div className="lg:w-3/5">
            <h1 className="font-bold text-[#003554] text-3xl lg:text-[55.64px]">
              BrainAccess HALO
            </h1>
            <p className="text-justify text-base lg:text-[22.64px] font-normal text-[#000000] leading-7 mt-3 md:mt-10">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry...
            </p>
            <button className="bg-[#051923] text-white font-medium text-lg lg:text-[26.64px] px-4 py-2 rounded-md mt-6">
              Download User Manual
            </button>
          </div>
          <div className="lg:w-2/5 lg:ml-6">
            <img
              src={headeeg}
              alt="headeeg"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        <div className="px-4 lg:px-12 flex flex-col lg:flex-row py-10 gap-y-6 lg:gap-y-0">
          <div className="lg:w-3/5">
            <h1 className="font-semibold text-[#121212] text-3xl lg:text-[55.64px]">
              Overview
            </h1>
            <p className="text-justify text-base lg:text-[22.64px] font-normal text-[#000000] leading-7 mt-3 md:mt-10">
              here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humou
            </p>
          </div>
          <div className="lg:w-2/5 lg:ml-24">
            <img
              className="w-full h-auto object-contain"
              src={headeeg2}
              alt="headeeg2"
            />
          </div>
        </div>

        <div className="px-4 lg:px-12 md:mb-6">
          <h1 className="font-semibold text-[#121212] text-3xl lg:text-[55.64px] md:mt-4">
            BrainAccess HALO Setup Tutorial
          </h1>
          <div className="aspect-w-16 aspect-h-9  mt-5 md:mt-10" id="section-1">
            <iframe
              className="w-full h-[320px] lg:h-[720px]"
              src="https://www.youtube.com/embed/wVIwf9ZhChs?si=0gLdbCGbJmTGWE7i"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="px-4 lg:px-12 flex flex-col lg:flex-row py-10 gap-y-6 lg:gap-y-0">
          <div className="lg:w-3/5">
            <h1 className="font-semibold text-[#121212] text-3xl lg:text-[55.64px]">
              Specifications
            </h1>
            <p className="text-justify text-base lg:text-[22.64px] font-normal text-[#000000] leading-7 mt-3 md:mt-10">
              here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humou
            </p>
            <button
              className="bg-[#003554] text-white font-medium text-lg lg:text-[26.64px] px-4 py-2 rounded-md mt-8"
              onClick={handlescroll}
            >
              Want to Know More ?
            </button>
          </div>
          <div className="lg:w-2/5 lg:ml-24">
            <img
              className="w-full h-auto object-contain"
              src={headeeg2}
              alt="headeeg"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Resourses;
