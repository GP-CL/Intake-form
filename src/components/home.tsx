import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ClipboardList, ArrowRight, Dna } from 'lucide-react';
import Navbar from './navbar';
export default function Dashboard() {
  const navigate = useNavigate();

  const cards = [
    {
      id: 1,
      title: 'GenepoweRx Total Intake Form',
      description: 'Complete patient intake form with comprehensive medical history, lifestyle assessment, and genetic testing requirements',
      icon: ClipboardList,
      path: '/total_intake',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      hoverColor: 'hover:shadow-blue-200'
  
    },
    {
      id: 2,
      title: 'GenepoweRx PGx Intake Form',
      description: 'Pharmacogenomics Intake form for precision medicine testing with current medications and informed consent documentation',
      icon: Dna,
      path: '/pgx_intake',
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      hoverColor: 'hover:shadow-purple-200'
    },
    {
      id: 3,
      title:"AIG Totals Intake Form",
      description: "AI-Generated Total Intake form for patients using advanced algorithms to streamline data collection and enhance accuracy",
      icon: ClipboardList,
      path:'/total_intake_aig',
      color: 'from-green-500 to-teal-600',
      bgColor: 'bg-green-50',
      hoverColor: 'hover:shadow-green-200'
    },
    {
      id: 4,
      title:"AIG PGx Intake Form",
      description: "AI-Generated PGx Intake form utilizing artificial intelligence to optimize pharmacogenomics data gathering and patient insights",
      icon: Dna,
      path:'/aig_pgx_intake',
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-50',  
      hoverColor: 'hover:shadow-yellow-200'
      
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6 mt-9">
            <FileText className="w-12 h-12 text-indigo-600 mr-6" />
            <h1 className="text-4xl font-bold text-gray-900">
              GenepowerRx Portal
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the appropriate intake form to begin the patient registration process
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => navigate(card.path)}
                className={`${card.bgColor} rounded-2xl shadow-lg ${card.hoverColor} hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group`}
              >
                {/* Gradient Header */}
                <div className={`bg-gradient-to-r ${card.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 opacity-10 transform translate-x-8 -translate-y-8">
                    <Icon className="w-48 h-48" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center mb-3">
                      <div className="p-3 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                        <Icon className="w-8 h-8" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
                    <p className="text-white text-opacity-90 text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  {/* <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Key Features
                  </h3> */}
                 

                  {/* Action Button */}
                  <button
                    className={`w-full bg-gradient-to-r ${card.color} text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300`}
                  >
                    <span>Start Form</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Bottom Accent */}
                <div className={`h-1 bg-gradient-to-r ${card.color}`}></div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need Help Choosing?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                <strong>Total Intake Form:</strong> Use this for new patients requiring comprehensive genetic testing and complete medical evaluation.
              </p>
              <p className="text-gray-600 text-sm leading-relaxed mt-2">
                <strong>PGx Intake Form:</strong> Use this for patients specifically undergoing pharmacogenomics testing to optimize medication therapy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}