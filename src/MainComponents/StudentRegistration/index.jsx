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
      
      // Create preview
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
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('mobile', formData.mobile);
      if (formData.profilePic) {
        formDataToSend.append('profilePic', formData.profilePic);
      }
      formDataToSend.append('college', formData.college);
      formDataToSend.append('currentYear', formData.currentYear);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('branch', formData.branch);
      formDataToSend.append('dob', formData.dob);
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('address[street]', formData.address.street);
      formDataToSend.append('address[city]', formData.address.city);
      formDataToSend.append('address[state]', formData.address.state);
      formDataToSend.append('address[postalCode]', formData.address.postalCode);
      formDataToSend.append('address[country]', formData.address.country);

      const response = await fetch('http://localhost:5000/api/students/', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      setSuccessMessage(`Registration successful! Your student ID is ${data.studentId}`);
      
      // Reset form
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

  return (
    <div className={`student-registration ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      <div className="registration-container">
        <div className="registration-card">
          <div className="card-gradient">
            <div className="card-inner">
              <div className="header-section">
                <h1 className="title">Student Registration</h1>
                <p className="subtitle">Join our community and unlock amazing opportunities for your academic journey</p>
              </div>
              
              {successMessage && (
                <div className={`success-message ${darkMode ? 'dark' : 'light'}`}>
                  {successMessage}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="registration-form">
                {/* Personal Information Section */}
                <div className="form-section">
                  <h2 className="section-title">Personal Information</h2>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Full Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Mobile Number <span className="required">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      className="form-input"
                      placeholder="Enter your 10-digit mobile number"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Date of Birth <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Gender <span className="required">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="form-input"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Profile Picture
                    </label>
                    <div className="file-upload-container">
                      <div className="avatar-preview">
                        {previewImage ? (
                          <img 
                            src={previewImage} 
                            alt="Profile preview" 
                            className="avatar-image"
                          />
                        ) : (
                          <div className="avatar-placeholder">
                            <svg className="avatar-icon" viewBox="0 0 24 24">
                              <path d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <label className="upload-btn">
                        Choose Photo
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="file-input" 
                        />
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Academic Information Section */}
                <div className="form-section">
                  <h2 className="section-title">Academic Information</h2>
                  
                  <div className="form-group">
                    <label className="form-label">
                      College/University <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Enter your college/university name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Current Year <span className="required">*</span>
                    </label>
                    <select
                      name="currentYear"
                      value={formData.currentYear}
                      onChange={handleChange}
                      required
                      className="form-input"
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                      <option value={5}>5th Year</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Department <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Enter your department"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Branch/Specialization <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Enter your branch/specialization"
                    />
                  </div>
                </div>
                
                {/* Address Information Section */}
                <div className="form-section">
                  <h2 className="section-title">Address Information</h2>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Street Address <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Enter your street address"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      City <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Enter your city"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      State <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Enter your state"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Postal Code <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="address.postalCode"
                      value={formData.address.postalCode}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Enter your postal code"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">
                      Country
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      className="form-input"
                      disabled
                    />
                  </div>
                </div>
                
                {/* Terms and Conditions */}
                <div className="terms-container">
                  <label className="terms-label">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="terms-checkbox"
                    />
                    <span>I agree to the <a href="#" className="terms-link">Terms and Conditions</a> and <a href="#" className="terms-link">Privacy Policy</a></span>
                  </label>
                </div>
                
                {/* Submit Button */}
                <div className="submit-container">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`submit-btn ${isSubmitting ? 'disabled' : ''}`}
                  >
                    {isSubmitting ? (
                      <span className="submit-loading">
                        <svg className="spinner" viewBox="0 0 24 24">
                          <circle className="spinner-circle" cx="12" cy="12" r="10" />
                          <path className="spinner-path" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
  );
};

export default StudentRegistration;