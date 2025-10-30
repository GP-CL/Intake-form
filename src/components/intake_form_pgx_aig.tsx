import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, FileText, Search } from 'lucide-react';
import AIG_Navbar from './navbar_aig';
import axios from 'axios';

const API_BASE_URL = "https://di5esbfx1i.execute-api.ap-south-1.amazonaws.com/api";

// Types
interface Medication {
  id: number;
  name: string;
  dose: string;
  frequency: string;
}

interface FormData {
  patient_name: string;
  date: string;
  date_of_birth: string;
  gender: string;
  guardian_name: string;
  age: string;
  allergies: string;
  username: string;
  phone_number: string;
  email: string;
  address: string;
}

interface MedicationSuggestion {
  Brand: string;
  Generic: string;
}

interface SearchCache {
  [key: string]: MedicationSuggestion[];
}

// Smart caching to avoid repeated API calls
const searchCache: SearchCache = {};

// Store brand-to-generic mapping in localStorage
const saveBrandGenericMapping = (brand: string, generic: string) => {
  try {
    const existingMapping = localStorage.getItem('brandGenericMapping');
    const mapping = existingMapping ? JSON.parse(existingMapping) : {};
    mapping[brand] = generic;
    localStorage.setItem('brandGenericMapping', JSON.stringify(mapping));
  } catch (error) {
    console.error('Error saving brand-generic mapping:', error);
  }
};

// Get generic name from localStorage
const getGenericFromBrand = (brand: string): string | null => {
  try {
    const existingMapping = localStorage.getItem('brandGenericMapping');
    if (existingMapping) {
      const mapping = JSON.parse(existingMapping);
      return mapping[brand] || null;
    }
  } catch (error) {
    console.error('Error reading brand-generic mapping:', error);
  }
  return null;
};

// Medication Input with Debounced Search + Caching
interface MedicationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

