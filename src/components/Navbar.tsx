import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react"; // ChevronDown add kiya hai
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const links = [
  { label: "Home", href: "/" },
  { label: "Batches", href: "/#batches" },
  { label: "Faculty", href: "/#faculty" },
  { label: "Results", href: "/#results" },
  { label: "Gallery", href: "/#gallery" },
];

// Courses for Dropdown
const courses = [
  { label: "Navodaya Entrance Exam", href: "/study-material" },
  { label: "Sainik School Entrance Exam", href: "/study-material" },
  { label: "Shramodaya School Entrance Exam", href: "/study-material" },
  { label: "Rastriya Milititary School Exam", href: "/study-material" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const [isScrolled, setIsScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
  const location = useLocation();
  const [isMobileCoursesOpen, setIsMobileCoursesOpen] = useState(false);

  const isSolid = isScrolled || location.pathname !== "/";

  useEffect(() => {
    const handleScrollBg = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScrollBg);
    return () => window.removeEventListener("scroll", handleScrollBg);
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      setActive("#home");
    } else {
      setActive("");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const handleScroll = () => {
      const sections = ["home", "batches", "faculty", "results", "gallery", "contact"];
      for (let id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActive(`#${id}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isSolid
          ? "bg-white/90 backdrop-blur-lg border-b border-border py-3 shadow-sm"
          : "bg-black/15 backdrop-blur-sm py-1"
        }`}
    >
      <div className="w-full pl-4 md:pl-8 pr-0 flex items-center justify-between h-12">

        {/* Logo */}
        <Link
          to="/"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActive("#home");
          }}
          className={`flex items-center gap-2 font-bold transition-colors ${isSolid ? "text-primary" : "text-white"
            }`}
        >
          <img
            src="/logo.jpg"
            alt="Logo"
            className="h-8 w-8 md:h-10 md:w-10 object-contain rounded-full border-2 border-black flex-shrink-0"
          />
          <span className="text-lg md:text-2xl leading-tight">
            Harikamlansh Academy
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-2 mr-6">
          {links.map((l) => {
            const isActive = l.href.startsWith("/#")
              ? active === l.href.replace("/", "")
              : location.pathname === l.href;

            return (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => {
                  if (l.href === "/") window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`px-4 py-2 text-sm font-bold transition-all rounded-full ${isActive
                    ? isSolid
                      ? "text-primary bg-primary/10"
                      : "text-white bg-white/20 backdrop-blur-md"
                    : isSolid
                      ? "text-muted-foreground hover:text-primary"
                      : "text-white/70 hover:text-white"
                  }`}
              >
                {l.label}
              </Link>
            );
          })}

          {/* Courses Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className={`px-4 py-2 text-sm font-bold transition-all flex items-center gap-1 ${isSolid ? "text-muted-foreground hover:text-primary" : "text-white/75 hover:text-white"
              }`}>
              Courses <ChevronDown className="h-4 w-4" />
            </button>

            {dropdownOpen && (
              /* Width badha kar w-64 kar di hai (256px) */
              <div className="absolute top-full left-0 w-64 bg-white shadow-2xl rounded-xl border border-border py-2 animate-in fade-in zoom-in-95 duration-200 mt-1">
                {courses.map((course, index) => (
                  <Link
                    key={course.label}
                    to={course.href}
                    className={`block px-5 py-3 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary font-medium transition-colors
            ${index !== courses.length - 1 ? "border-b border-gray-300" : ""} 
          `}
                  /* Upar wali line last item ko chhod kar sabke niche separator line lagati hai */
                  >
                    {course.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/study-material" className={`px-4 py-2 text-sm font-bold transition-all ${isSolid ? "text-muted-foreground hover:text-primary" : "text-white/70 hover:text-white"
            }`}>
            Study Material
          </Link>
          <Link to="/about" className={`px-4 py-2 text-sm font-bold transition-all ${isSolid ? "text-muted-foreground hover:text-primary" : "text-white/70 hover:text-white"
            }`}>
            About Us
          </Link>

         <button 
  className={`ml-1 rounded-full px-4 py-2 font-bold shadow-lg transition-all duration-300 hover:scale-105 border-2 
    ${!isSolid 
      ? "border-white text-white hover:bg-white hover:text-blue-500 bg-transparent" 
      : "border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
    }`}
>
  <a className= "font-semibold text-sm" href="/payment">Pay Fees</a>
</button>

          <Button size="lg" className={`ml-4 rounded-full px-4 shadow-lg transition-transform hover:scale-105 ${!isSolid && "bg-white text-primary hover:bg-gray-100 border-none"
            }`} asChild>
            <a href="/#contact">Join Now</a>
          </Button>


        </div>

        {/* Mobile Toggle */}
        <button
          className={`lg:hidden p-2 rounded-md ${isSolid ? "text-foreground" : "text-white"}`}
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-background border-b border-border px-4 pb-6 pt-2 animate-in slide-in-from-top duration-300 overflow-y-auto max-h-[80vh]">
          {links.map((l) => {
            const isActive = l.href.startsWith("/#")
              ? active === l.href.replace("/", "")
              : location.pathname === l.href;

            return (
              <Link
                key={l.href}
                to={l.href}
                onClick={() => {
                  setOpen(false);
                  if (l.href === "/") window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`block py-3 text-base font-semibold border-b border-border/50 last:border-none ${isActive ? "text-primary" : "text-foreground"
                  }`}
              >
                {l.label}
              </Link>
            );
          })}


          {/* Mobile Courses Section (Accordion Style) */}
          <div className="py-3 border-b border-border/50">
            <button
              onClick={() => setIsMobileCoursesOpen(!isMobileCoursesOpen)}
              className="flex items-center justify-between w-full text-base font-semibold text-foreground"
            >
              Courses
              <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isMobileCoursesOpen ? "rotate-180" : ""}`} />
            </button>


            {/* Ye sirf tabhi dikhega jab isMobileCoursesOpen true hoga */}
            {isMobileCoursesOpen && (
              <div className="grid grid-cols-2 gap-2 mt-3 pl-2 animate-in slide-in-from-top-2 duration-200">
                {courses.map((course) => (
                  <Link
                    key={course.label}
                    to={course.href}
                    onClick={() => {
                      setOpen(false); // Pura mobile menu band karne ke liye
                      setIsMobileCoursesOpen(false); // Dropdown reset karne ke liye
                    }}
                    className="text-sm font-medium py-2 text-muted-foreground hover:text-primary active:text-primary"
                  >
                    {course.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link to="/study-material" onClick={() => setOpen(false)} className="block py-3 text-base font-semibold border-b border-border/50 text-foreground">
            Study Material
          </Link>
          <Link to="/about" onClick={() => setOpen(false)} className="block py-3 text-base font-semibold border-b border-border/50 text-foreground">
            About Us
          </Link>

          <Link to="/payment" onClick={() => setOpen(false)} className="block py-3 text-base font-semibold border-b border-border/50 text-foreground">
            Pay Fees
          </Link>

 {/* <button 
  className={`ml-1 rounded-full px-4 py-2 font-bold shadow-lg transition-all duration-300 hover:scale-105 border-2 
    ${!isSolid 
      ? "border-white text-white hover:bg-white hover:text-blue-500 bg-transparent" 
      : "border-blue-500 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
    }`}
>
  <a className= "font-semibold text-sm" href="/payment">Pay Fees</a>
</button> */}

          <Button size="lg" className="mt-6 w-full rounded-xl" asChild>
            <a href="/#contact" onClick={() => setOpen(false)}>
              Join Now
            </a>
          </Button>
        </div>
      )}
    </nav>
  );
}