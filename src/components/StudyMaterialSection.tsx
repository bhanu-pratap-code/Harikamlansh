import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, BookOpen, Layers, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";

export default function StudyMaterialSection() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  useEffect(() => {
    async function fetchMaterials() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("Coaching_StudyMaterial")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        if (data) {
          setMaterials(data);
          // Fixed TypeScript Error: adding 'as string[]'
          const uniqueClasses = [...new Set(data.map((m: any) => m.student_class))] as string[];
          if (uniqueClasses.length > 0) {
            setSelectedClass(uniqueClasses[0]);
            const firstSubject = data.find((m: any) => m.student_class === uniqueClasses[0])?.subject;
            setSelectedSubject(firstSubject || "");
          }
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMaterials();
  }, []);

  const classes = [...new Set(materials.map((m) => m.student_class))] as string[];
  const subjectsForClass = [...new Set(materials.filter((m) => m.student_class === selectedClass).map((m) => m.subject))] as string[];

  const handleClassChange = (c: string) => {
    setSelectedClass(c);
    const firstSubject = materials.find(m => m.student_class === c)?.subject;
    setSelectedSubject(firstSubject ?? "");
  };

  const filtered = materials.filter(m => m.student_class === selectedClass && m.subject === selectedSubject);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <section id="material" className="relative py-8 mt-10 md:py-20 bg-[#F8FAFC] min-h-screen h-auto overflow-y-visible">
  {/* pt-20 mobile par navbar se space dene ke liye hai */}
  <div className="container mx-auto px-4 md:px-4 pt-20 md:pt-0">
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="text-center mb-10 px-4"
    >
      <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
        Study <span className="text-primary">Material</span>
      </h2>
    </motion.div>

    <div className="max-w-4xl mx-auto px-4 pb-20">
      {/* Class Selection */}
      <div className="mb-8 text-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">
          Step 1: Select Your Class
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {classes.map((c: string | number) => (
            <button 
              key={c} 
              onClick={() => handleClassChange(c)} 
              className={`px-5 py-2 rounded-xl font-bold transition-all ${selectedClass === c ? "bg-primary text-white shadow-md" : "bg-white border text-slate-500 hover:bg-slate-50"}`}
            >
              Class {c}
            </button>
          ))}
        </div>
      </div>

      {/* Subject Selection */}
      {selectedClass && (
        <div className="mb-12 text-center animate-in fade-in duration-300">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">
            Step 2: Choose Subject
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {subjectsForClass.map((s: string) => (
              <button 
                key={s} 
                onClick={() => setSelectedSubject(s)} 
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${selectedSubject === s ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

    {/* PDF List */}
<div className="space-y-4">
  <AnimatePresence mode="wait">
    {filtered.map((m: any) => (
      <motion.div 
        key={m.id} 
        initial={{ opacity: 0, y: 15 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -2 }} // Chhota sa lift effect
        className="group relative bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300"
      >
        {/* Decorative background element on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />

        <div className="flex items-center gap-4 w-full relative z-10">
          {/* Enhanced Icon Box */}
          <div className="h-12 w-12 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-inner">
            <FileText size={24} />
          </div>

          <div className="min-w-0 flex-1 text-left">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-extrabold text-slate-800 truncate text-sm md:text-base tracking-tight">
                {m.title}
              </p>
              <span className="hidden md:inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wide">
                PDF
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">
                {m.subject}
              </span>
              <span className="text-[14px] font-medium text-gray-500 flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                Class {m.student_class}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full sm:w-auto relative z-10">
          <Button 
            asChild 
            className="w-full sm:w-auto rounded-xl font-bold bg-slate-900 hover:bg-blue-600 text-white shadow-lg shadow-slate-200 hover:shadow-blue-200 transition-all duration-300 h-11 px-6"
          >
            <a href={m.file_url} target="_blank" rel="noreferrer" className="flex items-center justify-center">
              <Download className="h-4 w-4 mr-2 stroke-[3px]" /> 
              Download Notes
            </a>
          </Button>
        </div>
      </motion.div>
    ))}
  </AnimatePresence>
</div>
    </div>
  </div>
</section>
  );
}