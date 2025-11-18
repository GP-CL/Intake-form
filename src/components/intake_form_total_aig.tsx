import React, { useState } from 'react';
import { User, Phone, Mail, MessageSquare, Calendar, Users, CheckCircle, Loader2, ChevronLeft, ChevronRight, FileText, Heart, TestTube } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import AIG_Navbar from './navbar_aig';
export type Patient = {
    // Page 1 - Basic Info
    full_name: string;
    gender: string;
    phone_number: string;
    email: string;
    date_of_sample_collection: string;
    referral_doctor: string;
    pre_counselor: string;
    address: string;
    //new col
    date_of_birth?: string;
    sample_coordinator?: string;

    notes: string;
    username?: string;

    // Page 2 - Current Complaints
    complaints: Array<{
        complaint: string;
        onset: string;
        duration: string;
    }>;
    genetic_testing_reasons: string[];

    // Page 3 - Medical History
    past_medical_history: string[];
    past_surgical_history: string[];

    // Page 4 - Family History
    family_history: Array<{
        condition: string;
        has_condition: boolean;
        family_members: string[];
        cancer_types?: { [key: string]: string }; // patient ("Patient") and/or Father/Mother/Sibling/Other
    }>;
    //   consanguineous_marriage: boolean;

    //page 5- Mental Health History
    mental_health_history: { [key: string]: string };
    menstrual_cycles: string;
    infertility_history: string;
    erectile_dysfunction: string;

    //page 6: Current and past medications , review o systems
    medicines: Array<{
        Name: string,
        Dose: string;
        Frequency: string;
    }>;
    notes_medicines: string;
    review_of_systems: { [system: string]: string[] };
    expandedSystems: { [key: string]: boolean };


    alcohol: string;
    alchohol_frequency?: string;
    smoking: string;
    smoking_frequency?: string;
    wake_up_time: string;
    bed_time: string;
    workout: string;
    workout_frequency: string;
    active_sport_young: string;
    sleep: string;
    preferred_workout: string;

    meals_per_day: string;
    processed_foods: string;
    outside_food: string;
    carbonated_drinks: string;
    type_of_food: string;
    cuisine_preference: string[];
    other_cuisine_preference: string;

    //Physical Examination
    blood_pressure: string;
    pulse_rate: string;
    height: string;
    weight: string;
    BMI: string;

    //blood_work
    mandatory_tests: string[];


};

