'use client';
import { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingForm from './BookingForm';

export default function BookingDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
      >
        <Play className="h-4 w-4 mr-2" />
        <span>Book Appointment</span>
      </Button>

      {/* The Overlay & Drawer Container */}
      <div className={`fixed inset-0 z-[9999] transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`}>
        
        {/* Backdrop (Darkens the background) */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsOpen(false)}
        />

        {/* The Slide-out Panel */}
        <div 
          className={`absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col h-full text-slate-900">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">New Appointment</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <BookingForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