function MedicationAutocomplete({ value, onChange, placeholder }: MedicationAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<MedicationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions from API with caching
  const fetchSuggestions = async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    const normalizedQuery = query.toLowerCase().trim();

    // Check cache first
    if (searchCache[normalizedQuery]) {
      setSuggestions(searchCache[normalizedQuery]);
      return;
    }

    // Cancel previous request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${API_BASE_URL}/search_medications/${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          signal: abortControllerRef.current.signal,
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const meds: MedicationSuggestion[] = data.medications || [];
        
        // Save brand-generic mappings to localStorage
        meds.forEach(med => {
          if (med.Brand && med.Generic) {
            saveBrandGenericMapping(med.Brand, med.Generic);
          }
        });
        
        // Cache the results
        searchCache[normalizedQuery] = meds;
        setSuggestions(meds);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching medication suggestions:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Debounced search - waits 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(value);
    }, 500);

    return () => clearTimeout(timer);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: MedicationSuggestion) => {
    onChange(suggestion.Brand);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length >= 3 && setShowSuggestions(true)}
          className="w-full px-2 py-1 pr-8 border-0 focus:ring-2 focus:ring-indigo-500 rounded"
          placeholder={placeholder}
        />
        {loading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Search className="w-4 h-4 text-indigo-500 animate-spin" />
          </div>
        )}
      </div>
      
      {showSuggestions && value.length >= 3 && suggestions.length > 0 && (
        <div className="absolute z-50 w-full bottom-full mb-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-2 hover:bg-indigo-50 cursor-pointer border-b border-gray-100 last:border-b-0 text-left"
            >
              <div className="font-semibold text-gray-900">{suggestion.Brand}</div>
              {suggestion.Generic && (
                <div className="text-xs text-gray-600 mt-0.5">Generic: {suggestion.Generic}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AIGPGxIntakeForm() {
  const [formData, setFormData] = useState<FormData>({
    patient_name: '',
    date: new Date().toISOString().split('T')[0],
    date_of_birth: '',
    gender: '',
    guardian_name: '',
    age: '',
    allergies: 'None',
    username: '',
    phone_number: '',
    email: '',
    address: ''
  });

  const [medications, setMedications] = useState<Medication[]>([
    { id: 1, name: '', dose: '', frequency: '' }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [signature, setSignature] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addMedication = () => {
    const newId = medications.length > 0 ? Math.max(...medications.map(m => m.id)) + 1 : 1;
    setMedications([...medications, { id: newId, name: '', dose: '', frequency: '' }]);
  };

  const removeMedication = (id: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const updateMedication = (id: number, field: keyof Medication, value: string | number) => {
    setMedications(medications.map(med =>
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const handleSubmit = async () => {
    if (!signature) {
      alert('Please provide your signature before submitting');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      const updatedFormData = { ...formData, username: username || '' };

      const response = await axios.post(
        `${API_BASE_URL}/submit_aig_pgx_consent`,
        { updatedFormData, medications, signature },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        alert('Consent form submitted successfully!');
      } else {
        throw new Error(`Submission failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting consent:', error);
      alert('Failed to submit consent form. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 mt-12 p-4 md:p-8">
      <AIG_Navbar />
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-xl shadow-lg p-6 border-b-2 border-indigo-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-800">AIG-GenepowerRx PGx TEST</h1>
            </div>
            <div className="text-sm text-gray-500">
              Page {currentPage} of 2
            </div>
          </div>
          <p className="text-gray-600 text-sm">AI-assisted Indian Genomics data analysis for Precision-medicine</p>
        </div>

        {/* Form Content */}
        <div className="bg-white shadow-lg p-8">
          {currentPage === 1 ? (
            <>
              {/* Patient Information */}
              <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      name="patient_name"
                      value={formData.patient_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Mr./Ms./Mrs."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Guardian Name (if minor)
                    </label>
                    <input
                      type="text"
                      name="guardian_name"
                      value={formData.guardian_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Guardian's name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Age in years"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Residential Address *
                    </label>
                    <textarea
                      name="address"
                      rows={3}
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter residential address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Current and Past Medications */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Current and Past Medications
                  </h2>
                  <button
                    type="button"
                    onClick={addMedication}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Medication
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Type at least 3 characters to search from 100,000+ medications
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">#</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Name of the Medicine</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Dose</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Frequency</th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold w-20">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medications.map((med, index) => (
                        <tr key={med.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 text-center font-medium">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <MedicationAutocomplete
                              value={med.name || ''}
                              onChange={(value) => updateMedication(med.id, 'name', value)}
                              placeholder="Type medication name..."
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              value={med.dose || ''}
                              onChange={(e) => updateMedication(med.id, 'dose', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-indigo-500 rounded"
                              placeholder="e.g., 500mg"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <input
                              type="text"
                              value={med.frequency || ''}
                              onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                              className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-indigo-500 rounded"
                              placeholder="e.g., OD, BD"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeMedication(med.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={medications.length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Allergies */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Any allergies to Medications:
                </label>
                <input
                  type="text"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="List any medication allergies"
                />
              </div>
            </>
          ) : (
            <>
              {/* Consent Terms */}
              <div className="mb-8 space-y-4 text-sm text-gray-700 leading-relaxed">
                <p className="font-medium text-gray-800">
                  I, <span className="font-semibold text-indigo-600">{formData.patient_name || '_____________'}</span> (Patient's name) aged <span className="font-semibold text-indigo-600">{formData.age || '___'}</span>, hereby authorize GenepowerRx Personalized Medicine Clinic Private Limited (hereinafter referred to as the "Clinic") to conduct genomics tests and analysis (hereinafter referred to as "Services/Test").
                </p>

                <p>
                  By signing this declaration of consent, I acknowledge that I have read and understood all the terms stated herein below:
                </p>

                <div className="space-y-3 pl-4">
                  <p>
                    <strong>1.</strong> The medical practitioner/physician has fully and clearly explained the outcomes, benefits and limitations of the whole exome sequencing. I hereby agree that I have had an opportunity to discuss and clarify the risks and other concerns with the medical practitioner. I hereby give my free consent to the Clinic to conduct the Test on the sample provided by me.
                  </p>

                  <p>
                    <strong>2.</strong> I shall provide accurate medical and personal information about my age, medical history, health concerns, symptoms, dietary habits, allergies, medications, lifestyle habits, family history and/or any other details/questions that enables the Clinic to conduct and interpret the results of the tests effectively.
                  </p>

                  <p>
                    <strong>3.</strong> I shall not hold the Clinic responsible or liable for the interpretation or analysis of the tests conducted by the Clinic solely based on the medical information provided by me.
                  </p>

                  <p>
                    <strong>4.</strong> I understand that though genomics testing provides generally accurate results, several sources of errors are possible including but not limited to the possibility of a failure or error in sample analysis, as with the case of any genomics tests.
                  </p>

                  <p>
                    <strong>5.</strong> I hereby understand that the results/outcome of the tests conducted by the Clinic is indicative and cannot be perceived as conclusive or guaranteed. I also understand that the Test reports may provide information not anticipated and unrelated to my reported clinical symptoms, but can be of medical value for patient care.
                  </p>

                  <p>
                    <strong>6.</strong> I understand that the Clinic is not a specimen banking facility and therefore the blood sample shall be discarded after 2(two) months and shall not be available for future clinical tests.
                  </p>

                  <p>
                    <strong>7.</strong> I understand that the report and any record of my personal data including but not limited to my name, age, address, symptoms, descriptions, Test reports etc. in the possession of the Clinic is in safe custody and in an encrypted form.
                  </p>

                  <p>
                    <strong>8.</strong> I further consent and authorize to the collection, processing, use, storage and retention of the de-anonymized data, the sample and related anonymized reports from the tests conducted for ongoing test developments, educational, scientific research and/or other related activities.
                  </p>

                  <p>
                    <strong>9.</strong> I understand that I have to visit the hospital thrice over a period of six months starting from the enrollment in the study as instructed by the physicians.
                  </p>

                  <p>
                    <strong>10.</strong> I understand that the clinic shall not disclose or hand-over the results of the tests to anyone else other than me, unless until required by law or expressly authorized by me.
                  </p>

                  <p>
                    <strong>11.</strong> I herein agree that a copy of this consent form is retained by me for any future use that may arise.
                  </p>
                </div>
              </div>

              {/* Signature Section */}
              <div className="border-t-2 border-gray-200 pt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Signature of the Patient / Guardian (in case of a minor) *
                </label>
                <div className="mb-4">
                  <input
                    type="text"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-cursive text-2xl"
                    placeholder="Type your full name as signature"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  By typing your name above, you agree that this constitutes your legal signature
                </p>
              </div>
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="bg-white rounded-b-xl shadow-lg p-6 flex justify-between items-center border-t border-gray-200">
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentPage === 1 ? (
            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Next: Review & Sign
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Submit Consent Form
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
