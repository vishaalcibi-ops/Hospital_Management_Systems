/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * MediCore HMS — Primary CareWell Reference Public Website Landing Page
 * Strictly adheres to the CareWell Hospital Reference Layout, Proportions,
 * Serif Typography, Pale-Blue Daylight Canvas, and 20 Rich Editorial Sections.
 */

import React, { useState, useEffect } from 'react';
import { db } from '../../services/mockDatabase';
import { sound } from '../../services/audioService';
import { Doctor, Patient, PortalKey } from '../../types';
import { BookAppointmentModal } from './BookAppointmentModal';
import { OnlineConsultModal } from './OnlineConsultModal';
import { HomeSampleModal } from './HomeSampleModal';
import { PortalGatewayModal } from './PortalGatewayModal';
import {
  Heart,
  Stethoscope,
  Activity,
  Clock,
  ShieldCheck,
  Calendar,
  Phone,
  Video,
  ArrowRight,
  Search,
  CheckCircle2,
  Building2,
  Award,
  Users,
  MapPin,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Star,
  FileText,
  FlaskConical,
  Pill,
  Ambulance,
  Plane,
  Home as HomeIcon,
  Globe,
  MessageCircle,
  HelpCircle,
  Cpu,
  Eye,
  Shield,
  Layers,
  PhoneCall,
  CreditCard
} from 'lucide-react';

interface CarewellLandingPageProps {
  onOpenPortals: () => void;
  onSelectPortal: (portal: PortalKey) => void;
  onDirectLogin: (category: 'patient' | 'doctor' | 'nurse' | 'admin' | 'super-admin') => void;
  onOpenCommandCenter?: () => void;
  onOpenDigitalTwin?: () => void;
  onOpenAbhaModal?: () => void;
}

