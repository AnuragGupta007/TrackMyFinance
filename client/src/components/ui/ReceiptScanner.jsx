import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { aiApi } from '../../services/api/ai.api';
import Button from './Button';

/**
 * Compress an image file to a max dimension and quality using canvas.
 * Returns { base64, mimeType }.
 */
const compressImage = (file, maxDim = 1024, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG for consistent output
        const base64 = canvas.toDataURL('image/jpeg', quality).split(',')[1];
        resolve({ base64, mimeType: 'image/jpeg' });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

const ReceiptScanner = ({ onResult, onClose }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const isRequesting = useRef(false);

  const handleFile = useCallback((f) => {
    if (!f) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!validTypes.includes(f.type) && !f.name.match(/\.(jpg|jpeg|png|webp|heic)$/i)) {
      setError('Please upload a valid image (JPEG, PNG, or WebP)');
      return;
    }

    if (f.size > 20 * 1024 * 1024) {
      setError('Image must be smaller than 20MB');
      return;
    }

    setFile(f);
    setError('');
    setResult(null);

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleScan = async () => {
    if (!file) return;
    if (isRequesting.current) return;
    isRequesting.current = true;
    setScanning(true);
    setError('');

    try {
      const { base64, mimeType } = await compressImage(file);

      const response = await aiApi.scanReceipt(base64, mimeType);
      const data = response.data;

      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to scan receipt. Please try again.');
    } finally {
      setScanning(false);
      isRequesting.current = false;
    }
  };

  const handleUseData = () => {
    if (result && onResult) {
      onResult(result);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const confidenceColors = {
    high: 'text-primary-500',
    medium: 'text-accent-500',
    low: 'text-expense-500',
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onClick={() => inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300
            ${dragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 scale-[1.02]'
              : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
            }`}
        >
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-colors ${
            dragActive ? 'bg-primary-100 dark:bg-primary-500/20' : 'bg-neutral-100 dark:bg-neutral-800'
          }`}>
            <Camera className={`w-7 h-7 ${dragActive ? 'text-primary-500' : 'text-neutral-400'}`} />
          </div>
          <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            {dragActive ? 'Drop your receipt here' : 'Upload a receipt photo'}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Drag & drop or click to browse • JPEG, PNG, WebP
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,.jpg,.jpeg,.png,.webp,.heic"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Image preview */}
          <div className="relative group">
            <img
              src={preview}
              alt="Receipt preview"
              className="w-full max-h-48 object-contain rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
            />
            <button
              onClick={clearFile}
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-neutral-900/60 text-white hover:bg-neutral-900/80 transition-colors opacity-0 group-hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scan button */}
          {!result && (
            <Button
              onClick={handleScan}
              disabled={scanning}
              className="w-full"
              icon={scanning ? Loader2 : Upload}
            >
              {scanning ? 'Scanning with AI...' : 'Scan Receipt'}
            </Button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-expense-50 dark:bg-expense-500/10 border border-expense-200 dark:border-expense-500/20">
          <AlertCircle className="w-4 h-4 text-expense-500 mt-0.5 shrink-0" />
          <p className="text-sm text-expense-600 dark:text-expense-400">{error}</p>
        </div>
      )}

      {/* Scan results */}
      {result && !result.error && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Receipt parsed successfully</span>
            <span className={`text-xs font-medium ${confidenceColors[result.confidence] || 'text-neutral-400'}`}>
              ({result.confidence} confidence)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {result.title && (
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Title</p>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">{result.title}</p>
              </div>
            )}
            {result.amount != null && (
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Amount</p>
                <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">₹{result.amount}</p>
              </div>
            )}
            {result.date && (
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Date</p>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{result.date}</p>
              </div>
            )}
            {result.category && (
              <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Category</p>
                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                  {result.categoryIcon && <span className="mr-1">{result.categoryIcon}</span>}
                  {result.category}
                </p>
              </div>
            )}
          </div>

          {result.notes && (
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/50">
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-0.5">Notes</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">{result.notes}</p>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={clearFile}>
              Scan Another
            </Button>
            <Button className="flex-1" onClick={handleUseData}>
              Use This Data
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiptScanner;
