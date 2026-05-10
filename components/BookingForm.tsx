'use client';
import React, { useState, useMemo } from 'react';
import { sendManualBookingRequest } from "@/actions/booking";

type ServiceType = 'Window Tint' | 'Ceramic Coating' | 'Paint Protection Film' | '';

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    year: '', make: '', model: '', service: '' as ServiceType,
    firstName: '', lastName: '', email: '', phone: '',
    date: '', timeSlot: ''
  });

  const availableSlots = useMemo(() => {
    if (!formData.date) return [];
    const [year, month, day] = formData.date.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    const dayOfWeek = date.getDay(); 
    
    if (dayOfWeek === 0) return []; // Sun closed

    const slots = [];
    const endHour = (dayOfWeek === 6) ? 15 : 17;
    const endMinute = (dayOfWeek === 6) ? 30 : 0;

    for (let hour = 9; hour <= endHour; hour++) {
      for (let min of [0, 30]) {
        if (hour === endHour && min > endMinute) break;
        const h = hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const time = `${h}:${min === 0 ? '00' : '30'} ${ampm}`;
        slots.push(time);
      }
    }
    return slots;
  }, [formData.date]);

  const handleFinalSubmit = async () => {
    if (!formData.timeSlot) return alert("Please select a time.");
    setLoading(true);
    const result = await sendManualBookingRequest(formData);
    if (result.success) {
      alert("Request Sent! I will contact you shortly to confirm.");
      window.location.reload();
    } else {
      alert("Error: " + result.error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 text-slate-900">
      {step === 1 && (
        <div className="space-y-3">
          <input className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Year" onChange={e => setFormData({...formData, year: e.target.value})} />
          <input className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Make" onChange={e => setFormData({...formData, make: e.target.value})} />
          <input className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Model" onChange={e => setFormData({...formData, model: e.target.value})} />
          <select className="w-full p-3 border rounded-lg bg-gray-50" onChange={e => setFormData({...formData, service: e.target.value as ServiceType})}>
            <option value="">Select Service</option>
            <option value="Window Tint">Window Tint</option>
            <option value="Ceramic Coating">Ceramic Coating</option>
            <option value="Paint Protection Film">Paint Protection Film</option>
          </select>
          <button disabled={!formData.service || !formData.model} onClick={() => setStep(2)} className="w-full bg-blue-600 text-white p-4 rounded-xl font-bold">Next</button>
        </div>
      )}
      {step === 2 && (
        <div className="space-y-3">
          <input className="w-full p-3 border rounded-lg bg-gray-50" placeholder="First Name" onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Email" onChange={e => setFormData({...formData, email: e.target.value})} />
          <input className="w-full p-3 border rounded-lg bg-gray-50" placeholder="Phone" onChange={e => setFormData({...formData, phone: e.target.value})} />
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="w-1/3 bg-gray-100 p-4 rounded-xl">Back</button>
            <button onClick={() => setStep(3)} className="w-2/3 bg-blue-600 text-white p-4 rounded-xl font-bold">Next</button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="space-y-3">
          <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full p-3 border rounded-lg bg-gray-50" onChange={e => setFormData({...formData, date: e.target.value})} />
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {availableSlots.map(time => (
              <button key={time} onClick={() => setFormData({...formData, timeSlot: time})} className={`p-2 text-xs border rounded-lg ${formData.timeSlot === time ? 'bg-blue-600 text-white' : 'bg-white'}`}>{time}</button>
            ))}
          </div>
          <button onClick={handleFinalSubmit} disabled={loading || !formData.timeSlot} className="w-full bg-green-600 text-white p-4 rounded-xl font-bold">
            {loading ? "Sending..." : "Confirm Request"}
          </button>
        </div>
      )}
    </div>
  );
}
