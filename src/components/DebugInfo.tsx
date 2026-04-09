'use client';
import { useEffect, useState } from 'react';

export default function DebugInfo() {
  const [debug, setDebug] = useState({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    cloudinaryCloud: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✅ Set' : '❌ Missing',
    cloudinaryPreset: process.env.NEXT_PUBLIC_CLOUDINARY_PRESET ? '✅ Set' : '❌ Missing',
    cloudinaryScript: false,
  });

  useEffect(() => {
    console.log('🔍 DEBUG INFO:');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'MISSING');
    console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'MISSING');
    console.log('Cloudinary Cloud:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? 'Present' : 'MISSING');
    console.log('Cloudinary Preset:', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET ? 'Present' : 'MISSING');
    
    // Check if Cloudinary script loaded
    const hasCloudinary = !!(window as any).cloudinary;
    console.log('Cloudinary Script Loaded:', hasCloudinary);
    
    setDebug(prev => ({ ...prev, cloudinaryScript: hasCloudinary }));
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-xs z-50 font-mono">
      <div className="font-bold mb-2">🐛 DEBUG:</div>
      <div>Supabase URL: {debug.supabaseUrl}</div>
      <div>Supabase Key: {debug.supabaseKey}</div>
      <div>Cloudinary Cloud: {debug.cloudinaryCloud}</div>
      <div>Cloudinary Preset: {debug.cloudinaryPreset}</div>
      <div>Cloudinary Script: {debug.cloudinaryScript ? '✅ Loaded' : '❌ Not Loaded'}</div>
    </div>
  );
    }
