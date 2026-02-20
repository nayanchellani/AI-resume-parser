import { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (uploadStatus === 'uploading') return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    validateAndSetFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    if (uploadStatus === 'uploading') return;
    
    const selectedFiles = Array.from(e.target.files);
    validateAndSetFiles(selectedFiles);
  };

  const validateAndSetFiles = (newFiles) => {
    const pdfFiles = newFiles.filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length !== newFiles.length) {
      setMessage('Only PDF files are allowed.');
    } else {
      setMessage('');
    }

    if (pdfFiles.length > 0) {
      setFiles(prev => [...prev, ...pdfFiles]);
      setUploadStatus('idle'); // Reset status on new files
    }
  };

  const removeFile = (index) => {
    if (uploadStatus === 'uploading') return;
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploadStatus('uploading');
    setMessage('');

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    // Dev: use Vite proxy to avoid CORS. Prod (Vercel): call n8n directly.
    const WEBHOOK_URL = import.meta.env.DEV
      ? '/api/n8n/webhook/resume-scanner'
      : 'https://nayan20.app.n8n.cloud/webhook/resume-scanner';

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('success');
        setMessage('Resumes uploaded successfully! Check the Google Sheet.');
        setFiles([]);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setMessage('Failed to upload resumes. Please check the Webhook URL or try again.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Resume Scanner</h1>
        <p>Drag & drop resumes to analyze with AI</p>
      </header>

      <main className="main-content">
        <div 
          className={`drop-zone ${uploadStatus === 'uploading' ? 'disabled' : ''}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileInput} 
            multiple 
            accept=".pdf" 
            style={{ display: 'none' }} 
          />
          
          <div className="drop-zone-content">
            <UploadCloud size={64} color="#48E5C2" />
            <h2>Drag Resumes Here (PDF)</h2>
            <p>or click to browse</p>
          </div>
        </div>

        {message && (
          <div className={`status-message ${uploadStatus}`}>
            {uploadStatus === 'success' && <CheckCircle size={20} />}
            {uploadStatus === 'error' && <XCircle size={20} />}
            <span>{message}</span>
          </div>
        )}

        {files.length > 0 && (
          <div className="file-list">
            <h3>Files to Upload ({files.length})</h3>
            <ul>
              {files.map((file, index) => (
                <li key={index} className="file-item">
                  <FileText size={16} />
                  <span className="file-name">{file.name}</span>
                  {uploadStatus !== 'uploading' && (
                    <button onClick={(e) => { e.stopPropagation(); removeFile(index); }}className="remove-btn">
                      <XCircle size={16} />
                    </button>
                  )}
                </li>
              ))}
            </ul>
            
            <button 
              className="upload-btn" 
              onClick={handleUpload}
              disabled={uploadStatus === 'uploading'}
            >
              {uploadStatus === 'uploading' ? (
                <>
                  <Loader2 className="spinner" size={20} />
                  Processing...
                </>
              ) : (
                'Analyze Resumes'
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
