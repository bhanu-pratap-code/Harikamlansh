import React from 'react';
import { Target, Users, Award, BookOpen, CheckCircle2, Quote, ArrowRight } from 'lucide-react';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const About = () => {
  const stats = [
    { label: "Students Trained", value: "10,000+", icon: <Users className="w-6 h-6" /> },
    { label: "Success Rate", value: "95%", icon: <Target className="w-6 h-6" /> },
    { label: "Expert Faculty", value: "50+", icon: <Award className="w-6 h-6" /> },
    { label: "Years Excellence", value: "14+", icon: <BookOpen className="w-6 h-6" /> },
  ];

  return (
    <div className="min-h-screen bg-white mt-32 pb-0 overflow-x-hidden">
      {/* 1. Modern Hero Section */}
      <section className="container mx-auto px-4 mb-24 relative">
        <div className="absolute top-0 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="text-center max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
            Our Legacy of Excellence
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.2] md:leading-[1.1]">
            We Don't Just Teach, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              We Build Careers
            </span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed mb-10">
            Academic is more than a coaching institute. It's a platform where concepts meet clarity
            and dreams transform into reality through disciplined guidance.
          </p>
        </div>
      </section>

      {/* 2. Stats Grid with Glassmorphism */}
      <section className="container mx-auto px-4 mb-24 md:mb-32">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-gradient-to-b from-white to-slate-50/50 border border-slate-100 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-10px_rgba(59,130,246,0.15)] hover:-translate-y-2 transition-all duration-500 overflow-hidden"
            >
              {/* Decorative background circle on hover */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700 -z-10" />

              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                {/* Icon with floating effect - Scaled down for mobile */}
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white text-primary rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] group-hover:bg-primary group-hover:text-white group-hover:rotate-[10deg] transition-all duration-500">
                  <div className="scale-90 md:scale-110">
                    {stat.icon}
                  </div>
                </div>

                {/* Value with a subtle gradient or highlight */}
                <div className="relative">
                  <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight mb-1">
                    {stat.value}
                  </h3>
                  {/* Animated Underline: Center on mobile, Left on desktop */}
                  <div className="w-8 h-1 bg-primary/20 rounded-full mx-auto md:mx-0 group-hover:w-full transition-all duration-500" />
                </div>

                {/* Label - Slightly smaller on mobile */}
                <p className="text-slate-500 font-bold text-[10px] md:text-xs mt-3 uppercase tracking-[0.1em] md:tracking-[0.15em]">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Director/Owner Section (The Face of Institute) */}
      <section className="container mx-auto px-4 mb-24">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden max-w-7xl mx-auto">
          {/* Decorative background slightly toned down */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 skew-x-12 translate-x-10" />

          <div className="grid md:grid-cols-5 gap-8 items-center relative z-10">
            {/* Image Container - Sized down */}
            <div className="md:col-span-2 max-w-[280px] mx-auto md:max-w-none">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl translate-x-2 translate-y-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform" />
                <img
                  src= "/Director.png"
                  alt="Director"
                  className="w-full aspect-[4/5] object-cover rounded-2xl relative z-10 hover:scale  transition-all duration-500 shadow-xl"
                />
              </div>
            </div>

            <div className="md:col-span-3 text-white text-center md:text-left">
              {/* Director Name & Title - Mobile par center, Laptop par border-left ke saath */}
              <div className="inline-block md:block border-l-0 md:border-l-4 border-primary pl-0 md:pl-6 mb-10">
                <h4 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                  Mr. Mohit Dwkr
                </h4>
                <p className="text-primary font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs mt-2">
                  Founder & Managing Director
                </p>
              </div>

              {/* Heading */}
              <h2 className="text-xl md:text-2xl font-black mb-2 leading-tight mt-2">
                Message From <br className="hidden md:block" />
                <span className="text-primary">Director</span>
              </h2>

              {/* Quote - Responsive font size and line height */}
              <div className="relative">
                <Quote className="absolute -top-4 -left-4 w-8 h-8 text-primary/20 md:hidden" />
                <p className="text-base md:text-xl text-slate-300 mb-2 italic leading-relaxed max-w-2xl mx-auto md:mx-0">
                  "At Toppers Academy, we don't just prepare you for exams; we prepare you for life.
                  We focus on building a foundation so strong that no competition feels too difficult."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Modern Vision & Mission Cards */}
      {/* 4. Modern Vision & Mission Timeline (Redesigned) */}
     <section className="container mx-auto px-4 mb-32 relative pt-20">
  {/* Decorative dotted background pattern */}
  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 -z-10" />
  
  <div className="text-center max-w-2xl mx-auto mb-16 px-4">
    <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 rounded-full">
      Our Path, Your Future
    </span>
    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950">What Drives Us?</h2>
  </div>

  {/* Timeline Line Logic: Fixed left on mobile, centered on desktop */}
  <div className="relative space-y-16 md:space-y-24 before:absolute before:inset-y-0 before:left-4 md:before:left-1/2 before:w-1 before:bg-slate-100 before:-ml-px before:-z-10">
    
    {/* Mission Item */}
    <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12 group">
      {/* Circle Icon - Stays aligned with line */}
      <div className="absolute left-4 md:left-1/2 w-8 h-8 md:w-10 md:h-10 -ml-4 md:-ml-5 bg-primary text-white rounded-full flex items-center justify-center border-4 border-white shadow-xl scale-1 group-hover:scale-125 transition-transform duration-500 z-10">
        <Target className="w-4 h-4 md:w-5 md:h-5" />
      </div>

      <div className="w-full md:w-1/2 pl-10 md:pl-0 md:pr-12">
        <div className="p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-white to-slate-50 border border-slate-100 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-transform duration-500">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 text-primary rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
            <Target className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 md:mb-6 flex items-center gap-3">
             Our Mission
             <span className="inline-block w-5 h-5 p-1 border-2 border-primary text-primary rounded-full"><ArrowRight className="w-full h-full" /></span>
          </h3>
          <p className="text-base md:text-lg leading-relaxed text-slate-600">
            To bridge the gap between dreams and reality by providing world-class coaching that focuses on 
            <span className="font-bold text-slate-800"> conceptual clarity </span> and <span className="font-bold text-slate-800"> competitive edge</span>. 
          </p>
        </div>
      </div>
      
      {/* Image - Hidden on mobile to keep timeline clean, visible on md+ */}
      <div className="hidden md:block md:w-1/2 md:pr-12">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-[2rem] translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
          <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative z-10 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80" 
              alt="Mission" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Vision Item */}
    <div className="relative flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12 group ">
      {/* Circle Icon */}
      <div className="absolute left-4 md:left-1/2 w-8 h-8 md:w-10 md:h-10 -ml-4 md:-ml-5 bg-slate-900 text-white rounded-full flex items-center justify-center border-4 border-white shadow-xl scale-1 group-hover:scale-125 transition-transform duration-500 z-10">
        <Users className="w-4 h-4 md:w-5 md:h-5" />
      </div>

      <div className="w-full md:w-1/2 pl-10 md:pl-12">
        <div className="p-6 md:p-10 rounded-[1.5rem] md:rounded-[2rem] bg-gradient-to-br from-slate-950 to-slate-800 text-white shadow-[0_15px_60px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-2 transition-transform duration-500">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white/10 text-primary rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
            <Users className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h3 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 flex items-center gap-3">
             Our Vision
             <span className="inline-block w-5 h-5 p-1 border-2 border-primary text-primary rounded-full"><ArrowRight className="w-full h-full" /></span>
          </h3>
          <p className="text-base md:text-lg leading-relaxed text-slate-200 italic">
            "To be the most trusted education platform that empowers students globally to lead and succeed."
          </p>
        </div>
      </div>
      
      {/* Image - Hidden on mobile */}
      <div className="hidden md:block md:w-1/2 md:pl-12">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 rounded-[2rem] -translate-x-4 translate-y-4 group-hover:-translate-x-2 group-hover:translate-y-2 transition-transform duration-500" />
          <div className="aspect-[4/3] rounded-[2rem] overflow-hidden relative z-10 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80" 
              alt="Vision" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </div>
      </div>
    </div>

  </div>
</section>

<Testimonials/>
<Footer/>
      
    </div>
  );
};

export default About;