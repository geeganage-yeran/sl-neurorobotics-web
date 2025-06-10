import React from "react";
import { Play, Download, ChevronRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

const ResourcesPage = () => {
  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <Header />
      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-gray-100 to-gray-200 lg:py-20">
        <div className="px-6 mx-auto lg:px-6 xl:px-0 md:px-6 max-w-7xl">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
            <div className="flex-1 space-y-6">
              <h1 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                BrainAccess HALO
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-justify text-gray-700 md:text-lg">
                Lorem ipsum is simply dummy text of the printing and typesetting
                industry. Lorem ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of
              </p>
              <Button variant="primary" px="px-5" className="flex items-center gap-2 text-sm" size="medium">
                <Download className="w-4 h-4 animate-bounce" />
                Download User Manual
              </Button>
            </div>
            <div className="flex justify-center flex-1">
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-red-400 to-orange-400 opacity-20 blur-xl"></div>
                <div className="relative flex items-center justify-center w-full h-full bg-gray-800 rounded-full shadow-2xl">
                  <div className="relative w-3/4 bg-gray-700 rounded-full h-3/4">
                    <div className="absolute w-6 h-6 bg-blue-400 rounded-full top-4 left-4"></div>
                    <div className="absolute w-4 h-4 bg-red-400 rounded-full top-8 right-6"></div>
                    <div className="absolute w-3 h-3 bg-orange-400 rounded-full bottom-6 left-8"></div>
                    <div className="absolute w-5 h-5 bg-green-400 rounded-full bottom-4 right-4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 lg:py-24">
        <div data-aos="fade-up" className="px-6 mx-auto lg:px-6 xl:px-0 md:px-6 max-w-7xl">
          <h2 className="mb-12 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
            Overview
          </h2>
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
            <div className="flex-1 space-y-6">
              <p className="leading-relaxed text-justify text-gray-700">
                Here are many variations of passages of lorem ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don't look even
                slightly believable. If you are going to use a passage of lorem
                ipsum, you need to be sure there isn't anything embarrassing
                hidden in the middle of text. All the lorem ipsum generators on
                the internet tend to repeat predefined chunks as necessary.
              </p>
              <p className="leading-relaxed text-justify text-gray-700">
                Making this the first true generator on the internet. It uses a
                dictionary of over 200 latin words, combined with a handful of
                model sentence structures, to generate lorem ipsum which looks
                reasonable. The generated lorem ipsum is therefore always free
                from repetition, injected humou
              </p>
            </div>
            <div className="flex justify-center flex-1 lg:justify-end">
              <div className="relative w-64 h-64 md:w-72 md:h-72">
                <div className="absolute inset-0 transform bg-gradient-to-br from-red-400 via-orange-400 to-yellow-400 rounded-2xl opacity-20 blur-xl rotate-12"></div>
                <div className="relative flex items-center justify-center w-full h-full transform bg-gray-800 shadow-xl rounded-2xl -rotate-6">
                  <div className="relative w-32 h-32 bg-gray-600 rounded-full">
                    <div className="absolute border-2 border-red-400 rounded-full inset-2"></div>
                    <div className="absolute w-4 h-4 transform -translate-x-1/2 -translate-y-1/2 bg-red-400 rounded-full top-1/2 left-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Setup Tutorial Section */}
      <section className="py-16 bg-white lg:py-24">
        <div className="px-6 mx-auto lg:px-6 xl:px-0 md:px-6 max-w-7xl">
          <h2 className="mb-12 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
            BrainAccess HALO Setup Tutorial
          </h2>
          <div className="relative w-full max-w-7xl ">
            <div className="overflow-hidden shadow-2xl aspect-video rounded-xl">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/LWX6m5CsO-g"
                title="BrainAccess HALO Setup Tutorial"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      <section className="py-16 lg:py-24">
        <div data-aos="fade-up" className="px-6 mx-auto lg:px-6 xl:px-0 md:px-6 max-w-7xl">
          <h2 className="mb-12 text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">
            Specifications
          </h2>
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
            <div className="flex-1 space-y-6">
              <p className="leading-relaxed text-justify text-gray-700">
                Here are many variations of passages of lorem ipsum available,
                but the majority have suffered alteration in some form, by
                injected humour, or randomised words which don't look even
                slightly believable. If you are going to use a passage of lorem
                ipsum, you need to be sure there isn't anything embarrassing
                hidden in the middle of text. All the lorem ipsum generators on
                the internet tend to repeat predefined chunks as necessary.
              </p>
              <p className="leading-relaxed text-justify text-gray-700">
                Making this the first true generator on the internet. It uses a
                dictionary of over 200 latin words, combined with a handful of
                model sentence structures, to generate lorem ipsum which looks
                reasonable. The generated lorem ipsum is therefore always free
                from repetition, injected humou
              </p>
               <Button variant="primary" px="px-5" className="flex items-center gap-2 text-sm" size="medium">
                Want To Know More ?
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex justify-center flex-1 lg:justify-end">
              <div className="relative w-64 h-80 md:w-72 md:h-96">
                <div className="absolute inset-0 transform bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 rounded-3xl opacity-20 blur-xl -rotate-6"></div>
                <div className="relative flex flex-col items-center justify-center w-full h-full overflow-hidden transform bg-gray-800 shadow-xl rounded-3xl rotate-3">
                  <div className="relative w-24 h-24 mb-8 bg-gray-600 rounded-full">
                    <div className="absolute border-2 border-red-400 rounded-full inset-1"></div>
                    <div className="absolute w-3 h-3 transform -translate-x-1/2 -translate-y-1/2 bg-red-400 rounded-full top-1/2 left-1/2"></div>
                  </div>
                  <div className="relative w-32 h-32 bg-gray-700 rounded-2xl">
                    <div className="absolute w-4 h-4 bg-blue-400 rounded-full top-2 left-2"></div>
                    <div className="absolute w-3 h-3 bg-green-400 rounded-full top-4 right-3"></div>
                    <div className="absolute w-2 h-2 bg-yellow-400 rounded-full bottom-3 left-4"></div>
                    <div className="absolute w-4 h-4 bg-purple-400 rounded-full bottom-2 right-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ResourcesPage;
