'use server';

import { db } from "@/utils/firebase"; // Your Firebase init file
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendManualBookingRequest(formData: any) {
  try {
    // 1. SAVE TO FIREBASE FIRST
    // This creates a permanent log of the request in your Firestore dashboard
    await addDoc(collection(db, "bookingRequests"), {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      vehicle: {
        year: formData.year,
        make: formData.make,
        model: formData.model,
      },
      service: formData.service,
      requestedTime: formData.date + " at " + formData.timeSlot,
      status: "pending", // You can update this to "confirmed" later in the dashboard
      createdAt: serverTimestamp(), // Uses Google's server clock for accuracy
    });

    // 2. SEND EMAIL NOTIFICATION
    const { error } = await resend.emails.send({
      from: 'Supernova Tinting <onboarding@resend.dev>',
      to: process.env.MY_EMAIL!,
      subject: `New Request: ${formData.service} - ${formData.firstName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px; max-width: 500px;">
          <h2 style="color: #2563eb;">New Appointment Request</h2>
          <p><strong>Customer:</strong> ${formData.firstName} ${formData.lastName}</p>
          <p><strong>Phone:</strong> <a href="tel:${formData.phone}">${formData.phone}</a></p>
          <p><strong>Vehicle:</strong> ${formData.year} ${formData.make} ${formData.model}</p>
          <p><strong>Time:</strong> ${formData.date} at ${formData.timeSlot}</p>
          <div style="margin-top: 20px; text-align: center;">
            <a href="mailto:${formData.email}?subject=Confirming your appointment" 
               style="background-color: #2563eb; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Reply via Email
            </a>
          </div>
        </div>
      `,
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Booking Error:", error);
    return { success: false, error: error.message };
  }
}
