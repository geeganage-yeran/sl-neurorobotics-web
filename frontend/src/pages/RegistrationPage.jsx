import React, { useState } from "react";
import LeftImage from "../assets/image1.jpg";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    country: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {/* Left side -Image */}
      <div className="hidden lg:block lg:w-1/2 fixed left-0 top-0 h-screen">
        <img
          src={LeftImage}
          alt="LeftImage"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 lg:ml-auto flex justify-center p-4 sm:p-6 lg:p-8 bg-[#F5F5F5]">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Get Started Now
            </h2>
            <p className="text-gray-600">
              Create Your Account and Explore Our EEG Devices
            </p>
          </div>

          {/* Form */}
          <div data-aos="fade-up" className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    First Name <span className="text-red-600" >*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Your first name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Last Name <span className="text-red-600" >*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Your last name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address <span className="text-red-600" >*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="slneuro@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="contact"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Phone Number <span className="text-red-600" >*</span>
                  </label>
                  <input
                    type="tel"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="+94 7544 4456"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Country <span className="text-red-600" >*</span>
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all duration-200 hover:border-gray-300 bg-white"
                    required
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="GB">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="JP">Japan</option>
                    <option value="IN">India</option>
                    <option value="BR">Brazil</option>
                    <option value="MX">Mexico</option>
                    <option value="IT">Italy</option>
                    <option value="ES">Spain</option>
                    <option value="NL">Netherlands</option>
                    <option value="SE">Sweden</option>
                    <option value="NO">Norway</option>
                    <option value="DK">Denmark</option>
                    <option value="FI">Finland</option>
                    <option value="CH">Switzerland</option>
                    <option value="AT">Austria</option>
                    <option value="BE">Belgium</option>
                    <option value="LK">Sri Lanka</option>
                    <option value="SG">Singapore</option>
                    <option value="MY">Malaysia</option>
                    <option value="TH">Thailand</option>
                    <option value="PH">Philippines</option>
                    <option value="ID">Indonesia</option>
                    <option value="VN">Vietnam</option>
                    <option value="KR">South Korea</option>
                    <option value="CN">China</option>
                    <option value="HK">Hong Kong</option>
                    <option value="TW">Taiwan</option>
                    <option value="NZ">New Zealand</option>
                    <option value="ZA">South Africa</option>
                    <option value="NG">Nigeria</option>
                    <option value="EG">Egypt</option>
                    <option value="MA">Morocco</option>
                    <option value="KE">Kenya</option>
                    <option value="GH">Ghana</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="IL">Israel</option>
                    <option value="TR">Turkey</option>
                    <option value="RU">Russia</option>
                    <option value="PL">Poland</option>
                    <option value="CZ">Czech Republic</option>
                    <option value="HU">Hungary</option>
                    <option value="RO">Romania</option>
                    <option value="BG">Bulgaria</option>
                    <option value="HR">Croatia</option>
                    <option value="SK">Slovakia</option>
                    <option value="SI">Slovenia</option>
                    <option value="LT">Lithuania</option>
                    <option value="LV">Latvia</option>
                    <option value="EE">Estonia</option>
                    <option value="AR">Argentina</option>
                    <option value="CL">Chile</option>
                    <option value="CO">Colombia</option>
                    <option value="PE">Peru</option>
                    <option value="VE">Venezuela</option>
                    <option value="UY">Uruguay</option>
                    <option value="PY">Paraguay</option>
                    <option value="BO">Bolivia</option>
                    <option value="EC">Ecuador</option>
                    <option value="GT">Guatemala</option>
                    <option value="HN">Honduras</option>
                    <option value="SV">El Salvador</option>
                    <option value="NI">Nicaragua</option>
                    <option value="CR">Costa Rica</option>
                    <option value="PA">Panama</option>
                    <option value="DO">Dominican Republic</option>
                    <option value="CU">Cuba</option>
                    <option value="JM">Jamaica</option>
                    <option value="TT">Trinidad and Tobago</option>
                    <option value="BB">Barbados</option>
                    <option value="BS">Bahamas</option>
                    <option value="BZ">Belize</option>
                    <option value="GY">Guyana</option>
                    <option value="SR">Suriname</option>
                    <option value="UZ">Uzbekistan</option>
                    <option value="KZ">Kazakhstan</option>
                    <option value="KG">Kyrgyzstan</option>
                    <option value="TJ">Tajikistan</option>
                    <option value="TM">Turkmenistan</option>
                    <option value="AF">Afghanistan</option>
                    <option value="PK">Pakistan</option>
                    <option value="BD">Bangladesh</option>
                    <option value="LK">Sri Lanka</option>
                    <option value="NP">Nepal</option>
                    <option value="BT">Bhutan</option>
                    <option value="MV">Maldives</option>
                    <option value="MM">Myanmar</option>
                    <option value="LA">Laos</option>
                    <option value="KH">Cambodia</option>
                    <option value="BN">Brunei</option>
                    <option value="TL">East Timor</option>
                    <option value="PG">Papua New Guinea</option>
                    <option value="FJ">Fiji</option>
                    <option value="VU">Vanuatu</option>
                    <option value="SB">Solomon Islands</option>
                    <option value="NC">New Caledonia</option>
                    <option value="PF">French Polynesia</option>
                    <option value="WS">Samoa</option>
                    <option value="TO">Tonga</option>
                    <option value="KI">Kiribati</option>
                    <option value="TV">Tuvalu</option>
                    <option value="NR">Nauru</option>
                    <option value="PW">Palau</option>
                    <option value="FM">Micronesia</option>
                    <option value="MH">Marshall Islands</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password 
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0582CA] focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  required
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-[#006494] text-white font-semibold py-3 px-4 rounded-lg hover:bg-[#003554] focus:outline-none focus:ring-2 focus:ring-[#0582CA] focus:ring-offset-2 transform transition-all cursor-pointer duration-200 hover:scale-105 shadow-lg"
              >
                Create Account
              </button>

            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500 font-medium">
                    or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 cursor-pointer w-full flex items-center justify-center py-3 px-4 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="#"
                className="font-semibold text-[#0582CA] transition-colors duration-200"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}