import React, { useState } from 'react';
import { db } from '../utils/firebase';
import { collection, addDoc, Timestamp } from "firebase/firestore"; 

export default function BookingForm() {
  const [selectedDate, setSelectedDate] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) return alert("Please select a date!");

    setIsSending(true); // Locks button in "Sending"

    try {
      // Convert JS Date string to Firestore Timestamp
      const firestoreDate = Timestamp.fromDate(new Date(selectedDate));

      await addDoc(collection(db, "bookings"), {
        appointmentDate: firestoreDate,
        createdAt: Timestamp.now()
      });

      alert("Success! Your appointment is booked.");
      setSelectedDate(""); 
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Error: Server responded with a 502 or connection failed.");
    } finally {
      setIsSending(false); // ALWAYS unlocks the button, even on error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="datetime-local" 
        value={selectedDate} 
        onChange={(e) => setSelectedDate(e.target.value)} 
      />
      <button type="submit" disabled={isSending}>
        {isSending ? "Sending..." : "Confirm Booking"}
      </button>
    </form>
  );
}
