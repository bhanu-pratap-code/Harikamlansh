import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, FileText, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/supabaseClient";

export default function StudyMaterialSection() {
  // --- States for PDF Materials ---
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [showMorePdfs, setShowMorePdfs] = useState(false); 

  // --- States for YouTube Videos ---
  const [videos, setVideos] = useState<any[]>([]);
  const [showAllVideos, setShowAllVideos] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // 1. Fetch PDF Materials
        const { data: matData, error: matError } = await supabase
          .from("Coaching_StudyMaterial")
          .select("*")
          .order("created_at", { ascending: false });

        if (matError) throw matError;
        
        if (matData) {
          setMaterials(matData);
          const uniqueClasses = [...new Set(matData.map((m: any) => m.student_class))] as string[];
          if (uniqueClasses.length > 0) {
            setSelectedClass(uniqueClasses[0]);
            const firstSubject = matData.find((m: any) => m.student_class === uniqueClasses[0])?.subject;
            setSelectedSubject(firstSubject || "");
          }
        }

        // 2. Fetch YouTube Videos
        const { data: vidData, error: vidError } = await supabase
          .from('video_lectures')
          .select('*')
          .order('created_at', { ascending: false });

        if (!vidError && vidData) {
          setVideos(vidData);
        }

      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // PDF Filtering Logic
  const classes = [...new Set(materials.map((m) => m.student_class))] as string[];
  const subjectsForClass = [...new Set(materials.filter((m) => m.student_class === selectedClass).map((m) => m.subject))] as string[];

  const handleClassChange = (c: string) => {
    setSelectedClass(c);
    const firstSubject = materials.find(m => m.student_class === c)?.subject;
    setSelectedSubject(firstSubject ?? "");
    setShowMorePdfs(false); 
  };

  const filtered = materials.filter(m => m.student_class === selectedClass && m.subject === selectedSubject);

  // --- Pagination Logic ---
  const visiblePdfs = showMorePdfs ? filtered : filtered.slice(0, 6);
  const visibleVideos = showAllVideos ? videos : videos.slice(0, 8);

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* --- Section 1: PDF Materials --- */}
      <section id="material" className="relative py-8 mt-10 md:py-20 h-auto overflow-y-visible">
        <div className="container mx-auto px-4 pt-20 md:pt-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10 px-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Study <span className="text-primary">Material</span>
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto px-4 pb-20">
            {/* Class Selection */}
            <div className="mb-8 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Step 1: Select Your Class</p>
              <div className="flex flex-wrap justify-center gap-2">
                {classes.map((c: string) => (
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
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-4 tracking-widest">Step 2: Choose Subject</p>
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
                {visiblePdfs.map((m: any) => (
                  <motion.div 
                    key={m.id} 
                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -2 }}
                    className="group relative bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                    <div className="flex items-center gap-4 w-full relative z-10">
                      <div className="h-12 w-12 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
                        <FileText size={24} />
                      </div>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-extrabold text-slate-800 truncate text-sm md:text-base">{m.title}</p>
                          <span className="hidden md:inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase">PDF</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-md">{m.subject}</span>
                          <span className="text-[14px] font-medium text-gray-500 flex items-center gap-1">
                            <span className="h-1 w-1 rounded-full bg-slate-300" /> Class {m.student_class}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto relative z-10">
                      <Button asChild className="w-full sm:w-auto rounded-xl font-bold bg-slate-900 hover:bg-blue-600 text-white h-11 px-6">
                        <a href={m.file_url} target="_blank" rel="noreferrer" className="flex items-center justify-center">
                          <Download className="h-4 w-4 mr-2 stroke-[3px]" /> Download Notes
                        </a>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* PDF Toggle Button (Show More / Less) */}
            {filtered.length > 6 && (
              <div className="mt-8 text-center">
                <Button 
                  onClick={() => setShowMorePdfs(!showMorePdfs)}
                  variant="outline"
                  className="rounded-full px-8 font-bold border-2 border-green-300 hover:border-green-500 hover:text-green-600 transition-all flex items-center mx-auto gap-2"
                >
                  {showMorePdfs ? (
                    <><ChevronUp className="h-4 w-4" /> Show Less</>
                  ) : (
                    <><ChevronDown className="h-4 w-4" /> Show More Notes ({filtered.length - 6}+)</>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* --- Section 2: Video Lectures --- */}
      <section className="py- bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Video <span className="text-blue-700">Lectures</span>
            </h2>
            <div className="h-1.5 w-20 bg-blue-700 mt-4 rounded-full mx-auto mb-12"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
            {visibleVideos.map((vid) => (
              <a 
                key={vid.id} 
                href={`https://www.youtube.com/watch?v=${vid.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-200">
                  <img 
                    src={`https://img.youtube.com/vi/${vid.youtube_id}/maxresdefault.jpg`}
                    alt={vid.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e: any) => { e.target.src = `https://img.youtube.com/vi/${vid.youtube_id}/0.jpg` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/40 transition-all">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[12px] border-l-blue-700 border-b-[6px] border-b-transparent ml-1"></div>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex-grow">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest px-2 py-1 bg-blue-50 rounded-md">
                    {vid.subject}
                  </span>
                  <h3 className="font-extrabold text-slate-800 text-base mt-3 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">
                    {vid.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>

          {/* Video Toggle Button (Show More / Less) */}
          {videos.length > 8 && (
            <div className="mt-16 text-center">
              <button 
                onClick={() => setShowAllVideos(!showAllVideos)}
                className="px-10 py-4 bg-green-600 text-white font-bold text-sm  rounded-full hover:bg-green-800 shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center mx-auto gap-2 mb-16"
              >
                {showAllVideos ? (
                  <><ChevronUp className="h-5 w-5" /> Show Less Lectures</>
                ) : (
                  <><ChevronDown className="h-5 w-5" /> Show More Lectures ({videos.length - 8}+)</>
                )}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}