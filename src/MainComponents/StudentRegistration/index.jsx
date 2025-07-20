import { useState } from 'react';
import './index.css';

const StudentRegistration = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    profilePic: null,
    college: '',
    currentYear: 1,
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
  const [successMessage, setSuccessMessage] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePic: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!acceptTerms) {
      alert('Please accept the terms and conditions to proceed with registration');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccessMessage(`Registration successful! Welcome to Guideray ${formData.name}`);
      
      setFormData({
        name: '',
        email: '',
        mobile: '',
        profilePic: null,
        college: '',
        currentYear: 1,
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
      setPreviewImage(null);
      setAcceptTerms(false);
    } catch (error) {
      console.error('Registration error:', error);
      setSuccessMessage('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Guideray offerings data
  const offerings = [
    {
      id: 1,
      title: "Personalized Mentoring",
      description: "1:1 sessions with industry experts to guide your career path",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      title: "Video Courses",
      description: "Comprehensive courses on tech, business, and soft skills",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      title: "MCQ Practice",
      description: "Thousands of practice questions for competitive exams",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 4,
      title: "Coding Practice",
      description: "Hands-on coding problems with instant feedback",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 5,
      title: "Coding Contests",
      description: "Regular competitions to test your skills",
      image: "https://images.unsplash.com/photo-1542626991-cbc4e32524cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 6,
      title: "Mock Tests",
      description: "Simulated exams with detailed analytics",
      image: "https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 7,
      title: "Workshops",
      description: "Interactive sessions on emerging technologies",
      image: "https://images.unsplash.com/photo-1524179091875-bf99a9a9a57a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 8,
      title: "Live Classes",
      description: "Real-time learning with expert instructors",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 9,
      title: "Certifications",
      description: "Industry-recognized credentials to boost your profile",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ];

  return (
    <div className={`student-registration ${darkMode ? 'student-registration-dark-mode' : 'student-registration-light-mode'}`}>
      <div className="student-registration-container">
        <div className="student-registration-layout">
          {/* Left Side - Offerings */}
          <div className="student-registration-offerings">
            <div className="student-registration-offerings-header">
              <img 
                src="https://res.cloudinary.com/dx97khgxd/image/upload/v1747826507/b4r9unmciqqgfiuncwcp.png" 
                alt="Guideray Logo" 
                className="student-registration-offerings-logo"
              />
              <h2 className="student-registration-offerings-title">Why Choose Guideray?</h2>
              <p className="student-registration-offerings-subtitle">
                Comprehensive student guidance platform with everything you need to succeed
              </p>
            </div>
            
            <div className="student-registration-offerings-grid">
              {offerings.map((item) => (
                <div key={item.id} className="student-registration-offering-card">
                  <div className="student-registration-offering-image-container">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="student-registration-offering-image"
                    />
                  </div>
                  <div className="student-registration-offering-content">
                    <h3 className="student-registration-offering-title">{item.title}</h3>
                    <p className="student-registration-offering-description">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Side - Registration Form */}
          <div className="student-registration-card">
            <div className="student-registration-card-gradient">
              <div className="student-registration-card-inner">
                <div className="student-registration-header">
                  <h1 className="student-registration-title">Student Registration</h1>
                  <p className="student-registration-subtitle">
                    Join Guideray and unlock your full potential
                  </p>
                </div>
                
                {successMessage && (
                  <div className={`student-registration-success-message ${darkMode ? 'student-registration-dark' : 'student-registration-light'}`}>
                    {successMessage}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="student-registration-form">
                  {/* Personal Information Section */}
                  <div className="student-registration-form-section">
                    <h2 className="student-registration-section-title">Personal Information</h2>
                    
                    <div className="student-registration-form-group">
                      <label className="student-registration-form-label">
                        Full Name <span className="student-registration-required">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="student-registration-form-input"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="student-registration-form-group">
                      <label className="student-registration-form-label">
                        Email <span className="student-registration-required">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="student-registration-form-input"
                        placeholder="Enter your email address"
                      />
                    </div>
                    
                    <div className="student-registration-form-group">
                      <label className="student-registration-form-label">
                        Mobile Number <span className="student-registration-required">*</span>
                      </label>
                      <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{10}"
                        className="student-registration-form-input"
                        placeholder="Enter your 10-digit mobile number"
                      />
                    </div>
                    
                    <div className="student-registration-form-group">
                      <label className="student-registration-form-label">
                        Date of Birth <span className="student-registration-required">*</span>
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className="student-registration-form-input"
                      />
                    </div>
                    
                    <div className="student-registration-form-group">
                      <label className="student-registration-form-label">
                        Gender <span className="student-registration-required">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="student-registration-form-input"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div className="student-registration-form-group">
                      <label className="student-registration-form-label">
                        Profile Picture
                      </label>
                      <div className="student-registration-file-upload-container">
                        <div className="student-registration-avatar-preview">
                          {previewImage ? (
                            <img 
                              src={previewImage} 
                              alt="Profile preview" 
                              className="student-registration-avatar-image"
                            />
                          ) : (
                            <div className="student-registration-avatar-placeholder">
                              <svg className="student-registration-avatar-icon" viewBox="0 0 24 24">
                                <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <label className="student-registration-upload-btn">
                          Choose Photo
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFileChange} 
                            className="student-registration-file-input" 
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Academic Information Section */}
                  <div className="student-registration-form-section">
                    <h2 className="student-registration-section-title">Academic Information</h2>
                    
                    <div className="student-registration-form-group">
                      <label className="student-registration-form-label">
                        College/University <span className="student-registration-required">*</span>
                      </label>
                      <input
                        type="text"
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        required
                        className="student-registration-form-input"
                        placeholder="Enter your college/university name"
                      />
                    </div>
                    
                    <div className="student-registration-form-group">
                      <label className="student-registration-form-label">
                        Current Year <span className="student-registration-required">*</span>
                      </label>
                      <select
                        name="currentYear"
                        value={formData.currentYear}
                        onChange={handleChange}
                        required
                        className="student-registration-form-input"
                      >
                        <option value={1}>1st Year</option>
                        <option value={2}>2nd Year</option>
                        <option value={3}>3rd Year</option>
                        <option value={4}>4th Year</option>
                        <option value={5}>5th Year</option>
                      </select>
                    </div>
                    
                    <div className="student-registration-form-group">
                      <label className="student-registration-form-label">
                        Department <span className="student-registration-required">*</span>
                      </label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        className="student-registration-form-input"
                        placeholder="Enter your department"
                      />
                    </div>
                    
                    <div className="student-registration-form-group">
                      <label className="student-registration-form-label">
                        Branch/Specialization <span className="student-registration-required">*</span>
                      </label>
                      <input
                        type="text"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        required
                        className="student-registration-form-input"
                        placeholder="Enter your branch/specialization"
                      />
                    </div>
                  </div>
                  
                  {/* Address Information Section */}
                  <div className="student-registration-form-section">
                    <h2 className="student-registration-section-title">Address Information</h2>
                    
                    <div className="student-registration-form-group">
                      <label className="student-registration-form-label">
                        Street Address <span className="student-registration-required">*</span>
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        required
                        className="student-registration-form-input"
                        placeholder="Enter your street address"
                      />
                    </div>
                    
                    <div className="student-registration-form-group">
                      <label className="student-registration-form-label">
                        City <span className="student-registration-required">*</span>
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        required
                        className="student-registration-form-input"
                        placeholder="Enter your city"
                      />
                    </div>
                    
                    <div className="student-registration-form-group">
                      <label className="student-registration-form-label">
                        State <span className="student-registration-required">*</span>
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        required
                        className="student-registration-form-input"
                        placeholder="Enter your state"
                      />
                    </div>
                    
                    <div className="student-registration-form-group">
                      <label className="student-registration-form-label">
                        Postal Code <span className="student-registration-required">*</span>
                      </label>
                      <input
                        type="text"
                        name="address.postalCode"
                        value={formData.address.postalCode}
                        onChange={handleChange}
                        required
                        className="student-registration-form-input"
                        placeholder="Enter your postal code"
                      />
                    </div>
                    
                    <div className="student-registration-form-group">
                      <label className="student-registration-form-label">
                        Country
                      </label>
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        className="student-registration-form-input"
                        disabled
                      />
                    </div>
                  </div>
                  
                  {/* Terms and Conditions */}
                  <div className="student-registration-terms-container">
                    <label className="student-registration-terms-label">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                        className="student-registration-terms-checkbox"
                      />
                      <span>I agree to the <a href="#" className="student-registration-terms-link">Terms and Conditions</a> and <a href="#" className="student-registration-terms-link">Privacy Policy</a></span>
                    </label>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="student-registration-submit-container">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`student-registration-submit-btn ${isSubmitting ? 'student-registration-disabled' : ''}`}
                    >
                      {isSubmitting ? (
                        <span className="student-registration-submit-loading">
                          <svg className="student-registration-spinner" viewBox="0 0 24 24">
                            <circle className="student-registration-spinner-circle" cx="12" cy="12" r="10" />
                            <path className="student-registration-spinner-path" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </span>
                      ) : 'Complete Registration'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;