export const CarewellLandingPage: React.FC<CarewellLandingPageProps> = ({
  onOpenPortals,
  onSelectPortal,
  onDirectLogin,
  onOpenCommandCenter,
  onOpenDigitalTwin,
  onOpenAbhaModal
}) => {
  // Navigation & UI state
  const [activeSection, setActiveSection] = useState<string>('home');
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState<boolean>(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState<boolean>(false);
  const [isGatewayModalOpen, setIsGatewayModalOpen] = useState<boolean>(false);
  const [selectedDoctorForModal, setSelectedDoctorForModal] = useState<string | undefined>(undefined);
  const [selectedDeptForModal, setSelectedDeptForModal] = useState<string | undefined>(undefined);

  // Doctor search & filter state
  const doctors = db.getDoctors();
  const [doctorSearchTerm, setDoctorSearchTerm] = useState<string>('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>('All');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('All');

  // Contact form state
  const [contactName, setContactName] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactDept, setContactDept] = useState<string>('General Medicine');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);

  // Scroll detection for sticky header elevation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const specialtiesList = [
    { name: 'Cardiology', icon: Heart, doctorsCount: 38, desc: 'Advanced heart catheterization, electrophysiology, and robotic valve repairs.' },
    { name: 'Neurology & Neurosurgery', icon: Activity, doctorsCount: 24, desc: 'Comprehensive stroke center, deep brain stimulation, and neuro-oncology.' },
    { name: 'Orthopaedics & Joint Care', icon: Shield, doctorsCount: 31, desc: 'Mako robotic joint reconstruction, arthroscopy, and spine stabilization.' },
    { name: 'Oncology & Cancer Care', icon: Award, doctorsCount: 29, desc: 'TrueBeam radiotherapy, precision targeted immunotherapy, and marrow transplant.' },
    { name: 'Pediatrics & Neonatology', icon: Users, doctorsCount: 22, desc: 'Level-IV NICU, pediatric cardiology, and congenital anomaly corrections.' },
    { name: 'Gastroenterology', icon: Sparkles, doctorsCount: 19, desc: 'Endoscopic ultrasound, third space endoscopy, and liver transplant sciences.' },
    { name: 'Nephrology & Urology', icon: FlaskConical, doctorsCount: 17, desc: 'Continuous renal replacement, robotic donor nephrectomy, and dialysis unit.' },
    { name: 'Pulmonology & Critical Care', icon: Stethoscope, doctorsCount: 21, desc: 'ECMO support, interventional bronchoscopy, and advanced sleep laboratory.' }
  ];

  const centresOfExcellence = [
    {
      title: 'Institute of Cardiac Sciences',
      headline: 'Over 12,000+ open-heart and robotic cardiac procedures conducted with 99.4% survival rate.',
      features: ['24/7 Primary Angioplasty within 30 min Door-to-Balloon', 'Minimally Invasive Robotic Hybrid Cath Lab', 'Dedicated Heart Failure & Heart Transplant ICU'],
      bg: 'from-blue-900 to-blue-950',
      badge: 'Cardiac Benchmark'
    },
    {
      title: 'Comprehensive Cancer Center',
      headline: 'Organ-specific multidisciplinary tumor boards combining surgical, medical, and precision radiation oncology.',
      features: ['Novalis Tx Radiosurgery System', 'Cellular Immunotherapy & Bone Marrow Unit', 'PET-CT Guided Robotic Cancer Resection'],
      bg: 'from-slate-900 to-indigo-950',
      badge: 'Comprehensive Oncology'
    },
    {
      title: 'Institute of Neurosciences',
      headline: 'NABH-certified Comprehensive Stroke Center with round-the-clock neuro-interventionists.',
      features: ['Intraoperative 3T MRI & Biplane Neuro-Angio Suite', 'Endoscopic Transnasal Skull-Base Surgery', 'Dedicated 20-bed Neuro-Critical Care Unit'],
      bg: 'from-sky-950 to-slate-900',
      badge: 'Stroke Accredited'
    },
    {
      title: 'Robotic Surgery Center of Excellence',
      headline: 'Pioneering precision robotic surgery across Urology, Gynaecology, Thoracic, and Gastrointestinal disciplines.',
      features: ['Dual-Console DaVinci Xi Robotic System', 'Sub-millimeter Surgical Accuracy & Minimal Blood Loss', 'Faster Recovery with 24-48h Inpatient Discharge'],
      bg: 'from-cyan-950 to-blue-950',
      badge: 'Robotic Surgery Suite'
    }
  ];

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch =
      doc.name.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(doctorSearchTerm.toLowerCase()) ||
      doc.department.toLowerCase().includes(doctorSearchTerm.toLowerCase());
    const matchesDept = selectedSpecialtyFilter === 'All' || doc.department.toLowerCase().includes(selectedSpecialtyFilter.toLowerCase());
    return matchesSearch && matchesDept;
  });

  const handleOpenBookModal = (docId?: string, dept?: string) => {
    sound.playClick();
    setSelectedDoctorForModal(docId);
    setSelectedDeptForModal(dept);
    setIsBookModalOpen(true);
  };

  const handleOpenVideoConsult = (docId?: string) => {
    sound.playClick();
    setSelectedDoctorForModal(docId);
    setIsVideoModalOpen(true);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) return;
    sound.playSuccess();
    setContactSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden w-full max-w-full">

      {/* ============================================================
          A. HEADER (Strict CareWell Screenshot Navigation Structure)
          White background · Sticky · Logo left · Nav center · CTA right
          ============================================================ */}
      <header
        className={`sticky top-0 z-40 bg-white transition-all duration-200 ${
          isScrolled ? 'shadow-md border-b border-slate-200/80 py-3' : 'border-b border-slate-100 py-3.5 sm:py-4'
        }`}
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-6 xl:px-8 flex items-center justify-between gap-2 sm:gap-3 xl:gap-4">
          {/* Left Side: Hospital Logo & Brand Identity */}
          <a href="#home" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 2xl:w-11 2xl:h-11 rounded-xl overflow-hidden bg-[#1A2332] text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0 border border-slate-700/30">
              <img
                src="/assets/medicore-logo.png"
                alt="MediCore Logo"
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none rounded-xl" />
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl 2xl:text-2xl font-serif font-black tracking-tight text-[#0F2744]">
                  MEDICORE
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200/60">
                  HOSPITAL
                </span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium hidden 2xl:block">
                Multispeciality Hospital & Research Institute
              </p>
            </div>
          </a>

          {/* Center: Navigation Links (Strict Screenshot Blueprint, dynamic spacing & guaranteed clearance) */}
          <nav className="hidden lg:flex items-center justify-center gap-2 xl:gap-3.5 2xl:gap-5 text-xs xl:text-[13px] 2xl:text-[14px] font-medium text-slate-700 mx-1 xl:mx-3 shrink-0">
            <a
              href="#home"
              onClick={() => setActiveSection('home')}
              className={`hover:text-[#1A56DB] transition relative py-1 whitespace-nowrap ${activeSection === 'home' ? 'text-[#1A56DB] font-semibold' : ''}`}
            >
              Home
              {activeSection === 'home' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1A56DB] rounded-full" />}
            </a>
            <a
              href="#about"
              onClick={() => setActiveSection('about')}
              className={`hover:text-[#1A56DB] transition relative py-1 whitespace-nowrap ${activeSection === 'about' ? 'text-[#1A56DB] font-semibold' : ''}`}
            >
              <span>About</span>
              <span className="hidden 2xl:inline"> Us</span>
            </a>
            <a
              href="#services"
              onClick={() => setActiveSection('services')}
              className={`hover:text-[#1A56DB] transition relative py-1 whitespace-nowrap ${activeSection === 'services' ? 'text-[#1A56DB] font-semibold' : ''}`}
            >
              Services
            </a>
            <a
              href="#specialities"
              onClick={() => setActiveSection('specialities')}
              className={`hover:text-[#1A56DB] transition relative py-1 whitespace-nowrap ${activeSection === 'specialities' ? 'text-[#1A56DB] font-semibold' : ''}`}
            >
              Specialities
            </a>
            <a
              href="#patients"
              onClick={() => setActiveSection('patients')}
              className={`hover:text-[#1A56DB] transition relative py-1 whitespace-nowrap ${activeSection === 'patients' ? 'text-[#1A56DB] font-semibold' : ''}`}
            >
              <span>Patients</span>
              <span className="hidden 2xl:inline"> &amp; Visitors</span>
            </a>
            <a
              href="#doctors"
              onClick={() => setActiveSection('doctors')}
              className={`hover:text-[#1A56DB] transition relative py-1 whitespace-nowrap ${activeSection === 'doctors' ? 'text-[#1A56DB] font-semibold' : ''}`}
            >
              Doctors
            </a>
            <a
              href="#contact"
              onClick={() => setActiveSection('contact')}
              className={`hover:text-[#1A56DB] transition relative py-1 whitespace-nowrap ${activeSection === 'contact' ? 'text-[#1A56DB] font-semibold' : ''}`}
            >
              Contact
            </a>
          </nav>

          {/* Right Side: CTAs & Calendar Icon (Guaranteed clearance, zero overlap, single-line pills) */}
          <div className="flex items-center gap-1.5 sm:gap-2 xl:gap-2.5 shrink-0 flex-nowrap">
            {/* Hospital Portals Button (Crisp single-line pill, never wraps, clean borders) */}
            <button
              onClick={() => { sound.playClick(); setIsGatewayModalOpen(true); }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 2xl:px-3.5 2xl:py-2.5 rounded-full border border-blue-200 hover:border-blue-500 bg-blue-50/70 hover:bg-blue-100 text-[#1A56DB] font-semibold text-xs 2xl:text-[13px] tracking-tight transition whitespace-nowrap flex-nowrap shadow-2xs hover:shadow-xs shrink-0"
              title="Open Hospital Management Portals"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1A56DB] shrink-0" />
              <span className="hidden 2xl:inline">Hospital </span>
              <span className="whitespace-nowrap">Portals</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-200/80 text-blue-900 font-bold hidden 2xl:inline-block">
                20
              </span>
            </button>

            {/* Book Appointment CTA (Strict Carewell Rounded Blue Button with Calendar Icon, strictly single line) */}
            <button
              onClick={() => handleOpenBookModal()}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 xl:px-4 2xl:px-5 py-1.5 sm:py-2 2xl:py-2.5 rounded-full bg-[#1A56DB] hover:bg-[#1546B5] text-white font-semibold text-xs sm:text-xs xl:text-sm tracking-tight shadow-md shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap flex-nowrap shrink-0"
            >
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="whitespace-nowrap">Book Appointment</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition shrink-0 ml-1"
              aria-label="Toggle Navigation Menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileNavOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 shadow-xl animate-fade-in">
            <a
              href="#home"
              onClick={() => setMobileNavOpen(false)}
              className="block text-sm font-semibold text-slate-800 hover:text-blue-600 py-1"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={() => setMobileNavOpen(false)}
              className="block text-sm font-semibold text-slate-800 hover:text-blue-600 py-1"
            >
              About Us
            </a>
            <a
              href="#services"
              onClick={() => setMobileNavOpen(false)}
              className="block text-sm font-semibold text-slate-800 hover:text-blue-600 py-1"
            >
              Services
            </a>
            <a
              href="#specialities"
              onClick={() => setMobileNavOpen(false)}
              className="block text-sm font-semibold text-slate-800 hover:text-blue-600 py-1"
            >
              Specialities
            </a>
            <a
              href="#patients"
              onClick={() => setMobileNavOpen(false)}
              className="block text-sm font-semibold text-slate-800 hover:text-blue-600 py-1"
            >
              Patients & Visitors
            </a>
            <a
              href="#doctors"
              onClick={() => setMobileNavOpen(false)}
              className="block text-sm font-semibold text-slate-800 hover:text-blue-600 py-1"
            >
              Doctors
            </a>
            <a
              href="#contact"
              onClick={() => setMobileNavOpen(false)}
              className="block text-sm font-semibold text-slate-800 hover:text-blue-600 py-1"
            >
              Contact
            </a>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => { setMobileNavOpen(false); setIsGatewayModalOpen(true); }}
                className="w-full py-2.5 rounded-xl border border-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Enter Hospital Portals (20 Roles)</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================
          B. HERO SECTION (STRICT CAREWELL SPLIT-SCREEN BLUEPRINT)
          Left: 48% Width · Tagline · Serif Headline · Subtext · CTAs · 4 Trust Blocks
          Right: 52% Width · Realistic Smiling Doctor in White Coat & Stethoscope
          ============================================================ */}
      <section id="home" className="relative bg-[#EBF3FA] overflow-hidden pt-8 pb-16 lg:pb-24 border-b border-blue-100/60">
        {/* Soft background radial lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* LEFT SIDE — APPROXIMATELY 48% WIDTH (lg:col-span-6 or 5.75) */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8 py-4">
              {/* Small Uppercase Tagline */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/70 border border-blue-200/80 text-[#1A56DB] text-xs font-bold tracking-widest uppercase">
                <span className="w-2 h-2 rounded-full bg-[#1A56DB]" />
                EXPERT CARE. EVERY TIME.
              </div>

              {/* Large Elegant Serif Headline (Exact Screenshot Copy) */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F2744] leading-[1.12]">
                Compassionate Care.<br />
                <span className="text-[#1A56DB]">Better Every Day.</span>
              </h1>

              {/* Supporting Text (Exact Screenshot Copy) */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl font-normal">
                Advanced technology. Expert doctors. Personalized care. Here for you and your family, every step of the way.
              </p>

              {/* CTA Buttons Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => handleOpenBookModal()}
                  className="px-8 py-4 rounded-full bg-[#1A56DB] hover:bg-[#1546B5] text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 group"
                >
                  <span>BOOK AN APPOINTMENT</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>

                <a
                  href="#services"
                  className="px-7 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-sm sm:text-base border border-slate-300 shadow-sm transition"
                >
                  EXPLORE OUR SERVICES
                </a>
              </div>

              {/* FOUR HORIZONTAL TRUST FEATURE BLOCKS (Thin-line medical icons) */}
              <div className="pt-6 border-t border-blue-200/60 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* 1. Patient First */}
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1A56DB] flex items-center justify-center mb-2">
                    <Heart className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F2744] tracking-wide uppercase">PATIENT FIRST</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">Your health and well-being come first.</p>
                </div>

                {/* 2. Expert Team */}
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1A56DB] flex items-center justify-center mb-2">
                    <Stethoscope className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F2744] tracking-wide uppercase">EXPERT TEAM</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">Highly qualified doctors and medical staff.</p>
                </div>

                {/* 3. Advanced Care */}
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1A56DB] flex items-center justify-center mb-2">
                    <Cpu className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F2744] tracking-wide uppercase">ADVANCED CARE</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">State-of-the-art tech and facilities.</p>
                </div>

                {/* 4. 24/7 Support */}
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1A56DB] flex items-center justify-center mb-2">
                    <Clock className="w-4 h-4 stroke-[1.75]" />
                  </div>
                  <h4 className="text-xs font-bold text-[#0F2744] tracking-wide uppercase">24/7 SUPPORT</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">Round-the-clock care when needed.</p>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE — APPROXIMATELY 52% WIDTH (Doctor in White Coat & Stethoscope) */}
            <div className="lg:col-span-6 relative flex items-end justify-center lg:justify-end">
              <div className="relative w-full max-w-lg lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white">
                <img
                  src="/assets/carewell-hero-doctor.jpg"
                  alt="Senior Physician at MediCore Hospital"
                  className="w-full h-[420px] sm:h-[500px] lg:h-[560px] object-cover object-top filter contrast-105"
                  onError={(e) => {
                    // Fallback to verified unsplash photo if local file is missing
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=85';
                  }}
                />

                {/* Subtle soft gradient overlay at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2744]/70 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Overlay Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      NABH
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">Dr. Rachel Miller, MD, DM</h5>
                      <p className="text-[11px] text-slate-500">Chief Clinical Director · Cardiology</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    On Duty Today
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================
          C. FLOATING STATISTICS PANEL (Overlapping the Hero Section)
          4 Statistics Blocks + Thin Dividers + 5th Brand Message Block
          ============================================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-10 sm:-mt-14 z-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 grid grid-cols-2 md:grid-cols-5 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">

          {/* Stat 1: 50,000+ Patients */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1A56DB] flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2744] tracking-tight">50,000+</div>
              <div className="text-xs text-slate-500 font-medium">Patients Treated</div>
            </div>
          </div>

          {/* Stat 2: 250+ Expert Doctors */}
          <div className="flex items-center gap-4 sm:pl-6 pt-4 sm:pt-0">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1A56DB] flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2744] tracking-tight">250+</div>
              <div className="text-xs text-slate-500 font-medium">Expert Doctors</div>
            </div>
          </div>

          {/* Stat 3: 20+ Departments */}
          <div className="flex items-center gap-4 sm:pl-6 pt-4 sm:pt-0">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1A56DB] flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2744] tracking-tight">20+</div>
              <div className="text-xs text-slate-500 font-medium">Super Specialities</div>
            </div>
          </div>

          {/* Stat 4: 15+ Years of Excellence */}
          <div className="flex items-center gap-4 sm:pl-6 pt-4 sm:pt-0">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1A56DB] flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0F2744] tracking-tight">15+</div>
              <div className="text-xs text-slate-500 font-medium">Years of Excellence</div>
            </div>
          </div>

          {/* 5th Block: Brand Message Block with Handwritten Script Typography */}
          <div className="col-span-2 md:col-span-1 sm:pl-6 pt-4 sm:pt-0 flex flex-col justify-center">
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Your health.<br />Our commitment.
            </h5>
            <p className="text-base text-blue-700 font-['Caveat',cursive] font-bold mt-1 tracking-wide">
              Together, for a healthier tomorrow.
            </p>
          </div>

        </div>
      </div>

      {/* ============================================================
          SECTION 1: ABOUT OUR HOSPITAL
          Editorial layout with hospital campus photography & leadership
          ============================================================ */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50">
                <img
                  src="/assets/hospital-exterior.jpg"
                  alt="MediCore Main Medical Campus"
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs font-bold tracking-widest text-blue-600 uppercase">
                ABOUT MEDICORE HEALTHCARE
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2744] leading-tight">
                A Legacy of Clinical Innovation & Deep Patient Compassion
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Founded with a mission to bring world-standard clinical care within accessible reach, MediCore has evolved into a 750-bed tertiary multispeciality healthcare network. With dedicated centres of excellence across cardiovascular sciences, neurosciences, organ transplantation, and precision oncology, our medical institution blends clinical acumen with heartfelt empathy.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="text-lg font-bold text-blue-700">99.4%</h4>
                  <p className="text-xs text-slate-600 font-medium">Surgical Success Rate</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <h4 className="text-lg font-bold text-blue-700">&lt; 30 Mins</h4>
                  <p className="text-xs text-slate-600 font-medium">Door-to-Balloon Time (Cath Lab)</p>
                </div>
              </div>
              <div className="pt-2">
                <a
                  href="#doctors"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800 transition"
                >
                  <span>Meet Our Senior Medical Faculty</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: WHY CHOOSE US
          4 distinct pillar cards with clinical benchmarks
          ============================================================ */}
      <section className="py-20 bg-slate-50/70 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="text-xs font-bold tracking-widest text-blue-600 uppercase">THE MEDICORE ADVANTAGE</div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2744]">
              Why Families Trust MediCore for Critical Care
            </h2>
            <p className="text-sm text-slate-600">
              Every room, surgical suite, and diagnostic lab is built to conform to the highest global patient safety and infection prevention standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">NABH & NABL Accredited</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Stringent compliance with national accreditation bodies ensuring safety, clinical auditing, and credentialed personnel.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Zero-Infection OT Protocol</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Laminar airflow, HEPA filter banks, and positive pressure sterilization in all 14 operating suites to prevent surgical site infections.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">100% Cashless TPA Desk</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pre-authorized cashless coverage with 40+ leading health insurance providers and government health schemes with 30-min approval.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition space-y-3">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Ambulance className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Golden Hour Resuscitation</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated rapid trauma resuscitation team and ICU-on-wheels ambulance fleet on standby 24 hours a day, 365 days a year.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: OUR MEDICAL SPECIALITIES
          Interactive grid with live specialist count and instant consult CTA
          ============================================================ */}
      <section id="specialities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-bold tracking-widest text-blue-600 uppercase">COMPREHENSIVE DEPARTMENTS</div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2744] mt-1">
                Medical & Surgical Specialities
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              From routine clinical evaluations to complex multi-organ transplants, explore our specialized disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialtiesList.map((spec, idx) => {
              const Icon = spec.icon;
              return (
                <div
                  key={idx}
                  className="group bg-slate-50/60 hover:bg-white border border-slate-200/80 hover:border-blue-500 rounded-2xl p-6 transition-all duration-200 shadow-sm hover:shadow-xl flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100/70 text-[#1A56DB] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {spec.name}
                      </h4>
                      <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-1">
                        {spec.doctorsCount} Specialists
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {spec.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                    <button
                      onClick={() => handleOpenBookModal(undefined, spec.name)}
                      className="hover:underline flex items-center gap-1"
                    >
                      <span>Consult Specialist</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: CENTRES OF EXCELLENCE (Fortis & Amrita Inspired)
          High-impact dark navy showcase cards with clinical hallmarks
          ============================================================ */}
      <section id="centres" className="py-20 bg-[#0F2744] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">
              TERTIARY CARE BENCHMARKS
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Centres of Excellence
            </h2>
            <p className="text-sm text-slate-300">
              Interdisciplinary institutes combining state-of-the-art robotic suites, high-throughput diagnostic labs, and internationally recognized medical faculty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {centresOfExcellence.map((centre, i) => (
              <div
                key={i}
                className="bg-slate-900/80 border border-slate-700/80 rounded-3xl p-8 hover:border-sky-500/80 transition-all duration-200 shadow-xl space-y-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-300 bg-sky-950/80 border border-sky-800/80 px-3 py-1 rounded-full uppercase tracking-wider">
                    {centre.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Center #0{i + 1}</span>
                </div>

                <h3 className="font-serif text-2xl font-bold text-white">
                  {centre.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {centre.headline}
                </p>

                <div className="space-y-2.5 pt-2 border-t border-slate-800">
                  {centre.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => handleOpenBookModal()}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                  >
                    <span>Request Institute Consultation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: FIND THE RIGHT DOCTOR (Practo & Max Inspired)
          Live search with filters by Specialty, Symptom, & Instant Availability
          ============================================================ */}
      <section id="doctors" className="py-20 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
              PRACTO & MAX HEALTHCARE-INSPIRED DISCOVERY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2744]">
              Find & Book Verified Specialists
            </h2>
            <p className="text-sm text-slate-600">
              Filter among 250+ certified physicians by specialty, symptoms, rating, and immediate OPD / Telehealth slots.
            </p>
          </div>

          {/* Interactive Search Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-200 max-w-4xl mx-auto mb-10 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative sm:col-span-2">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={doctorSearchTerm}
                  onChange={(e) => setDoctorSearchTerm(e.target.value)}
                  placeholder="Search doctor by name, symptom (e.g. chest pain, knee, allergy)..."
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <select
                  value={selectedSpecialtyFilter}
                  onChange={(e) => setSelectedSpecialtyFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Specialities</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Critical Care">Critical Care & Emergency</option>
                  <option value="Orthopedic">Orthopaedics & Spine</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Pulmonary">Pulmonology</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 6: FEATURED DOCTORS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.slice(0, 6).map(doc => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-base font-bold text-slate-900">{doc.name}</h4>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">
                          ★ {doc.rating}
                        </span>
                      </div>
                      <p className="text-xs text-blue-700 font-semibold">{doc.title}</p>
                      <p className="text-xs text-slate-500">{doc.department}</p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Experience:</span>
                      <span className="font-semibold">{doc.experienceYears} Years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Consultation Fee:</span>
                      <span className="font-semibold text-emerald-700">₹{doc.consultationFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Next Available Slot:</span>
                      <span className="font-semibold text-blue-700">{doc.schedule[0]?.hours || 'Today'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleOpenBookModal(doc.id, doc.department)}
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-sm"
                  >
                    Book Visit
                  </button>
                  <button
                    onClick={() => handleOpenVideoConsult(doc.id)}
                    className="py-2.5 px-3 rounded-xl border border-blue-200 hover:bg-blue-50 text-blue-700 font-semibold text-xs transition flex items-center justify-center gap-1"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video Call</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 7: OUR HOSPITALS AND LOCATIONS
          Interactive campus network showcase
          ============================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">HOSPITAL NETWORK</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2744]">
              Campus Locations & Tertiary Wings
            </h2>
            <p className="text-sm text-slate-600">
              Strategically connected facilities across the metropolis with 24/7 dedicated emergency helipads and trauma bays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
              <div className="h-44 rounded-xl overflow-hidden mb-3">
                <img
                  src="/assets/hospital-exterior.jpg"
                  alt="Flagship Hospital"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full uppercase">
                Downtown Flagship
              </span>
              <h4 className="text-base font-bold text-slate-900">MediCore Central Medical City</h4>
              <p className="text-xs text-slate-600">
                Plot 12, Healthcare Boulevard, Metro District 1. 500 Inpatient Beds, 14 Modular OTs, Level-1 Trauma.
              </p>
              <div className="text-xs font-semibold text-blue-700 pt-2 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> +91 (80) 4000-1100
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
              <div className="h-44 rounded-xl overflow-hidden mb-3">
                <img
                  src="/assets/hospital-care.jpg"
                  alt="North Wing"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full uppercase">
                North Campus
              </span>
              <h4 className="text-base font-bold text-slate-900">MediCore Oncology & Women's Wing</h4>
              <p className="text-xs text-slate-600">
                Greenfield Technology Corridor, North Sector 4. Comprehensive Cancer Institute & Neonatal ICU.
              </p>
              <div className="text-xs font-semibold text-emerald-700 pt-2 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> +91 (80) 4000-2200
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3">
              <div className="h-44 rounded-xl overflow-hidden mb-3">
                <img
                  src="/assets/hospital-corridor.jpg"
                  alt="South Wing"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full uppercase">
                South Specialty Wing
              </span>
              <h4 className="text-base font-bold text-slate-900">MediCore Orthopaedics & Rehab Center</h4>
              <p className="text-xs text-slate-600">
                Outer Ring Road, Silicon Hub Sector 7. Robotic Joint Center & Sports Medicine Rehabilitation.
              </p>
              <div className="text-xs font-semibold text-indigo-700 pt-2 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> +91 (80) 4000-3300
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 8: ADVANCED MEDICAL TECHNOLOGIES
          Cutting-edge robotic, diagnostic & imaging systems
          ============================================================ */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">
              NEXT-GENERATION HEALTHCARE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Advanced Medical Technologies
            </h2>
            <p className="text-sm text-slate-300">
              Investing in precision instrumentation that reduces surgical incisions, accelerates recovery, and achieves unprecedented diagnostic fidelity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-sky-400 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">DaVinci Xi Robotic Surgical System</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Magnified 3D high-definition view with wristed instruments that bend and rotate far greater than the human hand, enabling keyhole precision.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">3 Tesla Wide-Bore Digital MRI</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ultra-high-resolution neurological and musculoskeletal imaging with 70cm wide bore to eliminate claustrophobia and reduce scan time by 40%.
              </p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">AI-Assisted Hybrid Cath Lab</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Real-time angiographic roadmap synchronization with 3D CT reconstructions for complex bifurcated coronary stenting and TAVR valve replacement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 9: PATIENT SERVICES
          Inpatient, Outpatient, Day Care, TPA
          ============================================================ */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">PATIENT CARE JOURNEY</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2744]">
              Patient Services & Hospital Amenities
            </h2>
            <p className="text-sm text-slate-600">
              From seamless digital pre-registration to post-discharge medication doorstep delivery, we ensure comforting patient experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <h4 className="text-base font-bold text-slate-900">Outpatient Department (OPD)</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fast-track digital token system with minimal waiting duration, multidisciplinary consultation suites, and connected pharmacy.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <h4 className="text-base font-bold text-slate-900">Deluxe & Presidential Inpatient Suites</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spacious climate-controlled private patient suites with attendant couches, motorized hospital beds, and clinical dietary room service.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <h4 className="text-base font-bold text-slate-900">Cashless Insurance (TPA) Desk</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Dedicated 24/7 TPA liaison desk coordinating instantaneous pre-authorization and smooth claim settlements with zero hassle.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <h4 className="text-base font-bold text-slate-900">Day Care Surgical Center</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cataract, chemotherapy, endoscopy, and minor laparoscopic surgeries completed with same-day admission and comfortable evening discharge.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <h4 className="text-base font-bold text-slate-900">Second Opinion Clinical Board</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload your prior scans and pathology records to receive a comprehensive multi-doctor peer review within 24 hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <h4 className="text-base font-bold text-slate-900">Dietary & Nutrition Assessment</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Personalized dietary plans curated by certified clinical nutritionists for diabetes, cardiac recovery, renal failure, and oncology.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 10: ONLINE CONSULTATION (Apollo 24/7 & Practo inspired)
          Interactive video consultation feature block
          ============================================================ */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">
                TELEHEALTH ANYTIME, ANYWHERE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
                Connect with Top Doctors via Video in 15 Minutes
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Avoid clinic travel for routine follow-ups. Experience crystal-clear HD video teleconsultations with verified hospital specialists. Includes instant digital prescriptions and medicine doorstep delivery.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Verified doctors from 20+ departments available online</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Valid digital prescription signed with medical registration number</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Free 7-day follow-up chat included with every consultation</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => handleOpenVideoConsult()}
                  className="px-8 py-3.5 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm shadow-xl shadow-blue-500/30 transition flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  <span>Start Instant Video Consultation</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md bg-slate-800/90 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <span className="text-xs text-slate-400 font-semibold">Active Doctor Queue</span>
                  <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    14 Specialists Online
                  </span>
                </div>

                <div className="space-y-3">
                  {doctors.slice(0, 3).map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div className="flex items-center gap-3">
                        <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="text-xs font-bold text-white">{doc.name}</div>
                          <div className="text-[10px] text-slate-400">{doc.department}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenVideoConsult(doc.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold"
                      >
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 11: HEALTH CHECKUP PACKAGES
          Itemized preventive health screening plans
          ============================================================ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">PREVENTIVE HEALTHCARE</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2744]">
              Comprehensive Health Checkup Packages
            </h2>
            <p className="text-sm text-slate-600">
              Early detection saves lives. Customized diagnostic screening packages with senior physician consultations and diet review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Package 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full uppercase">
                  Essential Screen
                </span>
                <h4 className="text-xl font-bold text-slate-900">MediCore Vitality Health Check</h4>
                <div className="text-2xl font-bold text-[#1A56DB]">
                  ₹1,499 <span className="text-xs text-slate-400 font-normal line-through">₹3,200</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Complete Hemogram (CBC + ESR)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Fasting Blood Glucose (FBS)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Lipid Profile (Total Cholesterol, HDL, LDL)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Kidney Profile (Urea & Creatinine)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> General Physician Consultation</li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenBookModal(undefined, 'Preventive Health Checkup')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
              >
                Book Vitality Package
              </button>
            </div>

            {/* Package 2 (Popular) */}
            <div className="bg-white rounded-2xl border-2 border-blue-600 p-6 shadow-xl relative space-y-4 flex flex-col justify-between">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-blue-600 px-3 py-1 rounded-full uppercase tracking-wider">
                Most Popular
              </span>
              <div className="space-y-3">
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                  Comprehensive Cardiac
                </span>
                <h4 className="text-xl font-bold text-slate-900">Executive Healthy Heart Master</h4>
                <div className="text-2xl font-bold text-[#1A56DB]">
                  ₹3,999 <span className="text-xs text-slate-400 font-normal line-through">₹8,500</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 12-Lead Digital ECG & Treadmill Test (TMT)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 2D Echocardiogram with Color Doppler</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> HbA1c Glycated Hemoglobin</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> High-Sensitivity C-Reactive Protein (hs-CRP)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Full LFT, KFT & Thyroid Panel</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Senior Cardiologist Consultation</li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenBookModal(undefined, 'Cardiology')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-md shadow-blue-500/25"
              >
                Book Cardiac Master
              </button>
            </div>

            {/* Package 3 */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full uppercase">
                  Senior Citizen Care
                </span>
                <h4 className="text-xl font-bold text-slate-900">Platinum Senior Citizen Screening</h4>
                <div className="text-2xl font-bold text-[#1A56DB]">
                  ₹4,899 <span className="text-xs text-slate-400 font-normal line-through">₹11,000</span>
                </div>
                <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Digital Chest X-Ray & Ultrasound Abdomen</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Bone Mineral Density (DEXA Scan)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Vitamin D3 & Vitamin B12 Levels</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> PSA (Men) / Mammogram & Pap Smear (Women)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Physician + Orthopaedic + Diet Consultation</li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenBookModal(undefined, 'Senior Health Screening')}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
              >
                Book Platinum Senior
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 12: DIAGNOSTIC & LABORATORY SERVICES
          Home sample collection booking & NABL lab
          ============================================================ */}
      <section id="diagnostics" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase">
                NABL ACCREDITED CLINICAL LABORATORY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2744]">
                Diagnostic & Pathology Excellence with Home Sample Pickup
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Operating high-throughput automated analyzers, our central clinical laboratory guarantees 100% precision calibration, dual-verified results by senior pathologists, and digital delivery directly to your Patient Health Card.
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  ✓ Over 1,500+ Pathology & Genetic Tests
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  ✓ Barcode Scanned Cold-Chain Transport
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  ✓ 2-Hour Rapid Stat Turnaround
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  ✓ Doorstep Phlebotomy Across City
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setIsSampleModalOpen(true)}
                  className="px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition flex items-center gap-2"
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>Book Home Blood Sample Collection</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-slate-50">
                <img
                  src="/assets/lab-microscope.jpg"
                  alt="Pathology Diagnostics Lab"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 13: DIGITAL PHARMACY SERVICES
          Doorstep delivery & genuine hospital medication
          ============================================================ */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold tracking-widest text-teal-600 uppercase">24/7 HOSPITAL PHARMACY</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2744]">
              Authentic Prescription Medicines Delivered to Your Door
            </h2>
            <p className="text-sm text-slate-600">
              Direct integration between your doctor's electronic prescription and our temperature-controlled hospital pharmacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Pill className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">100% Genuine Guaranteed</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct procurement from licensed global pharmaceutical manufacturers with strict temperature validation.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">2-Hour Express Delivery</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Emergency discharge medications and chronic refills delivered via express dispatch across metropolitan zones.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Automated Refill Reminders</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Never miss a critical dose. Automated SMS and WhatsApp refill alerts synchronized with your E-Prescription duration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 14: HOME HEALTHCARE (Hospital-at-Home)
          Bedside vitals, nursing, post-op physiotherapy
          ============================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-slate-50">
                <img
                  src="/assets/hospital-care.jpg"
                  alt="Home Healthcare Nursing"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">
                HOSPITAL-AT-HOME CARE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2744]">
                World-Class Clinical Care in the Comfort of Your Home
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                MediCore Home Care extends hospital-grade medical supervision to recovering post-operative patients, elderly individuals, and palliative care candidates under physician oversight.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">ICU-Trained Home Nurses (12h & 24h)</h5>
                    <p className="text-[11px] text-slate-500">Tracheostomy care, catheter care, IV infusion, and bedsore management.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Post-Surgical Physiotherapy & Rehab</h5>
                    <p className="text-[11px] text-slate-500">Joint replacement rehabilitation, stroke mobility recovery, and chest physiotherapy.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Home Medical Equipment Rental</h5>
                    <p className="text-[11px] text-slate-500">BiPAP, CPAP, oxygen concentrators, hospital ICU beds, and telemetry monitors.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 15: INTERNATIONAL PATIENTS (Fortis/Apollo Inspired)
          Global patient desk, medical visa, translators, lounge
          ============================================================ */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
            <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">
              GLOBAL HEALTHCARE DESTINATION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              International Patient Concierge Services
            </h2>
            <p className="text-sm text-slate-300">
              Welcoming patients from over 45 countries with customized medical travel support, dedicated relationship managers, and language translation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 text-center space-y-3">
              <Globe className="w-8 h-8 text-sky-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Medical Visa Invitation</h4>
              <p className="text-xs text-slate-300">Fast-tracked embassy assistance and visa invitation letter dispatched in 24 hours.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 text-center space-y-3">
              <Plane className="w-8 h-8 text-sky-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Airport Pickup & Transit</h4>
              <p className="text-xs text-slate-300">Complimentary ambulance or luxury car transfer directly from airport tarmac to hospital wing.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 text-center space-y-3">
              <MessageCircle className="w-8 h-8 text-sky-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Multilingual Interpreters</h4>
              <p className="text-xs text-slate-300">Native Arabic, French, Russian, and Swahili translators present at every clinical bedside.</p>
            </div>

            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 text-center space-y-3">
              <Building2 className="w-8 h-8 text-sky-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">Guest House Accommodation</h4>
              <p className="text-xs text-slate-300">Convenient partner service apartments for patient families within walking distance of the hospital.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 18: HEALTH ARTICLES AND NEWS
          Clinical insights authored by hospital faculty
          ============================================================ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="text-xs font-bold tracking-widest text-blue-600 uppercase">MEDICAL INSIGHTS</div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0F2744] mt-1">
                Latest Clinical Articles & Wellness Guides
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Evidence-based healthcare advice and surgical breakthroughs written by our attending consultants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition">
              <div className="h-48 overflow-hidden bg-slate-100">
                <img
                  src="/assets/hospital-corridor.jpg"
                  alt="Heart Health"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 space-y-2">
                <span className="text-[10px] font-bold text-blue-700 uppercase">Cardiology · 5 Min Read</span>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                  Silent Heart Attacks: Recognizing Subtle Warning Signs in Men and Women
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Not all myocardial infarctions present with crushing chest pain. Discover the atypical signs of ischemic cardiac distress.
                </p>
              </div>
            </div>

            <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition">
              <div className="h-48 overflow-hidden bg-slate-100">
                <img
                  src="/assets/lab-microscope.jpg"
                  alt="Robotic Advance"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 space-y-2">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Surgical Tech · 4 Min Read</span>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                  How Robotic Keyhole Surgery is Reducing Inpatient Recovery Time by 60%
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  A clinical review of DaVinci Xi robotic surgery outcomes across oncological and urological patient cohorts.
                </p>
              </div>
            </div>

            <div className="group rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition">
              <div className="h-48 overflow-hidden bg-slate-100">
                <img
                  src="/assets/hospital-care.jpg"
                  alt="Diabetes Reversal"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 space-y-2">
                <span className="text-[10px] font-bold text-indigo-700 uppercase">Endocrinology · 6 Min Read</span>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                  Type 2 Diabetes Remission: The Role of Continuous Glucose Monitoring & Clinical Diet
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  Groundbreaking multi-center findings on achieving HbA1c normalization without escalating multi-drug regimens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 19: EMERGENCY SERVICES & AIR AMBULANCE
          Golden hour trauma resuscitation & Air Ambulance Fleet
          ============================================================ */}
      <section className="py-16 bg-rose-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                24/7 Level-1 Emergency & Trauma Care
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
                Every Second Matters in Clinical Emergencies
              </h2>
              <p className="text-sm text-rose-100 max-w-xl">
                Immediate access to our Code Blue resuscitation team, interventional cath lab, CT trauma bay, and dedicated Air Ambulance helicopter evacuation.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="tel:18001066"
                className="px-8 py-4 rounded-full bg-white text-rose-700 font-extrabold text-base shadow-2xl hover:bg-rose-50 transition flex items-center gap-2"
              >
                <PhoneCall className="w-5 h-5" />
                <span>CALL 1800-1066 / 1066</span>
              </a>
              <button
                onClick={() => handleOpenBookModal(undefined, 'Emergency & Trauma')}
                className="px-6 py-4 rounded-full border-2 border-white text-white hover:bg-white/10 font-bold text-sm transition"
              >
                Notify Trauma Center Arrival
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 20: CONTACT, INTERACTIVE APPOINTMENT INQUIRY & FOOTER
          Comprehensive footer with department directory & credentials
          ============================================================ */}
      <footer id="contact" className="bg-[#0B1E34] text-white pt-20 pb-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Quick Inquiry Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-16 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-widest">
                  DIRECT CONSULTATION INQUIRY
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">
                  Have a Clinical Question or Need Assistance?
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Leave your details and our patient relations desk will connect you with the appropriate specialty coordinator within 15 minutes.
                </p>
              </div>

              <div className="lg:col-span-7">
                {contactSubmitted ? (
                  <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h5 className="text-sm font-bold text-white">Inquiry Dispatched to Clinical Desk</h5>
                    <p className="text-xs text-emerald-200">
                      Our patient relationship coordinator will call your registered contact shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your Name"
                      required
                      className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="Mobile Phone"
                      required
                      className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <select
                      value={contactDept}
                      onChange={(e) => setContactDept(e.target.value)}
                      className="px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="General Medicine">General Medicine</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Orthopaedics">Orthopaedics</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Oncology">Oncology</option>
                    </select>
                    <div className="sm:col-span-3">
                      <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-blue-600/30"
                      >
                        Request Specialist Callback
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Directory Links Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16 text-xs">
            {/* Col 1: Brand Info */}
            <div className="col-span-2 md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#1A2332] border border-slate-700/50 shadow-md shrink-0">
                  <img
                    src="/assets/medicore-logo.png"
                    alt="MediCore Logo"
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/20 pointer-events-none rounded-xl" />
                </div>
                <div>
                  <span className="text-xl font-serif font-bold text-white tracking-tight">MEDICORE</span>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">HOSPITAL ECOSYSTEM</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed pr-6 text-xs">
                MediCore Enterprise Hospital Information System and Multispeciality Clinical Center. Combining world-class medical specialists, DaVinci robotic suites, and paperless EMR documentation.
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>NABH Level 3 · NABL ISO-15189 · ABDM Integrated</span>
              </div>
            </div>

            {/* Col 2: Clinical Portals */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-white">Hospital Portals</h5>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => onSelectPortal('super-admin')} className="hover:text-white">1. Super Admin</button></li>
                <li><button onClick={() => onSelectPortal('doctor')} className="hover:text-white">2. Doctor Station</button></li>
                <li><button onClick={() => onSelectPortal('nurse')} className="hover:text-white">3. Head Nurse Station</button></li>
                <li><button onClick={() => onSelectPortal('patient')} className="hover:text-white">4. Patient Portal</button></li>
                <li><button onClick={() => onSelectPortal('admin')} className="hover:text-white">5. Executive Admin</button></li>
                <li><button onClick={() => setIsGatewayModalOpen(true)} className="text-sky-400 hover:underline">View All 20 Portals →</button></li>
              </ul>
            </div>

            {/* Col 3: Specialities */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-white">Specialities</h5>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#specialities" className="hover:text-white">Cardiac Sciences</a></li>
                <li><a href="#specialities" className="hover:text-white">Neurosciences</a></li>
                <li><a href="#specialities" className="hover:text-white">Robotic Orthopaedics</a></li>
                <li><a href="#specialities" className="hover:text-white">Oncology & BMT</a></li>
                <li><a href="#specialities" className="hover:text-white">Gastroenterology</a></li>
                <li><a href="#specialities" className="hover:text-white">Organ Transplant</a></li>
              </ul>
            </div>

            {/* Col 4: Patients & Visitors */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-white">Patients & Visitors</h5>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => handleOpenBookModal()} className="hover:text-white">Book OPD Appointment</button></li>
                <li><button onClick={() => handleOpenVideoConsult()} className="hover:text-white">Online Video Consult</button></li>
                <li><button onClick={() => setIsSampleModalOpen(true)} className="hover:text-white">Diagnostic Home Sample</button></li>
                <li><a href="#services" className="hover:text-white">Cashless TPA & Insurance</a></li>
                <li><a href="#about" className="hover:text-white">Visitor Guidelines</a></li>
                <li><a href="#contact" className="hover:text-white">Emergency Dispatch (1066)</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom regulatory bar */}
          <div className="pt-8 border-t border-slate-800 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 MediCore Healthcare System. All rights reserved. Complies with NABH, NABL & ABDM Data Standards.
            </div>
            <div className="flex items-center gap-4">
              <a href="#home" className="hover:text-slate-300">Privacy Policy</a>
              <span>·</span>
              <a href="#home" className="hover:text-slate-300">Patient Rights Charter</a>
              <span>·</span>
              <a href="#home" className="hover:text-slate-300">Clinical Audit Disclosures</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================
          INTERACTIVE MODALS
          ============================================================ */}
      <BookAppointmentModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        preselectedDoctorId={selectedDoctorForModal}
        preselectedDepartment={selectedDeptForModal}
      />

      <OnlineConsultModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        doctorId={selectedDoctorForModal}
      />

      <HomeSampleModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
      />

      <PortalGatewayModal
        isOpen={isGatewayModalOpen}
        onClose={() => setIsGatewayModalOpen(false)}
        onSelectPortal={(portal) => {
          onSelectPortal(portal);
        }}
      />
    </div>
  );
};
