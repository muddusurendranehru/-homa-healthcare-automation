// src/lib/openai.ts - OpenAI Configuration for Healthcare Content
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Healthcare Content Generation Service
export class HealthcareAI {
  
  // Generate Instagram health tips
  static async generateInstagramPost(topic: string, targetAudience?: string) {
    try {
      const prompt = `Create an engaging Instagram post for Homa Health Care about ${topic}. 
      ${targetAudience ? `Target audience: ${targetAudience}.` : ''}
      
      Requirements:
      - Professional but friendly tone
      - Include relevant health tips
      - Add appropriate hashtags
      - Keep it under 2000 characters
      - Include a call-to-action
      - Make it engaging and informative`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a professional healthcare content creator for Homa Health Care. Create engaging, accurate, and helpful medical content that follows medical best practices and disclaimers."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return {
        content: completion.choices[0].message.content,
        success: true
      };
    } catch (error) {
      console.error('Error generating Instagram post:', error);
      return {
        content: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Generate WhatsApp appointment reminders
  static async generateWhatsAppReminder(patientName: string, appointmentDate: string, doctorName: string) {
    try {
      const prompt = `Create a friendly WhatsApp appointment reminder message for:
      Patient: ${patientName}
      Appointment: ${appointmentDate}
      Doctor: ${doctorName}
      
      Requirements:
      - Friendly and professional tone
      - Include appointment details
      - Add preparation instructions if needed
      - Keep it concise (under 160 characters)
      - Include contact information for changes`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a healthcare assistant creating appointment reminder messages. Be professional, clear, and helpful."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.5,
      });

      return {
        content: completion.choices[0].message.content,
        success: true
      };
    } catch (error) {
      console.error('Error generating WhatsApp reminder:', error);
      return {
        content: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Generate Facebook health education posts
  static async generateFacebookPost(healthTopic: string, postType: 'educational' | 'awareness' | 'tips' = 'educational') {
    try {
      const prompt = `Create a ${postType} Facebook post for Homa Health Care about ${healthTopic}.
      
      Requirements:
      - Professional medical tone
      - Include accurate health information
      - Add relevant medical disclaimers
      - Engaging format with bullet points or numbered lists
      - Include call-to-action to book appointment
      - Add appropriate hashtags
      - 300-500 words maximum`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a medical content specialist creating educational content for a healthcare facility. Ensure all medical information is accurate and includes appropriate disclaimers."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 600,
        temperature: 0.6,
      });

      return {
        content: completion.choices[0].message.content,
        success: true
      };
    } catch (error) {
      console.error('Error generating Facebook post:', error);
      return {
        content: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Generate patient follow-up messages
  static async generateFollowUpMessage(patientName: string, treatmentType: string, daysSinceTreatment: number) {
    try {
      const prompt = `Create a personalized follow-up message for:
      Patient: ${patientName}
      Treatment: ${treatmentType}
      Days since treatment: ${daysSinceTreatment}
      
      Requirements:
      - Show care and concern for patient's recovery
      - Ask about current condition
      - Provide relevant post-treatment tips
      - Encourage contact if concerns
      - Professional but warm tone
      - 100-200 words`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a caring healthcare provider creating follow-up messages for patients. Show empathy and provide helpful guidance."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      return {
        content: completion.choices[0].message.content,
        success: true
      };
    } catch (error) {
      console.error('Error generating follow-up message:', error);
      return {
        content: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Generate health content based on seasonal trends
  static async generateSeasonalHealthContent(season: 'spring' | 'summer' | 'fall' | 'winter') {
    try {
      const seasonalTopics = {
        spring: 'allergies, seasonal depression recovery, spring cleaning for health',
        summer: 'heat safety, hydration, sun protection, vacation health tips',
        fall: 'flu prevention, back-to-school health, immune system boost',
        winter: 'cold prevention, vitamin D, seasonal depression, holiday health'
      };

      const prompt = `Create engaging healthcare content for ${season} season focusing on ${seasonalTopics[season]}.
      
      Requirements:
      - Multiple content pieces (3-4 topics)
      - Mix of prevention and treatment advice
      - Include seasonal health tips
      - Professional medical guidance
      - Engaging format for social media
      - Include relevant hashtags`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a healthcare marketing specialist creating seasonal health content. Provide accurate, helpful, and engaging medical information."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      });

      return {
        content: completion.choices[0].message.content,
        success: true
      };
    } catch (error) {
      console.error('Error generating seasonal content:', error);
      return {
        content: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Generate medical newsletter content
  static async generateNewsletterContent(month: string, healthTopics: string[]) {
    try {
      const prompt = `Create a monthly healthcare newsletter for ${month} covering these topics: ${healthTopics.join(', ')}.
      
      Requirements:
      - Professional newsletter format
      - Multiple sections with headers
      - Include health tips, news, and advice
      - Add patient testimonial placeholder
      - Include upcoming events section
      - Professional but accessible language
      - 800-1200 words`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a medical communications specialist creating newsletter content for Homa Health Care. Create comprehensive, well-structured content."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1500,
        temperature: 0.6,
      });

      return {
        content: completion.choices[0].message.content,
        success: true
      };
    } catch (error) {
      console.error('Error generating newsletter content:', error);
      return {
        content: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Quick health tip generator
  static async generateQuickHealthTip(category?: string) {
    try {
      const categories = category || 'general wellness';
      const prompt = `Generate a quick, actionable health tip about ${categories}.
      
      Requirements:
      - One clear, specific tip
      - 1-2 sentences maximum
      - Actionable advice
      - Medically accurate
      - Easy to understand`;

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a healthcare professional providing quick, accurate health tips."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 100,
        temperature: 0.5,
      });

      return {
        content: completion.choices[0].message.content,
        success: true
      };
    } catch (error) {
      console.error('Error generating health tip:', error);
      return {
        content: null,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Content Templates for Quick Generation
export const HealthcareTemplates = {
  appointmentReminder: {
    whatsapp: "Hi {patientName}! This is a reminder about your appointment with {doctorName} on {date} at {time}. Please arrive 15 minutes early. Reply CONFIRM to confirm or call us to reschedule. 🏥",
    sms: "Appointment reminder: {date} at {time} with {doctorName}. Arrive 15 min early. Call to reschedule. -Homa Health Care"
  },
  
  followUp: {
    day1: "Hi {patientName}, how are you feeling after your {treatment} yesterday? Please don't hesitate to call if you have any concerns. Rest well! 💙",
    week1: "Hi {patientName}, it's been a week since your {treatment}. How has your recovery been? We're here if you need anything. 🌟",
    month1: "Hi {patientName}, how are you doing a month after your {treatment}? We'd love to hear about your progress! 💚"
  },
  
  healthTips: {
    hydration: "💧 Stay hydrated! Aim for 8 glasses of water daily. Your body will thank you! #HealthyLiving #HomaHealthCare",
    exercise: "🏃‍♀️ Just 30 minutes of walking daily can boost your heart health significantly! Start small, dream big! #HeartHealth #Wellness",
    sleep: "😴 Quality sleep is medicine for your mind and body. Aim for 7-9 hours nightly for optimal health! #SleepWell #HealthTips"
  }
};

export default openai;