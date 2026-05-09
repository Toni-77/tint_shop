'use client';
import { useState } from 'react';
import { Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BookingForm from './BookingForm';

export default function BookingDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="bg-blue-600 text-white">
        <Play className="h-3 w-3 mr-1 fill-current" /> Book Appointment
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full p-6 shadow-xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Book Service</h2>
              <X className="cursor-pointer" onClick={() => setIsOpen(false)} />
            </div>
            <BookingForm />
          </div>
        </div>
      )}
    </>
  );
}