const PatientIntakeFormAIG: React.FC = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [formData, setFormData] = useState<Patient>({
        // Page 1 - Basic Info
        full_name: '',
        gender: '',
        phone_number: '',
        email: '',
        date_of_sample_collection: '',
        referral_doctor: '',
        pre_counselor: '',
        address: '',
        username: '',
        notes: '',
        date_of_birth: '',
        sample_coordinator: '',

        // Page 1 - Test Names
        // test_names: [],
        // other_test: '',
        // indications_for_testing: '',
        // specific_genes: '',
        // sample_types: [],
        // other_sample: '',

        // Page 2 - Current Complaints
        complaints: [
            { complaint: '', onset: '', duration: '' }
        ],
        genetic_testing_reasons: [],

        // Page 3 - Medical History
        past_medical_history: [],
        past_surgical_history: [],

        // Page 4 - Family History
        family_history: [],
        // consanguineous_marriage: false,

        // Page 5 - Mental Health History
        mental_health_history: {},
        menstrual_cycles: '',
        infertility_history: '',
        erectile_dysfunction: '',

        //page 6 - Medications and systems
        medicines: [
            { Name: '', Dose: '', Frequency: '' }
        ],
        notes_medicines: '',
        review_of_systems: {},
        expandedSystems: {},

        //page 7
        alcohol: '',
        alchohol_frequency: '',
        smoking: '',
        smoking_frequency: '',
        wake_up_time: '',
        bed_time: '',
        workout: '',
        workout_frequency: '',
        active_sport_young: '',
        sleep: '',
        preferred_workout: '',
        meals_per_day: '',
        processed_foods: '',
        outside_food: '',
        carbonated_drinks: '',
        type_of_food: '',
        cuisine_preference: [],
        other_cuisine_preference: '',

        // Page 7
        blood_pressure: '',
        pulse_rate: '',
        height: '',
        weight: '',
        BMI: '',

        mandatory_tests: []

    });
    const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
        personalHealth: false,
        diet: false
    });


    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [signature, setSignature] = useState('');
    const reviewOfSystems = {
        'Constitutional': [
            'Lack of Energy',
            'Unexplained Weight',
            'Loss/Gain',
            'Loss of Apetite',
            'Fevers',
            'Night Sweats'
        ],
        'ENT': [
            'Sinus Problems',
            'Difficulty Hearing',
            'Ringing in Ears'
        ],
        'Respiratory': [
            'Shortness of Breath',
            'Prolonged Cough',
            'Wheezing'
        ],
        'Cardiovascular': [
            'Chest Pain',
            'Heart Racing / Palpitations',
            'Swelling of Legs / Feet',
            'Pain in Calf while walking'
        ],
        'Gastrointestinal': [
            'Heartburn',
            'Constipation',
            'Intolerance to Certain Food',
            'Diarrhea / Loose Stools',
            'Difficulty in swallowing'
        ],
        'GU': [
            'Pain on Urination',
            'Frequent Urination',
            'Prostate Problems',
            'Kidney Stones'
        ],
        'Musculoskeletal': [
            'Back Pain',
            'Joint Pain',
            'Aching Muscles',
            'Swelling of Joints'
        ],
        'Skin': [
            'Itching',
            'Persistent Rash',
            'New Skin Lesions',
            'Hair Loss',
            'Excessive Hair'
        ],
        'Neurologic': [
            'Frequent Headaches',
            'Double Vision',
            'Weakness',
            'Change in Sensation',
            'Dizziness',
            'Tremors',
            'Episodes of Vision Loss'
        ],
        'Endocrine': [
            'Intolerance to Heat or Cold',
            'Frequent Hunger or Thirst',
            'Changes in Sex Drive'
        ],
        'Allergic/Immunologic': [
            'Food Allergies',
            'Seasonal Allergies',
            'Itching Eyes /Sneezing',
            'Frequent Infections'
        ]
    };

    
    const geneticTestingReasons = [
        'I want to know if there is any genetic cause for my Medical Condition.',
        'I want to know if there is any genetic cause for a symptom I have been having since a long time.',
        'My family or close relatives are having history of chronic disease.',
        'There is a history of cancer in me/ history of cancer in the family.',
        'Have a history of genetic disease in the immediate family or close relatives.',
        'I want to know the future risks and possibilities regarding my health.',
        'I want to check if we are carriers for any genetic illness.',
        'I want to know treatment plans based on genetics for our illness.',
        'I have received an abnormal prenatal screening test or Amniocentesis.',
        'I want to do it because my other family members have taken genetic testing.',
        'I want to know my Genetic makeup.'
    ];

    const medicalConditions = [
        'Asthma', 'High Blood Pressure', 'High Cholesterol', 'Diabetes', 'Coronary Artery Disease',
        'Cerebrovascular Accidents/ Stroke', 'Myocardial Infarction/ Heart Attack', 'Hyperthyroidism',
        'Hypothyroidism', 'Kidney Stones', 'Frequent Sinus Infections', 'Peptic Ulcer disease',
        'Inflammatory bowel disease', 'Frequent Constipation', 'Frequent Diarrhea', 'Seizures',
        'Migraines', 'Depression', 'Anemia', 'Cancer', 'Arthritis', 'Psoriasis/Skin Conditions', 'No Medical Conditions', 'Others'
    ];

    const surgicalProcedures = [
        'Appendectomy', 'Tonsillectomy', 'Coronary Artery Bypass Grafting (CABG)', 'Splenectomy',
        'Bariatric Surgery', 'Joint Replacements', 'Cardiac Stent Placements', 'Hysterectomy',
        'Oophorectomy', 'Cholecystectomy', 'No Surgery', 'Others'
    ];

    const familyConditions = [
        'Allergies', 'Asthma', 'Depression/Suicide Attempts', 'Premature Myocardial Infarction',
        'Sudden Death', 'High Blood Pressure', 'Cerebrovascular Accident', 'Diabetes', 'Seizures',
        'Mental Illness', 'Cancer', 'Hearing/Speech Problems', 'Alcohol Abuse', 'Thyroid Disease',
        'Liver Cirrhosis', 'Rheumatoid Arthritis', 'Connective Tissue Diseases'
    ];

    const Mental_History = [
        'Do you face any difficulty concentrating on your work?',
        'Have you lost much sleep/difficulty sleeping?',
        'Do you feel you are not playing a useful part in your work?',
        'Do you feel you are under constant stress?',
        'Do you feel you could not overcome difficulties?',
        'Do you feel unhappy or depressed most days of the week?',
        'Do you feel you are losign confidence?',
        'Do you have any stressors in family or profesisonal like more than ordinary?',
        'Do you consider yourself an anxious person?'

    ]
    interface QuestionOption {
        id: string;
        question: string;
        type: 'radio' | 'text' | 'checkbox';
        options?: string[];
        placeholder?: string;
        hasOtherField?: boolean;
        otherFieldId?: string;
        otherPlaceholder?: string;
    }

    interface ExpandedSections {
        personalHealth: boolean;
        diet: boolean;
    }

    const personalHealthQuestions: QuestionOption[] = [
        {
            id: 'alcohol',
            question: 'Do You Drink Alcohol?',
            type: 'radio',
            options: ['Yes', 'Previous Drinker', 'Never']
        },
        {
            id:"alcohol_frequency",
            question: 'If Yes, How Many Drink Per Week?',
            type: 'radio',
            options: ['1','2','3','More than 3']
        },
        {
            id: 'smoking',
            question: 'Do You Smoke Cigarettes',
            type: 'radio',
            options: ['Yes', 'Previous Smoker', 'Never Smoker']
        },
        {
            id: 'smoking_frequency',
            question: 'If Yes, How Many Packets of cigarettes Per Day?',
            type: 'radio',
            options: ['Less than 1', '1','2', 'More than 2']
        },
        {
            id: 'wake_up_time',
            question: 'What is your wake up time',
            type: 'radio',
            options: ['Before 6 am', 'After 6 am']
        },
        {
            id: 'bed_time',
            question: 'What is your go to bed time',
            type: 'radio',
            options: ['Before 8 pm', 'After 8 pm']
        },
        {
            id: 'workout',
            question: 'Do You Workout',
            type: 'radio',
            options: ['Yes', 'No']
        },
        {
            id: 'workout_frequency',
            question: 'If Yes, How Many Times Per Week?',
            type: 'radio',
            options: ['Less than 4', 'More than 4']
        },
        {
            id: 'active_sport_young',
            question: 'Any participation in active sport when young?',
            type: 'radio',
            options: ['Yes', 'Never']
        },
        {
            id: 'sleep',
            question: 'Sleep',
            type: 'radio',
            options: ['Disturbed', 'Normal']
        },
        {
            id: 'preferred_workout',
            question: 'Preferred Workout',
            type: 'text',
            placeholder: 'Enter preferred workout'
        }
    ];

    const dietQuestions: QuestionOption[] = [
        {
            id: 'meals_per_day',
            question: 'How many meals/day',
            type: 'radio',
            options: ['Less than 3', '3', 'More than 3']
        },
        {
            id: 'processed_foods',
            question: 'How many times do you eat processed foods per week(Chips,Fried Items, Fast food)?',
            type: 'radio',
            options: ['None', '1', '2', 'More Than 2']
        },
        {
            id: 'outside_food',
            question: 'How many times do you eat outside food?',
            type: 'radio',
            options: ['None', '1', '2', 'More Than 2']
        },
        {
            id: 'carbonated_drinks',
            question: 'How many times do you have soft/carbonated drinks per Week?',
            type: 'radio',
            options: ['None', '1', '2', 'More Than 2']
        },
        {
            id: 'type_of_food',
            question: 'Food Preference',
            type: "checkbox",
            options: ['Vegetarian', 'Non-Vegetarian', 'Egg + Vegetarian'],

        },
        {
            id: 'cuisine_preference',
            question: 'Cuisine Preference',
            type: 'checkbox',
            options: ['South Indian', 'North Indian', 'Continental'],
            hasOtherField: true,
            otherFieldId: 'other_cuisine_preference',
            otherPlaceholder: 'Others if any'
        },

    ];

    // Reusable component for rendering table rows
    interface TableRowProps {
        item: {
            id: keyof Patient; // so id must be one of Patient’s keys
            question: string;
            type: 'text' | 'checkbox' | 'radio';
            options?: string[];
            placeholder?: string;
            hasOtherField?: boolean;
            otherFieldId?: keyof Patient;
            otherPlaceholder?: string;
        };
        formData: Patient;
        setFormData: React.Dispatch<React.SetStateAction<Patient>>;
        handleArrayToggle: (key: keyof Patient, value: string) => void;
    }


    const TableRow: React.FC<TableRowProps> = ({ item, formData, setFormData, handleArrayToggle }) => {
        const { id, question, type, options, placeholder, hasOtherField, otherFieldId, otherPlaceholder } = item;

        if (type === 'text') {
            return (
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 font-medium bg-gray-50 border-r border-gray-200" colSpan={1}>{question}</td>
                    <td className="p-3" colSpan={4}>
                        <div className="flex flex-col gap-2">
                            {/* <span className="font-medium">{question}</span> */}
                            <textarea
                                value={formData.notes || ''}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Enter any notes here"
                                className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </td>
                </tr>
            );
        }

        if (type === 'checkbox') {
            const hasOther = hasOtherField && otherFieldId;

            return (
                <>
                    {/* First row with main checkboxes */}
                    <tr>
                        {/* Question cell spanning both rows if "Other" exists */}
                        <td
                            className="p-3 font-medium bg-gray-50 border-r border-gray-200 align-top"
                            rowSpan={hasOther ? 2 : 1}
                        >
                            {question}
                        </td>

                        {/* Main checkbox options */}
                        <td colSpan={3} className="p-3">
                            <div className="flex flex-wrap gap-4">
                                {options?.map((option) => (
                                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className='w-4 h-4'
                                            checked={(formData[id] as string[])?.includes(option) || false}
                                            onChange={() => handleArrayToggle(id, option)}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </td>
                    </tr>

                    {/* Second row for "Other" input */}
                    {hasOther && (
                        <tr>
                            <td colSpan={3} className="p-3">
                                <input
                                    type="text"
                                    value={(formData[otherFieldId] as string) || ''}
                                    onChange={(e) =>
                                        setFormData({ ...formData, [otherFieldId]: e.target.value })
                                    }
                                    placeholder={otherPlaceholder}
                                    className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </td>
                        </tr>
                    )}
                </>
            );
        }


        // Radio buttons — one column per option
        if (type === 'radio') {
            return (
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3 font-medium bg-gray-50 border-r border-gray-200">{question}</td>
                    {options?.map((option) => (
                        <td key={option} className="p-3 border-r border-gray-200">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"

                                    name={id}
                                    value={option}
                                    checked={formData[id] === option}
                                    onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                                    className="w-3 h-3 scale-125 text-blue-600 focus:ring-blue-500"
                                />
                                {option}
                            </label>
                        </td>
                    ))}
                </tr>
            );
        }

        return null;
    };
    const addComplaint = () => {
        setFormData(prev => ({
            ...prev,
            complaints: [...prev.complaints, { complaint: '', onset: '', duration: '' }]
        }));
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const toggleCondition = (system: string, condition: string) => {
        setFormData(prev => {
            const current = prev.review_of_systems[system] || [];

            let updated: string[];
            if (current.includes(condition)) {
                // Remove
                updated = current.filter(c => c !== condition);
            } else {
                // Add
                updated = [...current, condition];
            }

            return {
                ...prev,
                review_of_systems: {
                    ...prev.review_of_systems,
                    [system]: updated
                }
            };
        });
    };


    const handleArrayToggle = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field as keyof Patient] as string[]).includes(value)
                ? (prev[field as keyof Patient] as string[]).filter(item => item !== value)
                : [...(prev[field as keyof Patient] as string[]), value]
        }));
    };

    const handleComplaintChange = (index: number, field: string, value: string) => {
        const updatedComplaints = formData.complaints.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );

        setFormData(prev => ({
            ...prev,
            complaints: updatedComplaints
        }));

    };
   

    const handleFamilyMemberToggle = (condition: string, member: string) => {
        setFormData(prev => {
            const existingIndex = prev.family_history.findIndex(item => item.condition === condition);
            if (existingIndex >= 0) {
                const existing = prev.family_history[existingIndex];
                const updatedMembers = existing.family_members.includes(member)
                    ? existing.family_members.filter(m => m !== member)
                    : [...existing.family_members, member];

                if (updatedMembers.length === 0) {
                    return {
                        ...prev,
                        family_history: prev.family_history.filter((_, i) => i !== existingIndex)
                    };
                } else {
                    return {
                        ...prev,
                        family_history: prev.family_history.map((item, i) =>
                            i === existingIndex ? { ...item, family_members: updatedMembers } : item
                        )
                    };
                }
            } else {
                return {
                    ...prev,
                    family_history: [...prev.family_history, { condition, has_condition: false, family_members: [member], cancer_types: condition === 'Cancer' ? {} : undefined }]
                };
            }
        });
    };

    const isFamilyMemberSelected = (condition: string, member: string) => {
        const item = formData.family_history.find(h => h.condition === condition);
        return item ? item.family_members.includes(member) : false;
    };

    const validateCurrentPage = () => {
        switch (currentPage) {
            case 1:
                // if (!formData.full_name.trim()) return 'Full name is required';
                // if (!formData.age || formData.age <= 0) return 'Please enter a valid age';
                // if (!formData.gender) return 'Please select a gender';
                // if (!formData.phone_number.trim()) return 'Phone number is required';
                // if (!formData.email.trim()) return 'Email is required';
                // if (!/\S+@\S+\.\S+/.test(formData.email)) return 'Please enter a valid email';
                return null;
            case 2:
                return null; // Optional fields
            case 3:
                return null; // Optional fields
            case 4:
                return null; // Optional fields
            case 5:
                return null;
            case 6:
                return null;
            case 7:
                return null;
            case 8:
                return null;
            default:
                return null;
        }
    };

    const nextPage = () => {
        const error = validateCurrentPage();
        if (error) {
            setErrorMessage(error);
            setSubmitStatus('error');
            return;
        }
        setSubmitStatus('idle');
        setCurrentPage(prev => Math.min(prev + 1, 9));
    };

    const prevPage = () => {
        setSubmitStatus('idle');
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };
    const handleSubmit = async () => {
        const error = validateCurrentPage();
        if (error) {
            setErrorMessage(error);
            setSubmitStatus('error');
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const API_BASE_URL = "https://di5esbfx1i.execute-api.ap-south-1.amazonaws.com/api";

            const token = localStorage.getItem('token'); // ✅ get logged-in user token
            const username = localStorage.getItem('username');
            formData.username = username || '';
            const response = await axios.post(    // send formData as the request body and pass headers as the third argument (config)

                `${API_BASE_URL}/submit_form_aig`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Axios throws on non-2xx responses by default, but check status for extra safety
            if (response.status < 200 || response.status >= 300) {
                throw new Error('Failed to submit form');
            }

            setSubmitStatus('success');
        } catch (error) {
            console.error('Error submitting form:', error);
            setErrorMessage('Failed to submit form. Please try again.');
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };



    const handleFamilyConditionToggle = (condition: string) => {
        setFormData(prev => {
            const existingIndex = prev.family_history.findIndex(item => item.condition === condition);
            if (existingIndex >= 0) {
                // Remove the condition entirely if unchecking
                return {
                    ...prev,
                    family_history: prev.family_history.filter((_, i) => i !== existingIndex)
                };
            } else {
                // Add the condition with has_condition = true and empty family_members
                return {
                    ...prev,
                    family_history: [...prev.family_history, {
                        condition,
                        has_condition: true,
                        family_members: [],
                        cancer_types: condition === 'Cancer' ? {} : undefined
                    }]
                };
            }
        });
    };
    const isFamilyConditionSelected = (condition: string) => {
        return formData.family_history.some(h => h.condition === condition);
    };
    const handleCancerTypeChange = (target: string, value: string) => {
        setFormData(prev => {
            const idx = prev.family_history.findIndex(item => item.condition === 'Cancer');
            if (idx === -1) {
                // create cancer item if missing
                return {
                    ...prev,
                    family_history: [...prev.family_history, {
                        condition: 'Cancer',
                        has_condition: target === 'Patient',
                        family_members: target !== 'Patient' ? [target] : [],
                        cancer_types: { [target]: value }
                    }]
                };
            }
            return {
                ...prev,
                family_history: prev.family_history.map((item, i) => i === idx ? {
                    ...item,
                    cancer_types: { ...(item.cancer_types || {}), [target]: value }
                } : item)
            };
        });
    };
    const handleMentalHealthChange = (question: string, answer: string) => {
        setFormData(prev => ({
            ...prev,
            mental_health_history: {
                ...prev.mental_health_history,
                [question]: answer
            }
        }));
    };


    const resetForm = () => {
        setCurrentPage(1);
        setSubmitStatus('idle');
        setFormData({
            full_name: '',
            gender: '',
            username: '',
            phone_number: '',
            email: '',
            notes: '',
            date_of_sample_collection: '',
            referral_doctor: '',
            pre_counselor: '',
            date_of_birth: '',
            sample_coordinator: '',
            address: '',
            complaints: [
                { complaint: '', onset: '', duration: '' },
            ],
            genetic_testing_reasons: [],
            past_medical_history: [],
            past_surgical_history: [],
            family_history: [],
            mental_health_history: {},
            menstrual_cycles: '',
            infertility_history: '',
            erectile_dysfunction: '',
            medicines: [
                { Name: '', Dose: '', Frequency: '' }
            ],
            notes_medicines: '',
            review_of_systems: {},
            expandedSystems: {},
            alcohol: '',
            alchohol_frequency: '',
            smoking: '',
            smoking_frequency: '',
            wake_up_time: '',
            bed_time: '',
            workout: '',
            workout_frequency: '',
            active_sport_young: '',
            sleep: '',
            preferred_workout: '',
            meals_per_day: '',
            processed_foods: '',
            outside_food: '',
            carbonated_drinks: '',
            type_of_food: '',
            cuisine_preference: [],
            other_cuisine_preference: '',
            blood_pressure: '',
            pulse_rate: '',
            height: '',
            weight: '',
            BMI: '',
            mandatory_tests: []


        });
    };

    if (submitStatus === 'success') {
        return (
            <div className="max-w-2xl mx-auto p-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
                    <p className="text-gray-600 mb-6">
                        Your patient intake form has been successfully submitted. We'll review your information and contact you shortly.
                    </p>

                    <button
                        onClick={resetForm}
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                    >
                        Submit Another Form
                    </button>
                </div>
            </div>

        );
    }

    const pageIcons = [FileText, MessageSquare, Heart, FileText, Users, TestTube, Heart, FileText, CheckCircle];
    const PageIcon = pageIcons[currentPage - 1];

    return (
        <div className="p-8" >
            <AIG_Navbar />
            {/* Spacer for fixed navbar */}
            <div className="h-20 lg:h-24"></div>
            
            <div className="max-w-7xl mx-auto md:flex md:items-start gap-6">
            {/* Fixed desktop back button */}
            <div className="hidden md:block fixed left-4 top-28 w-28 z-40">
                <button
                    className="w-full flex items-center justify-center gap-1 px-3 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md font-medium transition-colors text-sm"
                    onClick={() => navigate(-1)}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.25" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    Back
                </button>
            </div>
            {/* Mobile back button */}
            <div className="md:hidden mb-4">
                <button
                    className="flex items-center gap-1 px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-md font-medium transition-colors text-sm"
                    onClick={() => navigate(-1)}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.25" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    Back
                </button>
            </div>
            
            <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header with progress */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <PageIcon className="w-8 h-8 mr-3" />
                            <h1 className="text-3xl font-bold">Patient Intake Form - AIG</h1>
                        </div>
                        <div className="text-blue-100">
                            Page {currentPage} of 9
                        </div>
                    </div>
                    <div className="w-full bg-blue-800 rounded-full h-2">
                        <div
                            className="bg-white h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentPage / 9) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="p-8">
                    {submitStatus === 'error' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
                            {errorMessage}
                        </div>
                    )}

                    {/* Page 1: Basic Information & Test Details */}
                    {currentPage === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information & Test Requirements</h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <User className="w-4 h-4 mr-2 text-blue-600" />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.full_name}
                                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Phone className="w-4 h-4 mr-2 text-blue-600" />
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.phone_number}
                                        onChange={(e) => handleInputChange('phone_number', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="(91) 1234567890"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                                        Date of birth *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date_of_birth}
                                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Mail className="w-4 h-4 mr-2 text-blue-600" />
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Users className="w-4 h-4 mr-2 text-blue-600" />
                                        Gender *
                                    </label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => handleInputChange('gender', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                        <option value="Prefer not to say">Prefer not to say</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                                        Date of Sample Collection
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date_of_sample_collection}
                                        onChange={(e) => handleInputChange('date_of_sample_collection', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Address</label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter your address"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Referral Doctor/Hospital</label>
                                    <input
                                        type="text"
                                        value={formData.referral_doctor}
                                        onChange={(e) => handleInputChange('referral_doctor', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Doctor/Hospital name"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Pre-Counselor</label>
                                    <input
                                        type="text"
                                        value={formData.pre_counselor}
                                        onChange={(e) => handleInputChange('pre_counselor', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Counselor name"
                                    />
                                </div>
                               <div>
                                    <label className="text-sm font-medium text-gray-700 mb-2 block">Sample Coordinator</label>
                                    <input
                                        type="text"
                                        value={formData.sample_coordinator}
                                        onChange={(e) => handleInputChange('sample_coordinator', e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Sample coordinator name"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Page 2: Current Complaints & Reasons for Testing */}
                    {currentPage === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Complaints & Reasons for Genetic Testing</h2>

                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">
                                    Current Complaints
                                    <button
                                        type="button"
                                        onClick={addComplaint}
                                        className="bg-green-500 text-white ml-3 px-3 py-1 rounded hover:bg-green-600"
                                    >
                                        + Add
                                    </button>

                                </h3>
                                {formData.complaints.map((complaint, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                                        <h4 className="font-medium text-gray-700 mb-3">Complaint {index + 1}</h4>
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-600 mb-1 block">Complaint</label>
                                                <input
                                                    type="text"
                                                    value={complaint.complaint}
                                                    onChange={(e) => handleComplaintChange(index, 'complaint', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                    placeholder="Describe complaint"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600 mb-1 block">Onset</label>
                                                <input
                                                    type="text"
                                                    value={complaint.onset}
                                                    onChange={(e) => handleComplaintChange(index, 'onset', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                    placeholder="When did it start?"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-600 mb-1 block">Duration</label>
                                                <input
                                                    type="text"
                                                    value={complaint.duration}
                                                    onChange={(e) => handleComplaintChange(index, 'duration', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                                    placeholder="How long?"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Why do you want to do this genetic testing?</h3>
                                <div className="space-y-3">
                                    {geneticTestingReasons.map((reason, index) => (
                                        <label key={index} className="flex items-start">
                                            <input
                                                type="checkbox"
                                                checked={formData.genetic_testing_reasons.includes(reason)}
                                                onChange={() => handleArrayToggle('genetic_testing_reasons', reason)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                                            />
                                            <span className="ml-3 text-sm text-gray-700 leading-relaxed">{reason}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Page 3: Medical History */}
                    {currentPage === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Medical History</h2>

                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Past Medical History</h3>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {medicalConditions.map((condition) => (
                                        <label key={condition} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.past_medical_history.includes(condition)}
                                                onChange={() => handleArrayToggle('past_medical_history', condition)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{condition}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            {/* Show textarea if "Others" is selected or auto-select when typing */}
                            {(formData.past_medical_history.includes("Others") ||
                                formData.past_medical_history.some(item => item.startsWith("Others:"))) && (
                                    <div className="mt-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.past_medical_history.some(item =>
                                                    item === "Others" || item.startsWith("Others:"))}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        past_medical_history: e.target.checked
                                                            ? [...prev.past_medical_history.filter(item => !item.startsWith("Others")), "Others"]
                                                            : prev.past_medical_history.filter(item => !item.startsWith("Others"))
                                                    }));
                                                }}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label className="text-sm font-medium text-gray-600">
                                                Other Medical Conditions
                                            </label>
                                        </div>
                                        <textarea
                                            value={
                                                formData.past_medical_history.find(item =>
                                                    item.startsWith("Others:"))?.split("Others:")[1]?.trim() || ""
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value.trim();
                                                setFormData((prev) => {
                                                    const withoutOthers = prev.past_medical_history.filter(
                                                        (item) => !item.startsWith("Others")
                                                    );

                                                    return {
                                                        ...prev,
                                                        past_medical_history: [
                                                            ...withoutOthers,
                                                            value ? `Others:${value}` : "Others"
                                                        ]
                                                    };
                                                });
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[100px]"
                                            placeholder="Please describe other medical conditions..."
                                        />
                                    </div>
                                )}


                            {/* Past Surgical History */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Past Surgical History</h3>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {surgicalProcedures.map((procedure) => (
                                        <label key={procedure} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.past_surgical_history.includes(procedure)}
                                                onChange={() => handleArrayToggle('past_surgical_history', procedure)}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <span className="ml-2 text-sm text-gray-700">{procedure}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Show textarea if "Others" is selected or auto-select when typing */}
                            {(formData.past_surgical_history.includes("Others") ||
                                formData.past_surgical_history.some(item => item.startsWith("Others:"))) && (
                                    <div className="mt-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.past_surgical_history.some(item =>
                                                    item === "Others" || item.startsWith("Others:"))}
                                                onChange={(e) => {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        past_surgical_history: e.target.checked
                                                            ? [...prev.past_surgical_history.filter(item => !item.startsWith("Others")), "Others"]
                                                            : prev.past_surgical_history.filter(item => !item.startsWith("Others"))
                                                    }));
                                                }}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                            <label className="text-sm font-medium text-gray-600">
                                                Other Surgical Procedures
                                            </label>
                                        </div>
                                        <textarea
                                            value={
                                                formData.past_surgical_history.find(item =>
                                                    item.startsWith("Others:"))?.split("Others:")[1]?.trim() || ""
                                            }
                                            onChange={(e) => {
                                                const value = e.target.value.trim();
                                                setFormData((prev) => {
                                                    const withoutOthers = prev.past_surgical_history.filter(
                                                        (item) => !item.startsWith("Others")
                                                    );

                                                    return {
                                                        ...prev,
                                                        past_surgical_history: [
                                                            ...withoutOthers,
                                                            value ? `Others:${value}` : "Others"
                                                        ]
                                                    };
                                                });
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[100px]"
                                            placeholder="Please describe other surgical procedures..."
                                        />
                                    </div>
                                )}
                        </div>
                    )}
                    {/* Page 4: Family History - UPDATED SECTION */}
                    {currentPage === 4 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Family History</h2>

                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Family Medical History</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-200 rounded-lg">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">
                                                    Condition
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">
                                                    Has Condition
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">
                                                    Father
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">
                                                    Mother
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-r border-gray-200">
                                                    Sibling
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                                                    Other
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {familyConditions.map((condition, index) => {
                                                const hasCondition = isFamilyConditionSelected(condition);
                                                return (
                                                    <tr key={condition} className={`align-top border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                        <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200 font-medium">
                                                            {condition}
                                                        </td>
                                                        <td className="px-4 py-3 text-center border-r border-gray-200">
                                                            <input
                                                                type="checkbox"
                                                                checked={hasCondition}
                                                                onChange={() => handleFamilyConditionToggle(condition)}
                                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            {condition === 'Cancer' && hasCondition && (
                                                                <input
                                                                    type="text"
                                                                    placeholder="Type of cancer"
                                                                    className="mt-2 w-full px-2 py-1 text-xs border rounded"
                                                                    value={formData.family_history.find(f=>f.condition==='Cancer')?.cancer_types?.['Patient'] || ''}
                                                                    onChange={e=>handleCancerTypeChange('Patient', e.target.value)}
                                                                />
                                                            )}
                                                        </td>
                                                        {['Father', 'Mother', 'Sibling', 'Other'].map((member) => (
                                                            <td key={member} className="px-4 py-3 text-center border-r border-gray-200 last:border-r-0">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isFamilyMemberSelected(condition, member)}
                                                                    onChange={() => handleFamilyMemberToggle(condition, member)}
                                                                    disabled={!hasCondition}
                                                                    className={`w-4 h-4 rounded border-gray-300 focus:ring-blue-500 ${hasCondition
                                                                        ? 'text-blue-600'
                                                                        : 'text-gray-300 cursor-not-allowed opacity-50'
                                                                        }`}
                                                                />
                                                                {condition === 'Cancer' && hasCondition && isFamilyMemberSelected('Cancer', member) && (
                                                                    <input
                                                                        type="text"
                                                                        placeholder={`${member} cancer type`}
                                                                        className="mt-2 w-full px-2 py-1 text-xs border rounded"
                                                                        value={formData.family_history.find(f=>f.condition==='Cancer')?.cancer_types?.[member] || ''}
                                                                        onChange={e=>handleCancerTypeChange(member, e.target.value)}
                                                                    />
                                                                )}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                );
                                            })}

                                            {/* Add Other Condition Row */}
                                            <tr className={`border-t ${familyConditions.length % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                                <td className="px-4 py-3 text-sm text-gray-800 border-r border-gray-200 font-medium">
                                                    Other Condition
                                                </td>
                                                <td className="px-4 py-3 text-center border-r border-gray-200">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.family_history.some(item => item.condition.startsWith('Other:'))}
                                                        onChange={() => {
                                                            const hasOtherCondition = formData.family_history.some(item => item.condition.startsWith('Other:'));
                                                            if (hasOtherCondition) {
                                                                // Remove all "Other:" conditions
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    family_history: prev.family_history.filter(item => !item.condition.startsWith('Other:'))
                                                                }));
                                                            } else {
                                                                // Add empty "Other:" condition
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    family_history: [...prev.family_history, {
                                                                        condition: 'Other:',
                                                                        has_condition: true,
                                                                        family_members: []
                                                                    }]
                                                                }));
                                                            }
                                                        }}
                                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </td>
                                                {['Father', 'Mother', 'Sibling', 'Other'].map((member) => (
                                                    <td key={member} className="px-4 py-3 text-center border-r border-gray-200 last:border-r-0">
                                                        <input

                                                            type="checkbox"
                                                            checked={formData.family_history.some(item =>
                                                                item.condition.startsWith('Other:') && item.family_members.includes(member)
                                                            )}
                                                            onChange={() => {
                                                                const otherCondition = formData.family_history.find(item => item.condition.startsWith('Other:'));
                                                                if (otherCondition) {
                                                                    const updatedMembers = otherCondition.family_members.includes(member)
                                                                        ? otherCondition.family_members.filter(m => m !== member)
                                                                        : [...otherCondition.family_members, member];

                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        family_history: prev.family_history.map(item =>
                                                                            item.condition.startsWith('Other:')
                                                                                ? { ...item, family_members: updatedMembers }
                                                                                : item
                                                                        )
                                                                    }));
                                                                }
                                                            }}
                                                            disabled={!formData.family_history.some(item => item.condition.startsWith('Other:'))}
                                                            className={`w-4 h-4 rounded border-gray-300 focus:ring-blue-500 ${formData.family_history.some(item => item.condition.startsWith('Other:'))
                                                                ? 'text-blue-600'
                                                                : 'text-gray-300 cursor-not-allowed opacity-50'
                                                                }`}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Other Condition Text Input */}
                                {formData.family_history.some(item => item.condition.startsWith('Other:')) && (
                                    <div className="mt-4">
                                        <label className="text-sm font-medium text-gray-600 mb-1 block">
                                            Please specify the other condition:
                                        </label>
                                        <input
                                            type="text"
                                            value={
                                                formData.family_history.find(item => item.condition.startsWith('Other:'))?.condition.split(':')[1] || ""
                                            }
                                            onChange={(e) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    family_history: prev.family_history.map(item =>
                                                        item.condition.startsWith('Other:')
                                                            ? { ...item, condition: `Other: ${e.target.value}` }
                                                            : item
                                                    )
                                                }));
                                            }}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Enter the specific condition"
                                        />
                                    </div>
                                )}

                                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-sm text-blue-700">
                                        <strong>Instructions:</strong> First check "Has Condition" if any family member has the condition,
                                        then select which specific family members are affected. For "Other Condition", please specify the condition name.
                                    </p>
                                </div>
                            </div>


                        </div>
                    )}

                    {/* Page 5: Mental Health History */}
                    {currentPage === 5 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mental Health History</h2>

                            <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-4">Mental Health Assessment</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300 rounded-lg">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                                    Question
                                                </th>
                                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-900">
                                                    Yes
                                                </th>
                                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-900">
                                                    Sometimes
                                                </th>
                                                <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-900">
                                                    No
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Mental_History.map((question, index) => (
                                                <tr key={question} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                    <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                                                        {question}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                                        <input
                                                            type="radio"
                                                            name={`mental_health_${index}`}
                                                            checked={formData.mental_health_history[question] === "yes"}
                                                            onChange={() => handleMentalHealthChange(question, "yes")}
                                                            className="w-3 h-3 scale-125 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                                        <input
                                                            type="radio"
                                                            name={`mental_health_${index}`}
                                                            checked={formData.mental_health_history[question] === "sometimes"}
                                                            onChange={() => handleMentalHealthChange(question, "sometimes")}
                                                            className="w-3 h-3 scale-125 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                                        <input
                                                            type="radio"
                                                            name={`mental_health_${index}`}
                                                            checked={formData.mental_health_history[question] === "no"}
                                                            onChange={() => handleMentalHealthChange(question, "no")}
                                                            className="w-3 h-3 scale-125 text-blue-600 focus:ring-blue-500"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sexual History</h2>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-gray-300 rounded-lg">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-900">
                                                Question
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-900">
                                                Option 1
                                            </th>
                                            <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-900">
                                                Option 2
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.gender === "Female" && (
                                            <>
                                                {/* Menstrual Cycles */}
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                                        Menstrual Cycles
                                                    </td>
                                                    {["Regular", "Irregular"].map((option) => (
                                                        <td key={option} className="border border-gray-300 px-4 py-2 text-center">
                                                            <label className="inline-flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="menstrual_cycles"
                                                                    value={option}
                                                                    checked={formData.menstrual_cycles === option}
                                                                    onChange={(e) =>
                                                                        setFormData((prev) => ({ ...prev, menstrual_cycles: e.target.value }))
                                                                    }
                                                                    className="w-3 h-3 scale-125 text-blue-600 focus:ring-blue-500"
                                                                />
                                                                <span className="ml-2">{option}</span>
                                                            </label>
                                                        </td>
                                                    ))}
                                                </tr>

                                                {/* History of Infertility */}
                                                <tr>
                                                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                                        History of Infertility
                                                    </td>
                                                    {["Yes", "No"].map((option) => (
                                                        <td key={option} className="border border-gray-300 px-4 py-2 text-center">
                                                            <label className="inline-flex items-center">
                                                                <input
                                                                    type="radio"
                                                                    name="infertility_history"
                                                                    value={option}
                                                                    checked={formData.infertility_history === option}
                                                                    onChange={(e) =>
                                                                        setFormData((prev) => ({ ...prev, infertility_history: e.target.value }))
                                                                    }
                                                                    className="w-3 h-3 scale-125 text-blue-600 focus:ring-blue-500"
                                                                />
                                                                <span className="ml-2">{option}</span>
                                                            </label>
                                                        </td>
                                                    ))}
                                                </tr>
                                            </>
                                        )}

                                        {formData.gender === "Male" && (
                                            <tr>
                                                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                                    Erectile Dysfunction
                                                </td>
                                                {["Yes", "No"].map((option) => (
                                                    <td key={option} className="border border-gray-300 px-4 py-2 text-center">
                                                        <label className="inline-flex items-center">
                                                            <input
                                                                type="radio"
                                                                name="erectile_dysfunction"
                                                                value={option}
                                                                checked={formData.erectile_dysfunction === option}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({ ...prev, erectile_dysfunction: e.target.value }))
                                                                }
                                                                className="w-3 h-3 scale-125 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <span className="ml-2">{option}</span>
                                                        </label>
                                                    </td>
                                                ))}
                                            </tr>
                                        )}

                                        {
                                            (formData.gender === "Other" || formData.gender === "Prefer not to say") && (
                                                <>
                                                    <tr>
                                                        <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                                            Erectile Dysfunction
                                                        </td>
                                                        {["Yes", "No"].map((option) => (
                                                            <td key={option} className="border border-gray-300 px-4 py-2 text-center">
                                                                <label className="inline-flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name="erectile_dysfunction"
                                                                        value={option}
                                                                        checked={formData.erectile_dysfunction === option}
                                                                        onChange={(e) =>
                                                                            setFormData((prev) => ({ ...prev, erectile_dysfunction: e.target.value }))
                                                                        }
                                                                        className="w-3 h-3 scale-125 text-blue-600 focus:ring-blue-500"
                                                                    />
                                                                    <span className="ml-2">{option}</span>
                                                                </label>
                                                            </td>
                                                        ))}
                                                    </tr>

                                                    <tr>
                                                        <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                                                            History of Infertility
                                                        </td>
                                                        {["Yes", "No"].map((option) => (
                                                            <td key={option} className="border border-gray-300 px-4 py-2 text-center">
                                                                <label className="inline-flex items-center">
                                                                    <input
                                                                        type="radio"
                                                                        name="infertility_history"
                                                                        value={option}
                                                                        checked={formData.infertility_history === option}
                                                                        onChange={(e) =>
                                                                            setFormData((prev) => ({ ...prev, infertility_history: e.target.value }))
                                                                        }
                                                                        className="w-3 h-3 scale-125 text-blue-600 focus:ring-blue-500"
                                                                    />
                                                                    <span className="ml-2">{option}</span>
                                                                </label>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                </>
                                            )
                                        }
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    )}
                    {currentPage === 6 && (
                        <div className="space-y-6">
                            {/* Medications Section */}
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <FileText /> Current & Past Medications
                            </h2>
                            {formData.medicines.map((med, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Medicine Name"
                                        value={med.Name}
                                        onChange={(e) => {
                                            const newMeds = [...formData.medicines];
                                            newMeds[index].Name = e.target.value;
                                            setFormData({ ...formData, medicines: newMeds });
                                        }}
                                        className="border p-2 rounded w-1/3"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Dose"
                                        value={med.Dose}
                                        onChange={(e) => {
                                            const newMeds = [...formData.medicines];
                                            newMeds[index].Dose = e.target.value;
                                            setFormData({ ...formData, medicines: newMeds });
                                        }}
                                        className="border p-2 rounded w-1/3"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Frequency"
                                        value={med.Frequency}
                                        onChange={(e) => {
                                            const newMeds = [...formData.medicines];
                                            newMeds[index].Frequency = e.target.value;
                                            setFormData({ ...formData, medicines: newMeds });
                                        }}
                                        className="border p-2 rounded w-1/3"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setFormData({
                                    ...formData,
                                    medicines: [...formData.medicines, { Name: '', Dose: '', Frequency: '' }]
                                })}
                                className="text-blue-500 underline"
                            >
                                + Add Another Medicine
                            </button>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block mt-4">Other Medications or Supplements</label>
                                <textarea
                                    value={formData.notes_medicines || ''}
                                    onChange={(e) => setFormData({ ...formData, notes_medicines: e.target.value })}
                                    placeholder="Enter any additional notes"
                                    className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Review of Systems Section */}
                            <h2 className="text-xl font-semibold mt-6 flex items-center gap-2">
                                <Heart /> Review of Systems
                            </h2>

                            <div className="grid grid-cols-2 gap-8">
                                {/* Left Column - Constitutional and other systems */}
                                <div>
                                    {Object.entries(reviewOfSystems).slice(0, Math.ceil(Object.keys(reviewOfSystems).length / 2)).map(([category, items]) => (
                                        <div key={category} className="mb-4">
                                            <h3
                                                className="font-medium mb-2 cursor-pointer text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                                onClick={() => {
                                                    const expandedSystems = formData.expandedSystems || {};
                                                    setFormData({
                                                        ...formData,
                                                        expandedSystems: {
                                                            ...expandedSystems,
                                                            [category]: !expandedSystems[category]
                                                        }
                                                    });
                                                }}
                                            >
                                                <span className="text-sm">{formData.expandedSystems?.[category] ? '▼' : '▶'}</span>
                                                {category}
                                            </h3>
                                            {formData.expandedSystems?.[category] && (
                                                <div className="space-y-2 ml-4">
                                                    {items.map((item) => (
                                                        <label key={item} className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                className='w-4 h-4'
                                                                checked={formData.review_of_systems[category]?.includes(item) || false}
                                                                onChange={() => toggleCondition(category, item)}
                                                            />
                                                            <span className="text-sm">{item}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Right Column - Remaining systems */}
                                <div>
                                    {Object.entries(reviewOfSystems).slice(Math.ceil(Object.keys(reviewOfSystems).length / 2)).map(([category, items]) => (
                                        <div key={category} className="mb-4">
                                            <h3
                                                className="font-medium mb-2 cursor-pointer text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                                onClick={() => {
                                                    const expandedSystems = formData.expandedSystems || {};
                                                    setFormData({
                                                        ...formData,
                                                        expandedSystems: {
                                                            ...expandedSystems,
                                                            [category]: !expandedSystems[category]
                                                        }
                                                    });
                                                }}
                                            >
                                                <span className="text-sm">{formData.expandedSystems?.[category] ? '▼' : '▶'}</span>
                                                {category}
                                            </h3>
                                            {formData.expandedSystems?.[category] && (
                                                <div className="space-y-2 ml-4">
                                                    {items.map((item) => (
                                                        <label key={item} className="flex items-center gap-2">
                                                            <input
                                                                type="checkbox"
                                                                className='w-4 h-4'
                                                                checked={formData.review_of_systems[category]?.includes(item) || false}
                                                                onChange={() => toggleCondition(category, item)}

                                                            />
                                                            <span className="text-sm">{item}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {currentPage === 7 && (
                        <div className="space-y-6">
                            {/* Personal History/Health Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div
                                    className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => setExpandedSections(prev => ({ ...prev, personalHealth: !prev.personalHealth }))}
                                >
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <User /> Personal History/Health
                                    </h2>
                                    {expandedSections.personalHealth ?
                                        <ChevronDown className="text-gray-500" size={20} /> :
                                        <ChevronRight className="text-gray-500" size={20} />
                                    }
                                </div>

                                {expandedSections.personalHealth && (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-blue-50 border-b border-gray-200">
                                                <th className="p-3 text-left font-medium text-gray-700 w-1/3">Question</th>
                                                <th className="p-3 text-left font-medium text-gray-700 w-1/4">Option 1</th>
                                                <th className="p-3 text-left font-medium text-gray-700 w-1/4">Option 2</th>
                                                <th className="p-3 text-left font-medium text-gray-700 w-1/4">Option 3</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {personalHealthQuestions.map((question) => (
                                                <TableRow
                                                    key={question.id}
                                                    item={question}
                                                    formData={formData}
                                                    setFormData={setFormData}
                                                    handleArrayToggle={handleArrayToggle}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* Diet Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div
                                    className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => setExpandedSections(prev => ({ ...prev, diet: !prev.diet }))}
                                >
                                    <h2 className="text-xl font-semibold flex items-center gap-2">
                                        <User /> Diet
                                    </h2>
                                    {expandedSections.diet ?
                                        <ChevronDown className="text-gray-500" size={20} /> :
                                        <ChevronRight className="text-gray-500" size={20} />
                                    }
                                </div>

                                {expandedSections.diet && (
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-blue-50 border-b border-gray-200">
                                                <th className="p-3 text-left font-medium text-gray-700 w-1/3">Question</th>
                                                <th className="p-3 text-left font-medium text-gray-700 w-1/4">Option 1</th>
                                                <th className="p-3 text-left font-medium text-gray-700 w-1/4">Option 2</th>
                                                <th className="p-3 text-left font-medium text-gray-700 w-1/4">Option 3</th>
                                                <th className="p-3 text-left font-medium text-gray-700 w-1/4">Option 4</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                            {dietQuestions.map((question) => (
                                                <TableRow
                                                    key={question.id}
                                                    item={question}
                                                    formData={formData}
                                                    setFormData={setFormData}
                                                    handleArrayToggle={handleArrayToggle}
                                                />
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold mb-4">Physical Examination</h2>
                                <table className="w-full border-collapse border border-gray-300">
                                    <tbody>
                                        {[
                                            { label: 'Blood Pressure', id: 'blood_pressure' },
                                            { label: 'Pulse Rate', id: 'pulse_rate' },
                                            { label: 'Height', id: 'height' },
                                            { label: 'Weight', id: 'weight' },
                                            { label: 'BMI', id: 'BMI' },
                                        ].map(({ label, id }) => (
                                            <tr key={id} className="border-b border-gray-200">
                                                <td className="p-3 font-medium bg-gray-50 border-r border-gray-200 w-1/3">{label}:</td>
                                                <td className="p-3">
                                                    <input
                                                        type="text"
                                                        value={formData[id] as string}
                                                        onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                                                        className="border border-gray-300 rounded w-full focus:ring-2 focus:ring-blue-500"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Blood Work */}
                            <div>
                                <h2 className="text-lg font-semibold mb-4">Blood Work</h2>
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="p-3 border border-gray-300">#</th>
                                            <th className="p-3 border border-gray-300">Mandatory Tests</th>
                                            <th className="p-3 border border-gray-300">Select</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            'Complete Blood Count',
                                            'Thyroid Profile',
                                            'HbA1C',
                                            'Liver Function Test',
                                            'Kidney Function Test',
                                            'Lipid Profile',
                                        ].map((test, index) => (
                                            <tr key={test} className="border-b border-gray-200">
                                                <td className="p-3 border border-gray-300 text-center">{index + 1}</td>
                                                <td className="p-3 border border-gray-300">{test}</td>
                                                <td className="p-2 border border-gray-300 text-center">
                                                    <input
                                                        type="checkbox"
                                                        className='w-4 h-4'
                                                        checked={(formData.mandatory_tests || []).includes(test)}
                                                        onChange={() => {
                                                            const currentTests = [...formData.mandatory_tests];
                                                            if (currentTests.includes(test)) {
                                                                setFormData({
                                                                    ...formData,
                                                                    mandatory_tests: currentTests.filter((t) => t !== test),
                                                                });
                                                            } else {
                                                                setFormData({
                                                                    ...formData,
                                                                    mandatory_tests: [...currentTests, test],
                                                                });
                                                            }
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {currentPage === 8 && (
                        <div className="space-y-6">
                            
                            <div className="notes">
                                <label htmlFor="">Notes: </label>
                                <textarea
                                    value={formData.notes || ''}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Enter any additional notes"
                                    className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {currentPage === 9 && (
                        <div className="space-y-6">
                            {/* Consent Terms */}
                            <div className="mb-8 space-y-4 text-sm text-gray-700 leading-relaxed">
                                <p className="font-medium text-gray-800">
                                    I, <span className="font-semibold text-indigo-600">{formData.full_name || '_____________'}</span> (Patient's name) born on <span className="font-semibold text-indigo-600">{formData.date_of_birth || '___'}</span>, hereby give my consent to GenepowerRx Personalized Medicine Clinic Private Limited ("Clinic") to conduct genomics tests and analysis ("Services/Test") as recommended by my healthcare provider.
                                </p>

                                <div className="space-y-3 pl-4">
                                  <p><strong>1.</strong> The medical practitioner/ physician has fully and clearly explained the outcomes, benefits and limitations of the whole exome sequencing. I hereby agree that I have had an opportunity to discuss and clarify the risks and other concerns with the medical practitioner. I hereby give my free consent to the Clinic to conduct the Test on the sample provided by me.</p>
                                  <p><strong>2.</strong> I shall provide accurate medical and personal information about my age, medical history, health concerns, symptoms, dietary habits, allergies, medications, lifestyle habits, family history and/or any other details /questions that enables the Clinic to conduct and interpret the results of the tests effectively. I, therefore, confirm and declare that all the information and materials provided by me are true, accurate and complete to the best of my knowledge.</p>
                                  <p><strong>3.</strong> I, shall not hold the Clinic responsible or liable for the interpretation or analysis of the tests conducted by the Clinic solely based on the medical information provided by me.</p>
                                  <p><strong>4.</strong> I understand that though genomics testing provides generally accurate results, several sources of errors are possible including but not limited to the possibility of a failure or error in sample analysis, as with the case of any genomics tests. I understand that genomics tests are relatively new and are being improved and expanded continuously. Hence, due to current limitations in technology and incomplete knowledge and information on genes and diseases, there is a possibility that the test results may be inconclusive, uninterpretable or of unknown significance which may require further testing.</p>
                                  <p><strong>5.</strong> I hereby understand that the results/outcome of the tests conducted by the Clinic is indicative and cannot be perceived as conclusive or guaranteed. I also understand that the Test reports may provide information not anticipated and unrelated to my reported clinical symptoms, but can be of medical value for patient care. I understand that the results of my tests are not be read in isolation and further clinical correlation may be required.</p>
                                  <p><strong>6.</strong> I understand that the Clinic is not a specimen banking facility and therefore the blood sample shall be discarded after 2(two) months and shall not be available for future clinical tests. However, the DNA will be stored at both AIG and GenepoweRx for further analysis if needed.</p>
                                  <p><strong>7.</strong> I understand that the report and any record of my personal data including but not limited to my name, age, address, symptoms, descriptions, Test reports etc. in the possession of the Clinic is in safe custody and in an encrypted form and I hereby provide my consent to the Clinic to store my personal data and information for medical research purpose.</p>
                                  <p><strong>8.</strong> I further consent and authorize to the collection, processing, use, storage and retention of the anonymized data, the sample collected and related anonymized reports from the tests conducted for ongoing test developments, educational, scientific research and/or other related activities. I understand that analytics will be done only for this study with this particular sample. I understand that the Clinic has taken the appropriate measures to maintain confidentiality. I hereby understand that this is purely for the purpose mentioned hereinbefore and my identity shall not be revealed in any manner whatsoever.</p>
                                  <p><strong>9.</strong> I understand that I have to visit the hospital thrice over a period of six months starting from the enrollment in the study as instructed by the physicians.</p>
                                  <p><strong>10.</strong> I understand that the clinic shall not disclose or hand-over the results of the tests to anyone else other than me, unless until required by law or expressly authorized by me.</p>
                                  <p><strong>11.</strong> I herein agree that a copy of this consent form is retained by me for any future use that may arise.</p>
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
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-8 border-t border-gray-200">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${currentPage === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </button>

                        <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((page) => (
                                <div
                                    key={page}
                                    className={`w-3 h-3 rounded-full ${page === currentPage ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>

                        {currentPage < 9 ? (
                            <button
                                onClick={nextPage}
                                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                Next
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Form'
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            </div>
            </div>
        </div >
    );
};

export default PatientIntakeFormAIG;