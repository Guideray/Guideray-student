import React, { useState, useEffect, useRef } from 'react';
import { 
  FaUser, 
  FaUniversity, 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaGraduationCap, 
  FaBook, 
  FaUpload, 
  FaCheckCircle,
  FaArrowRight
} from 'react-icons/fa';
import { MdEmail, MdPhoneAndroid } from 'react-icons/md';
import './index.css';

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    profilePic: null,
    college: '',
    currentYear: '',
    department: '',
    branch: '',
    dob: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India'
    }
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Dropdown states
  const [dropdownOpen, setDropdownOpen] = useState({
    currentYear: false,
    gender: false 
  });

  const dropdownRefs = {
    currentYear: useRef(null),
    gender: useRef(null),
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs).forEach((key) => {
        if (dropdownRefs[key].current && !dropdownRefs[key].current.contains(event.target)) {
          setDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (field) => {
    setDropdownOpen(prev => ({
      ...Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {}),
      [field]: !prev[field]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setDropdownOpen(prev => ({ ...prev, [field]: false }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePic: file }));
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert('Please accept the terms and conditions.');
      return;
    }
    setIsSubmitting(true);
    
    try {
      // Simulation of API Call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if(key !== 'address' && key !== 'profilePic') formDataToSend.append(key, formData[key]);
      });
      if(formData.profilePic) formDataToSend.append('profilePic', formData.profilePic);
      Object.keys(formData.address).forEach(key => {
        formDataToSend.append(`address[${key}]`, formData.address[key]);
      });

      setShowSuccessPopup(true);
      
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    { title: "Coding Mentoring", icon: "👨‍💻", desc: "1:1 sessions with experts" },
    { title: "DSA Practice", icon: "🧮", desc: "Master algorithms easily" },
    { title: "Live Contests", icon: "🏆", desc: "Compete globally" },
    { title: "Project Guidance", icon: "🛠️", desc: "Build real-world apps" },
    { title: "Interview Prep", icon: "📝", desc: "Mock tests & reviews" },
    { title: "Open Source", icon: "🌐", desc: "Contribute & grow" },
  ];

  return (
    <div className="guideray-student-registration-layout-wrapper">
      {/* Background Grid */}
      <div className="guideray-student-registration-bg-grid"></div>

      {/* --- LEFT SIDE (60%) --- */}
      <div className="guideray-student-registration-section-left">
        <div className="guideray-student-registration-left-content-wrapper">
          <div className="guideray-student-registration-brand-header">
            <img src="/src/assets/images/guideray_logo_white.svg" alt="GuideRay" className="guideray-student-registration-logo" />
          </div>

          {/* UPDATED TITLE: Single Line, Same Size */}
          <h1 className="guideray-student-registration-hero-title">
            Join the <span className="guideray-student-registration-text-highlight">Elite Coders</span>
          </h1>
          
          <p className="guideray-student-registration-hero-description">
            Create your student profile today. Unlock access to premium mentorship, 
            industry-standard projects, and a community that pushes you to excel.
          </p>

          <div className="guideray-student-registration-features-grid-container">
            {features.map((item, idx) => (
              <div key={idx} className="guideray-student-registration-feature-card">
                <div className="guideray-student-registration-feature-card-icon">{item.icon}</div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE (40%) --- */}
      <div className="guideray-student-registration-section-right">
        {/* Scrollable Glass Card for Long Form */}
        <div className="guideray-student-registration-glass-card guideray-student-registration-scrollable-card">
          <div className="guideray-student-registration-form-header">
            <div className="guideray-student-registration-icon-circle"><FaUser /></div>
            <h2>Create Account</h2>
            <p>Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="guideray-student-registration-form">
            
            {/* 1. Personal Info */}
            <div className="guideray-student-registration-form-section-label">Personal Information</div>
            
            <div className="guideray-student-registration-input-group">
              <label>Full Name</label>
              <div className="guideray-student-registration-input-field-wrapper">
                <FaUser className="guideray-student-registration-field-icon" />
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
              </div>
            </div>

            <div className="guideray-student-registration-form-row">
              <div className="guideray-student-registration-input-group">
                <label>Email</label>
                <div className="guideray-student-registration-input-field-wrapper">
                  <MdEmail className="guideray-student-registration-field-icon" />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="email@example.com" />
                </div>
              </div>
              <div className="guideray-student-registration-input-group">
                <label>Mobile</label>
                <div className="guideray-student-registration-input-field-wrapper">
                  <MdPhoneAndroid className="guideray-student-registration-field-icon" />
                  <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required placeholder="9876543210" pattern="[0-9]{10}" />
                </div>
              </div>
            </div>

            <div className="guideray-student-registration-form-row">
               <div className="guideray-student-registration-input-group">
                <label>Gender</label>
                <div className="guideray-student-registration-custom-dropdown" ref={dropdownRefs.gender}>
                  <div className="guideray-student-registration-dropdown-trigger" onClick={() => toggleDropdown('gender')}>
                    <span>{formData.gender || "Select"}</span>
                    <FaArrowRight className={`guideray-student-registration-arrow ${dropdownOpen.gender ? 'open' : ''}`} />
                  </div>
                  {dropdownOpen.gender && (
                    <div className="guideray-student-registration-dropdown-options">
                      {["Male", "Female", "Other"].map(opt => (
                        <div key={opt} className="guideray-student-registration-option" onClick={() => handleSelect('gender', opt)}>{opt}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="guideray-student-registration-input-group">
                <label>Date of Birth</label>
                <div className="guideray-student-registration-input-field-wrapper">
                  <FaCalendarAlt className="guideray-student-registration-field-icon" />
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                </div>
              </div>
            </div>

             {/* Profile Pic Upload */}
             <div className="guideray-student-registration-input-group">
                <label>Profile Picture</label>
                <div className="guideray-student-registration-file-upload-wrapper">
                  <div className="guideray-student-registration-avatar-preview">
                    {previewImage ? <img src={previewImage} alt="Preview" /> : <FaUser />}
                  </div>
                  <label className="guideray-student-registration-upload-btn">
                    <FaUpload /> Upload Photo
                    <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                  </label>
                </div>
            </div>

            {/* 2. Academic Info */}
            <div className="guideray-student-registration-form-section-label">Academic Details</div>

            <div className="guideray-student-registration-input-group">
              <label>College / University</label>
              <div className="guideray-student-registration-input-field-wrapper">
                <FaUniversity className="guideray-student-registration-field-icon" />
                <input type="text" name="college" value={formData.college} onChange={handleChange} required placeholder="University Name" />
              </div>
            </div>

            <div className="guideray-student-registration-form-row">
              <div className="guideray-student-registration-input-group">
                <label>Department</label>
                <div className="guideray-student-registration-input-field-wrapper">
                  <FaBook className="guideray-student-registration-field-icon" />
                  <input type="text" name="department" value={formData.department} onChange={handleChange} required placeholder="CSE, ECE, etc." />
                </div>
              </div>
              <div className="guideray-student-registration-input-group">
                 <label>Year</label>
                 <div className="guideray-student-registration-custom-dropdown" ref={dropdownRefs.currentYear}>
                  <div className="guideray-student-registration-dropdown-trigger" onClick={() => toggleDropdown('currentYear')}>
                    <span>{formData.currentYear ? `${formData.currentYear} Year` : "Select"}</span>
                    <FaArrowRight className={`guideray-student-registration-arrow ${dropdownOpen.currentYear ? 'open' : ''}`} />
                  </div>
                  {dropdownOpen.currentYear && (
                    <div className="guideray-student-registration-dropdown-options">
                      {[1, 2, 3, 4].map(y => (
                        <div key={y} className="guideray-student-registration-option" onClick={() => handleSelect('currentYear', y)}>{y} Year</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="guideray-student-registration-input-group">
              <label>Branch / Specialization</label>
              <div className="guideray-student-registration-input-field-wrapper">
                <FaGraduationCap className="guideray-student-registration-field-icon" />
                <input type="text" name="branch" value={formData.branch} onChange={handleChange} required placeholder="AI/ML, Data Science..." />
              </div>
            </div>

            {/* 3. Address */}
            <div className="guideray-student-registration-form-section-label">Address</div>
            
            <div className="guideray-student-registration-input-group">
              <label>Street Address</label>
              <div className="guideray-student-registration-input-field-wrapper">
                <FaMapMarkerAlt className="guideray-student-registration-field-icon" />
                <input type="text" name="address.street" value={formData.address.street} onChange={handleChange} required placeholder="House No, Street Area" />
              </div>
            </div>

            <div className="guideray-student-registration-form-row">
              <div className="guideray-student-registration-input-group">
                <label>City</label>
                <div className="guideray-student-registration-input-field-wrapper">
                  <input type="text" name="address.city" value={formData.address.city} onChange={handleChange} required placeholder="City" style={{paddingLeft:'15px'}} />
                </div>
              </div>
              <div className="guideray-student-registration-input-group">
                <label>State</label>
                <div className="guideray-student-registration-input-field-wrapper">
                  <input type="text" name="address.state" value={formData.address.state} onChange={handleChange} required placeholder="State" style={{paddingLeft:'15px'}}/>
                </div>
              </div>
            </div>
             <div className="guideray-student-registration-form-row">
              <div className="guideray-student-registration-input-group">
                <label>Postal Code</label>
                <div className="guideray-student-registration-input-field-wrapper">
                  <input type="text" name="address.postalCode" value={formData.address.postalCode} onChange={handleChange} required placeholder="ZIP Code" style={{paddingLeft:'15px'}}/>
                </div>
              </div>
               <div className="guideray-student-registration-input-group">
                <label>Country</label>
                <div className="guideray-student-registration-input-field-wrapper">
                  <input type="text" value="India" disabled style={{paddingLeft:'15px', opacity: 0.7}}/>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="guideray-student-registration-terms-container">
              <label className="guideray-student-registration-terms-label">
                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                <span>I agree to the <a href="#">Terms & Conditions</a></span>
              </label>
            </div>

            <button type="submit" className="guideray-student-registration-action-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : <>Complete Registration <FaCheckCircle /></>}
            </button>
          </form>

           <div className="guideray-student-registration-bottom-link">
              Already have an account? <a href="/student-login">Login here</a>
            </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessPopup && (
        <div className="guideray-student-registration-modal-overlay">
          <div className="guideray-student-registration-modal-content">
            <div className="guideray-student-registration-modal-icon"><FaCheckCircle /></div>
            <h3>Registration Successful!</h3>
            <p>Your request has been sent to the admin. You will be notified via email upon approval.</p>
            <button className="guideray-student-registration-action-btn" onClick={() => setShowSuccessPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRegistration;