import { useState } from 'react';
import genepowerx_logo from './Gene-Power-Logo (2).png';
import { useNavigate } from 'react-router-dom';
import aig_logo from './aig_logo.png'
type NavbarProps = {
    isLoginPage?: boolean;
};

const AIG_Navbar = ({ isLoginPage = false }: NavbarProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    


    return (
        <nav className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white bg-opacity-80 backdrop-blur-lg shadow-lg fixed top-1 left-0 z-50 border-b border-indigo-100">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex justify-between items-center w-full">
                     <div className="flex space-x-2 sm:space-x-3">
                        <img
                            src={aig_logo}
                            alt="AIG Logo"
                            className="h-10 sm:h-12 lg:h-16 transform transition-transform group-hover:scale-105"
                        />
                    </div>
                    <div className="flex space-x-2 sm:space-x-3">
                        
                        <img
                            src={genepowerx_logo}
                            alt="GenePowerX Logo"
                            className="h-10 sm:h-12 lg:h-16 transform transition-transform group-hover:scale-105"
                        />
                    </div>
                   
                </div>

                {/* Desktop Navigation Links (hidden on login page) */}
                    <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                        <a href="https://genepowerx.com/" className="relative px-3 lg:px-4 py-2 text-sm lg:text-base text-indigo-700 font-medium hover:text-indigo-900 transition-colors group">
                            Home
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                        </a>
                        <a href="https://genepowerx.com/" className="relative px-3 lg:px-4 py-2 text-sm lg:text-base text-indigo-700 font-medium hover:text-indigo-900 transition-colors group">
                            About
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                        </a>
                        <a href="https://genepowerx.com/" className="relative px-3 lg:px-4 py-2 text-sm lg:text-base text-indigo-700 font-medium hover:text-indigo-900 transition-colors group">
                            Contact
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                        </a>
                        <a href="https://genepowerx.com/" className="relative px-3 lg:px-4 py-2 text-sm lg:text-base text-indigo-700 font-medium hover:text-indigo-900 transition-colors group">
                            Contact
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                        </a>
                    </div>
                

                {/* Mobile Menu Button (hidden on login page) */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden text-indigo-700 hover:text-indigo-900 transition-colors p-2"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                
            </div>

            {/* Mobile Menu (hidden on login page) */}
           
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div className="px-4 pt-4 pb-6 space-y-3 bg-white bg-opacity-95 backdrop-blur-lg">
                        <a href="https://genepowerx.com/" className="block px-4 py-3 text-indigo-700 font-medium hover:bg-indigo-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Home</a>
                        <a href="https://genepowerx.com/" className="block px-4 py-3 text-indigo-700 font-medium hover:bg-indigo-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>About</a>
                        <a href="https://genepowerx.com/" className="block px-4 py-3 text-indigo-700 font-medium hover:bg-indigo-50 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
                    </div>
                </div>
            
        </nav>
    );
};

export default AIG_Navbar;
