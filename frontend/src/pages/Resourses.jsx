import React from 'react'
import headeeg from "../img/headeeg.png";
import headeeg2 from "../img/headeeg2.png";
import Footer from '../components/Footer';
import Navigation from '../components/Navigation';

function Resourses() {
  return (
    <div>
        <Navigation/>
      <div>
        <div className="md:px-12 flex flex-col md:flex-row bg-[#F5F5F5] py-8">
            <div className='md:w-3/5'>
                <h1 className='font-bold text-[#003554] text-[55.64px]'>BrainAccess HALO</h1>
                <p className='text-justify text-[22.64px] font-normal text-[#000000] leading-7 mt-3'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of</p>
                <button className='bg-[#051923] text-[#FFFFFF] font-medium text-[26.64px] px-3 py-1 rounded-md mt-10'>Download User Manual</button>
            </div>
            <div className='md:w-2/5 md:ml-6'>
            <img src={headeeg} alt='headeeg' className="h-auto w-full"/>
            </div>
        </div>
        <div className="md:px-12 flex flex-col md:flex-row py-8">
            <div className='md:w-3/5'>
                <h1 className='font-semibold text-[#121212] text-[55.64px]'>Overview</h1>
                <p className='text-justify text-[22.64px] font-normal text-[#000000] leading-7 mt-3'>here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humou</p>
            </div>
            <div className='md:w-2/5 md:ml-24'>
            <img className="h-auto w-full" src={headeeg2} alt='headeeg'/>
            </div>
        </div>
        <div className="md:px-12">
             <h1 className='font-semibold text-[#121212] text-[55.64px]'>BrainAcccess HALO Setup Tutorial</h1>
        </div>
        <div className="md:px-12 pt-5">
             <iframe className='w-full h-[720px]' src="https://www.youtube.com/embed/wVIwf9ZhChs?si=0gLdbCGbJmTGWE7i" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        <div className="md:px-12 flex flex-col md:flex-row py-8">
            <div className='md:w-3/5'>
                <h1 className='font-semibold text-[#121212] text-[55.64px]'>Specifications</h1>
                <p className='text-justify text-[22.64px] font-normal text-[#000000] leading-7 mt-3'>here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humou</p>
                 <button className='bg-[#003554] text-[#FFFFFF] font-medium text-[26.64px] px-3 py-1 rounded-md mt-10'>Want to Know more ?</button>
            </div>
            <div className='md:w-2/5 md:ml-24'>
            <img className="h-auto w-full" src={headeeg2} alt='headeeg'/>
            </div>
        </div>
      </div>
      <Footer/>
    </div>
  )
}

export default Resourses
