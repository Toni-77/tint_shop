'use server';
import { Resend } from 'resend';
import { db } from '@/utils/firebase'; // Ensure this path points to your admin/server-side config
import { collection, addDoc, Timestamp } from "firebase/firestore";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendManualBookingRequest(formData: any) {
  try {
    // 1. Save to Firestore First
    // Using Server-side write to ensure it happens before the email
    await addDoc(collection(db, "bookings"), {
      ...formData,
      createdAt: Timestamp.now(),
      appointmentDate: Timestamp.fromDate(new Date(`${formData.date} ${formData.timeSlot}`))
    });

    // 2. Trigger Email Notification via Resend
    const { error } = await resend.emails.send({
      from: 'Booking System <onboarding@resend.dev>', // Update if you have a verified domain
      to: ['your-email@example.com'], // The email where you want alerts
      replyTo: formData.email, // Allows direct reply to customer
      subject: `New Booking: ${formData.firstName} ${formData.lastName}`,
      html: `
        <div style="font-family: sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2563eb;">New Appointment Request</h2>
          <p><strong>Customer:</strong> ${formData.firstName} ${formData.lastName}</p>
          <p><strong>Vehicle:</strong> ${formData.year} ${formData.make} ${formData.model}</p>
          <p><strong>Service:</strong> ${formData.service}</p>
          <p><strong>Date:</strong> ${formData.date} at ${formData.timeSlot}</p>
          
          <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 8px;">
            <p style="margin: 0;"><strong>Phone:</strong> <a href="tel:${formData.phone}">${formData.phone}</a> (Click to call)</p>
            <p style="margin: 5px 0 0 0;"><strong>Email:</strong> <a href="mailto:${formData.email}">${formData.email}</a></p>
          </div>
          <p style="font-size: 12px; color: #666; margin-top: 15px;">Tip: Just hit 'Reply' to email the customer back directly.</p>
        </div>
      `,
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Booking Error:", error);
    return { success: false, error: error.message || "Failed to process booking" };
  }
}
