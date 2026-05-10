'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendManualBookingRequest(formData: any) {
  try {
    const { error } = await resend.emails.send({
      from: 'Supernova Tinting <onboarding@resend.dev>',
      // Note: Free Resend accounts only support sending to ONE string email at a time
      to: process.env.MY_EMAIL!,
      subject: `New Request: ${formData.service} - ${formData.firstName}`,
      html: `
        <div style="font-family: sans-serif; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 550px; color: #1e293b;">
          <h2 style="color: #2563eb; margin-top: 0;">New Appointment Request</h2>
          
          <div style="margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>Customer:</strong> ${formData.firstName} ${formData.lastName}</p>
            
            <!-- TAP TO CALL LINK -->
            <p style="margin: 5px 0;"><strong>Phone:</strong> 
              <a href="tel:${formData.phone}" style="color: #2563eb; text-decoration: none; font-weight: bold;">
                ${formData.phone} (Tap to Call)
              </a>
            </p>
            
            <p style="margin: 5px 0;"><strong>Email:</strong> ${formData.email}</p>
          </div>

          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 5px 0;"><strong>Vehicle:</strong> ${formData.year} ${formData.make} ${formData.model}</p>
            <p style="margin: 5px 0;"><strong>Service:</strong> ${formData.service}</p>
            <p style="margin: 5px 0;"><strong>Requested Time:</strong> ${formData.date} at ${formData.timeSlot}</p>
          </div>

          <!-- REPLY BUTTON -->
          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${formData.email}?subject=Confirming your ${formData.service} appointment" 
               style="background-color: #2563eb; color: #ffffff; padding: 14px 24px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">
              Reply via Email
            </a>
          </div>

          <p style="margin-top: 25px; font-size: 12px; color: #64748b; text-align: center;">
            This request was sent from the Supernova Tinting website.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Server Action Error:", error);
    return { success: false, error: error.message };
  }
}
