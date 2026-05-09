'use server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendManualBookingRequest(formData: any) {
  try {
    const recipients = [process.env.MY_EMAIL!, process.env.SECOND_EMAIL!];

    const { error } = await resend.emails.send({
      // IMPORTANT: If you verify a domain, change this address
      from: 'Supernova Tinting <onboarding@resend.dev>',
      to: recipients,
      subject: `New Request: ${formData.service} - ${formData.firstName}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
          <h2 style="color: #2563eb; margin-bottom: 20px;">New Appointment Request</h2>
          
          <p><strong>Customer:</strong> ${formData.firstName} ${formData.lastName}</p>
          
          <!-- Direct Link to Call -->
          <p><strong>Phone:</strong> 
            <a href="tel:${formData.phone}" style="color: #2563eb; text-decoration: none; font-weight: bold;">
              ${formData.phone} (Tap to Call)
            </a>
          </p>
          
          <p><strong>Email:</strong> ${formData.email}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          
          <p><strong>Vehicle:</strong> ${formData.year} ${formData.make} ${formData.model}</p>
          <p><strong>Service:</strong> ${formData.service}</p>
          <p><strong>Preferred Time:</strong> ${formData.date} at ${formData.timeSlot}</p>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f8fafc; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">
              Review this request and contact the customer to confirm.
            </p>
          </div>
        </div>
      `,
    });

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Email Error:", error);
    return { success: false, error: error.message };
  }
}
