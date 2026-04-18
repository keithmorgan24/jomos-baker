'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface UploadProps {
  onUploadSuccess: (url: string) => void;
  currentImage?: string;
}

export default function MenuImageUpload({ onUploadSuccess, currentImage }: UploadProps) {
  const [preview, setPreview] = useState(currentImage);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/menu/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.secure_url) {
        setPreview(data.secure_url);
        onUploadSuccess(data.secure_url);
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setLoading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`relative h-64 w-full rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden
          ${isDragActive ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <>
            <Image 
              src={preview} 
              alt="Preview" 
              fill 
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
              <Upload className="w-8 h-8 text-white mb-2" />
              <p className="text-white font-black text-[10px] uppercase tracking-widest">Change Image</p>
            </div>
          </>
        ) : (
          <div className="text-center p-6">
            <Upload className="w-10 h-10 text-zinc-700 mb-4 mx-auto" />
            <p className="text-zinc-400 font-bold text-xs uppercase tracking-tighter">
              Drag & Drop the <span className="text-zinc-100">Hero Shot</span>
            </p>
            <p className="text-zinc-600 text-[9px] mt-1 uppercase font-black">PNG, JPG up to 10MB</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}