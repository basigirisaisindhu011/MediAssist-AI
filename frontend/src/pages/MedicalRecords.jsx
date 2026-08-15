import { useState, useEffect } from 'react';
import medicalRecordService from '../services/medicalRecordService';
import {
  FolderOpen,
  Upload,
  Search,
  Trash2,
  Download,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Plus,
  Calendar,
  X
} from 'lucide-react';

export const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload Form State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [recordType, setRecordType] = useState('Lab Report');
  const [recordDate, setRecordDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileValidationError, setFileValidationError] = useState('');

  useEffect(() => {
    let isMounted = true;
    medicalRecordService.getRecords()
      .then((data) => {
        if (isMounted) {
          setRecords(data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Failed to fetch medical records vault.');
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, []);

  // Validation rules matching backend limits
  const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'txt', 'docx'];
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileValidationError('');
    setSelectedFile(null);

    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      setFileValidationError(
        `Invalid file type (.${ext}). Allowed types: PDF, JPG, PNG, TXT, DOCX.`
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileValidationError(
        `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds maximum allowed limit of 10 MB.`
      );
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setFileValidationError('Please select a valid document file.');
      return;
    }

    setUploading(true);
    setError(null);
    setActionSuccess('');

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append('recordType', recordType);
    formData.append('recordDate', recordDate);
    formData.append('description', description);

    try {
      await medicalRecordService.uploadRecord(formData);
      setActionSuccess('Medical record uploaded successfully!');
      setShowUploadModal(false);
      setTitle('');
      setDescription('');
      setSelectedFile(null);
      medicalRecordService.getRecords().then((data) => setRecords(data || []));
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.error || 'Failed to upload medical record.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this medical record?')) return;
    setError(null);
    setActionSuccess('');
    try {
      await medicalRecordService.deleteRecord(id);
      setActionSuccess('Record deleted successfully.');
      medicalRecordService.getRecords().then((data) => setRecords(data || []));
    } catch {
      setError('Failed to delete medical record.');
    }
  };

  const filteredRecords = records.filter(
    (r) =>
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.recordType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 bg-gradient-to-r from-indigo-600/90 via-sky-600/90 to-teal-600/90 text-white rounded-2xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Medical Document Vault
            </h1>
          </div>
          <p className="text-indigo-100 text-sm sm:text-base max-w-xl leading-relaxed">
            Upload, search, filter, and download your clinical lab tests, prescriptions, and health diagnostic history files securely.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3.5 rounded-xl bg-white text-indigo-700 font-extrabold hover:bg-sky-50 shadow-xl transition-all flex items-center justify-center space-x-2 shrink-0 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>Upload Document</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center space-x-2 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-lg p-6 sm:p-8 space-y-5 bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                <span>Upload Medical File</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {fileValidationError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fileValidationError}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fasting Lipid Profile 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-800/80 text-slate-100 focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-800/80 text-slate-100 focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="Lab Report">Lab Report</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Imaging Scan">Imaging Scan (X-Ray/MRI)</option>
                    <option value="Discharge Summary">Discharge Summary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Record Date
                  </label>
                  <input
                    type="date"
                    required
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-800/80 text-slate-100 focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Select File (Max 10MB: PDF, JPG, PNG, TXT, DOCX)
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png,.txt,.docx"
                  onChange={handleFileChange}
                  className="w-full p-2 rounded-xl border border-slate-800 bg-slate-800/80 text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Description / Clinical Context
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details..."
                  className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-800/80 text-slate-100 text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !!fileValidationError}
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-sky-500 hover:from-indigo-600 hover:to-sky-600 disabled:opacity-50 rounded-xl shadow-md flex items-center space-x-1.5"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <span>Start Upload</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="glass-card p-4 flex items-center space-x-3 border border-slate-800 rounded-2xl">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search records by title, category, or notes..."
          className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
        />
      </div>

      {/* Record Vault List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-2" />
          <p className="font-semibold text-sm animate-pulse">Loading medical vault...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="glass-card p-12 text-center border border-dashed border-slate-800">
          <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200">
            {searchQuery ? 'No matching documents' : 'Medical Vault Empty'}
          </h3>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? 'Try adjusting your search criteria.'
              : 'Upload your lab reports and prescriptions to keep them stored securely.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRecords.map((r) => (
            <div
              key={r.id}
              className="glass-card p-5 border border-slate-800 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-100">{r.title}</h3>
                      <span className="text-[11px] font-bold text-slate-400">
                        {r.recordType}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(r.id)}
                    title="Delete Record"
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {r.description && (
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {r.description}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-3">
                <span className="text-slate-400 flex items-center">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-sky-400" />
                  {r.recordDate}
                </span>
                {r.downloadUrl && (
                  <a
                    href={r.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 font-bold text-sky-400 hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
