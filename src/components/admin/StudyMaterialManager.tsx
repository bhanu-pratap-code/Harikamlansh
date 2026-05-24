import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, FileText, Upload, Edit2, X, Save, FileUp, Loader2, ArrowUp, ArrowDown} from "lucide-react";
import { supabase } from "@/supabaseClient"; 
import { toast } from "sonner";

export default function StudyMaterialManager() {

const [renameOldClass, setRenameOldClass] = useState("");
const [renameNewClass, setRenameNewClass] = useState("");
const [isRenaming, setIsRenaming] = useState(false);



  const [materials, setMaterials] = useState<any[]>([]); 
  const [form, setForm] = useState({ title: "", student_class: "", subject: "", file_url: "" });

  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isManualClass, setIsManualClass] = useState(false);
  const [isManualSubject, setIsManualSubject] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMaterials = async () => {
    const { data } = await supabase
      .from("Coaching_StudyMaterial")
      .select("*")
      .order("display_order", { ascending: true });
    if (data) setMaterials(data);
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const availableClasses = [...new Set(materials.map(m => m.student_class))];
  const availableSubjects = [...new Set(materials.map(m => m.subject))];

const filteredList = materials.filter((m) => {
  const matchClass =
    filterClass === "all" || m.student_class === filterClass;

  const matchSubject =
    filterSubject === "all" || m.subject === filterSubject;

  const matchSearch =
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.student_class.toString().includes(searchQuery.toLowerCase());

  return matchClass && matchSubject && matchSearch;
});

  // --- UPDATED FILE UPLOAD (Cleans up storage on Edit) ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Agar Edit kar rahe hain aur nayi file select ki, toh purani delete karo
      if (editingId && form.file_url && form.file_url.includes('coaching_data/')) {
        const oldPath = form.file_url.split('coaching_data/')[1]?.split('?')[0];
        if (oldPath) {
          await supabase.storage.from('coaching_data').remove([oldPath]);
        }
      }

      const filePath = `study/${Date.now()}_${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('coaching_data')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('coaching_data').getPublicUrl(filePath);
      setForm({ ...form, file_url: data.publicUrl });
      toast.success("New file uploaded!");
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const addOrUpdate = async () => {
    if (!form.title || !form.student_class || !form.subject || !form.file_url) {
        toast.error("Please fill all fields and upload a file");
        return;
    }

    setIsUploading(true);
    try {
       let payload: any = {
  title: form.title,
  student_class: form.student_class,
  subject: form.subject,
  file_url: form.file_url
};

if (!editingId) {
  const { data: lastItem } = await supabase
    .from("Coaching_StudyMaterial")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  payload.display_order = (lastItem?.display_order || 0) + 1;
}

        if (editingId) {
          const { error } = await supabase
            .from("Coaching_StudyMaterial")
            .update(payload)
            .eq("id", editingId);
          
          if (error) throw error;
          toast.success("Material updated!");
          setEditingId(null);
        } else {
          const { error } = await supabase
            .from("Coaching_StudyMaterial")
            .insert([payload]);
          
          if (error) throw error;
          toast.success("Added to Library!");
        }

        setForm({ title: "", student_class: "", subject: "", file_url: "" });
        setIsManualClass(false);
        setIsManualSubject(false);
        fetchMaterials();
    } catch (error: any) {
        toast.error("Error: " + error.message);
    } finally {
        setIsUploading(false);
    }
  };

  const startEdit = (m: any) => {
    setEditingId(m.id);
    setForm({ 
        title: m.title, 
        student_class: m.student_class, 
        subject: m.subject, 
        file_url: m.file_url 
    });
    setIsManualClass(false);
    setIsManualSubject(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ title: "", student_class: "", subject: "", file_url: "" });
    setIsManualClass(false);
    setIsManualSubject(false);
  };

  // --- UPDATED REMOVE (Deletes from Storage + DB) ---
  const remove = async (id: string) => {
    if(!confirm("Delete this material permanently?")) return;
    
    setIsUploading(true);
    try {
        // 1. Storage se file delete karne ke liye URL fetch karo
        const { data: item } = await supabase
            .from("Coaching_StudyMaterial")
            .select("file_url")
            .eq("id", id)
            .single();

        if (item?.file_url && item.file_url.includes('coaching_data/')) {
            const filePath = item.file_url.split('coaching_data/')[1]?.split('?')[0];
            if (filePath) {
                await supabase.storage.from('coaching_data').remove([filePath]);
            }
        }

        // 2. DB record delete karo
        const { error } = await supabase.from("Coaching_StudyMaterial").delete().eq("id", id);
        if (error) throw error;

        toast.error("Material deleted from storage and list");
        fetchMaterials();
    } catch (error: any) {
        toast.error("Delete failed: " + error.message);
    } finally {
        setIsUploading(false);
    }
  };


          const moveUp = async (item: any) => {
  const currentOrder = item.display_order;

  const upperItem = materials
    .filter((m) => m.display_order < currentOrder)
    .sort((a, b) => b.display_order - a.display_order)[0];

  if (!upperItem) return;

  await supabase
    .from("Coaching_StudyMaterial")
    .update({ display_order: upperItem.display_order })
    .eq("id", item.id);

  await supabase
    .from("Coaching_StudyMaterial")
    .update({ display_order: currentOrder })
    .eq("id", upperItem.id);

  fetchMaterials();
};

const moveDown = async (item: any) => {
  const currentOrder = item.display_order;

  const lowerItem = materials
    .filter((m) => m.display_order > currentOrder)
    .sort((a, b) => a.display_order - b.display_order)[0];

  if (!lowerItem) return;

  await supabase
    .from("Coaching_StudyMaterial")
    .update({ display_order: lowerItem.display_order })
    .eq("id", item.id);

  await supabase
    .from("Coaching_StudyMaterial")
    .update({ display_order: currentOrder })
    .eq("id", lowerItem.id);

  fetchMaterials();
};


const renameClassEverywhere = async () => {

  if (!renameOldClass || !renameNewClass) {
    toast.error("Please fill both class names");
    return;
  }

  if (renameOldClass === renameNewClass) {
    toast.error("Both class names are same");
    return;
  }

  try {

    setIsRenaming(true);

    const { error } = await supabase
      .from("Coaching_StudyMaterial")
      .update({
        student_class: renameNewClass
      })
      .eq("student_class", renameOldClass);

    if (error) throw error;

    toast.success("Class renamed successfully");

    setRenameOldClass("");
    setRenameNewClass("");

    fetchMaterials();

  } catch (error: any) {

    toast.error(error.message);

  } finally {

    setIsRenaming(false);

  }
};

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-0 animate-in fade-in duration-500">
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Material Manager</h2>
        <p className="text-slate-500 text-sm mt-1">Upload Your PDF Notes and keep storage clean.</p>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 mb-8 md:mb-10">
        <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-primary mb-6 flex items-center gap-2">
          <FileUp className="h-4 w-4" /> {editingId ? "Update Document" : "Upload New Document"}
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 ml-1">Note Title</label>
            <Input className="rounded-xl h-11 md:h-10 text-sm" placeholder="e.g. Algebra Part 1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 ml-1">Class</label>
            {!isManualClass ? (
              <select 
                className="w-full h-11 md:h-10 px-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                value={form.student_class}
                onChange={(e) => {
                  if (e.target.value === "new") {
                    setIsManualClass(true);
                    setForm({ ...form, student_class: "" });
                  } else {
                    setForm({ ...form, student_class: e.target.value });
                  }
                }}
              >
                <option value="">Select Class</option>
                {availableClasses.map(c => <option key={c} value={c}> {c}</option>)}
                <option value="new" className="text-primary font-bold">+ Add New Class</option>
              </select>
            ) : (
              <div className="relative">
                <Input className="rounded-xl pr-10 h-11 md:h-10 text-sm" placeholder="Type Class" value={form.student_class} onChange={(e) => setForm({ ...form, student_class: e.target.value })} />
                <button onClick={() => setIsManualClass(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"><X className="h-4 w-4"/></button>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 ml-1">Subject</label>
            {!isManualSubject ? (
              <select 
                className="w-full h-11 md:h-10 px-3 rounded-xl border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none"
                value={form.subject}
                onChange={(e) => {
                  if (e.target.value === "new") {
                    setIsManualSubject(true);
                    setForm({ ...form, subject: "" });
                  } else {
                    setForm({ ...form, subject: e.target.value });
                  }
                }}
              >
                <option value="">Select Subject</option>
                {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="new" className="text-primary font-bold">+ Add New Subject</option>
              </select>
            ) : (
              <div className="relative">
                <Input className="rounded-xl pr-10 h-11 md:h-10 text-sm" placeholder="Type Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                <button onClick={() => setIsManualSubject(false)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500"><X className="h-4 w-4"/></button>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 ml-1">PDF File / URL</label>
            <div className="flex gap-2">
              <Input className="rounded-xl flex-1 text-xs h-11 md:h-10" placeholder="Paste link or upload" value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} />
              <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
              <Button variant="outline" type="button" className="rounded-xl shrink-0 border-slate-200 h-11 md:h-10 px-3" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button onClick={addOrUpdate} disabled={isUploading} className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20 h-11 md:h-10 w-full sm:w-auto order-1 sm:order-none">
            {isUploading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : editingId ? <Save className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {editingId ? "Update Material" : "Add to Library"}
          </Button>
          {editingId && (
            <Button variant="ghost" onClick={cancelEdit} className="rounded-xl px-6 text-slate-500 font-bold h-11 md:h-10 w-full sm:w-auto">
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
          )}
        </div>
      </div>


<div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-200 mb-6">

  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
    Rename Existing Class
  </h3>

  <div className="flex flex-col md:flex-row gap-3">

    {/* Old Class */}
    <select
      className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm"
      value={renameOldClass}
      onChange={(e) => setRenameOldClass(e.target.value)}
    >
      <option value="">Select Old Class</option>

      {availableClasses.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
    </select>

    {/* New Name */}
    <Input
      placeholder="New Class Name"
      value={renameNewClass}
      onChange={(e) => setRenameNewClass(e.target.value)}
      className="rounded-xl"
    />

    {/* Button */}
    <Button
      onClick={renameClassEverywhere}
      disabled={isRenaming}
      className="rounded-xl"
    >
      {isRenaming ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        "Rename"
      )}
    </Button>

  </div>

</div>


     <div className="space-y-4 pb-10">

  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">

    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">
      All Materials ({filteredList.length})
    </h3>

    <div className="flex flex-col gap-3 w-full md:w-auto">

      {/* Search */}
      <Input
        placeholder="Search by title, subject or class..."
        className="rounded-xl h-10 text-sm md:w-[280px]"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Class Filters */}
      <div className="flex flex-wrap gap-2">

        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setFilterClass("all");
              setFilterSubject("all");
            }}
            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
              filterClass === "all"
                ? "bg-white shadow-sm text-primary"
                : "text-slate-500"
            }`}
          >
            All Classes
          </button>

          {availableClasses.sort().map((c) => (
            <button
              key={c}
              onClick={() => {
                setFilterClass(c);
                setFilterSubject("all");
              }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                filterClass === c
                  ? "bg-white shadow-sm text-primary"
                  : "text-slate-500"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Subject Filters */}
        {filterClass !== "all" && (
          <div className="flex bg-blue-50 p-1 rounded-xl overflow-x-auto no-scrollbar border border-blue-100">

            <button
              onClick={() => setFilterSubject("all")}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                filterSubject === "all"
                  ? "bg-blue-600 text-white"
                  : "text-blue-600"
              }`}
            >
              All Subjects
            </button>

            {[
              ...new Set(
                materials
                  .filter((m) => m.student_class === filterClass)
                  .map((m) => m.subject)
              ),
            ].map((s) => (
              <button
                key={s}
                onClick={() => setFilterSubject(s)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                  filterSubject === s
                    ? "bg-blue-600 text-white"
                    : "text-blue-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  {filteredList.map((m) => (

          <div key={m.id} className="group flex flex-col md:flex-row md:items-center justify-between p-4 md:p-5 bg-white rounded-2xl border border-slate-200 hover:border-primary/40 transition-all shadow-sm gap-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                <FileText className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-800 text-sm md:text-base truncate">{m.title}</p>
                <div className="flex items-center gap-2 text-[11px] md:text-xs font-medium text-slate-400 mt-0.5">
                  <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold whitespace-nowrap">{m.student_class}</span>
                  <span className="hidden xs:inline">•</span>
                  <span className="truncate">{m.subject}</span>
                </div>
              </div>
            </div>

    <div className="flex items-center justify-between md:justify-end gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">

  {/* Action Buttons */}
  <div className="flex flex-wrap items-center gap-1">

    {/* Move Up */}
    <Button
      size="icon"
      variant="ghost"
      className="rounded-lg h-9 w-9 text-slate-400 hover:bg-blue-100 hover:text-blue-600"
     onClick={() => moveUp(m)}
    >
      <ArrowUp className="h-4 w-4" />
    </Button>

    {/* Move Down */}
    <Button
      size="icon"
      variant="ghost"
      className="rounded-lg h-9 w-9 text-slate-400 hover:bg-blue-100 hover:text-blue-600"
      onClick={() => moveDown(m)}
    >
      <ArrowDown className="h-4 w-4" />
    </Button>

    {/* Edit */}
    <Button
      size="icon"
      variant="ghost"
      className="rounded-lg h-9 w-9 text-slate-400 hover:bg-primary/10 hover:text-primary"
      onClick={() => startEdit(m)}
    >
      <Edit2 className="h-4 w-4" />
    </Button>

    {/* Delete */}
    <Button
      size="icon"
      variant="ghost"
      className="rounded-lg h-9 w-9 text-slate-400 hover:bg-destructive/10 hover:text-destructive"
      onClick={() => remove(m.id)}
    >
      <Trash2 className="h-4 w-4" />
    </Button>

  </div>

  {/* View File */}
  <Button
    variant="outline"
    size="sm"
    className="rounded-lg text-[11px] font-bold h-9 px-4"
    asChild
  >
    <a href={m.file_url} target="_blank" rel="noreferrer">
      View File
    </a>
  </Button>

</div>
          </div>
        ))}

       {filteredList.length === 0 && !isUploading && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm italic">No study materials found.</p>
          </div>
        )}
      </div>
    </div>
  );
}