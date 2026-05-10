'use client';
import { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingForm from './BookingForm';

export default function BookingDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      {/* TRIGGER BUTTON */}
      <Button
        onClick={() => setIsOpen(true)}
        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium h-10 px-4 z-10"
      >
        <Play className="h-3 w-3 mr-2 fill-current" />
        Book Appointment
      </Button>

      {/* DRAWER SYSTEM - z-[100] ensures it is on top of everything */}
      <div className={`fixed inset-0 z-[100] ${isOpen ? 'visible' : 'invisible'}`}>
        
        {/* Dark Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Sliding Panel */}
        <div 
          className={`absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-in-out transform ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gray-50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">New Appointment</h2>
                <p className="text-sm text-slate-500">Vehicle & Service Details</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors text-slate-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Form Content Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-white">
              <BookingForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
