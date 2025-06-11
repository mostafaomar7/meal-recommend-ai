// src/app/services/ai.ts
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HfInference } from '@huggingface/inference';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService { // تأكد من أن اسم الكلاس هو نفسه في ملفك
  private hf: HfInference;

  constructor() {
    this.hf = new HfInference(environment.huggingFaceApiKey);
  }

  async getRecipeRecommendations(preferences: string): Promise<string[]> {
    try {
      // 1. الدالة تغيرت: من conversational إلى chatCompletion
      const response = await this.hf.chatCompletion({
        model: 'google/gemma-2b-it',
        messages: [
          { role: 'user', content: `Given these preferences: ${preferences}, suggest three creative recipe ideas in a list format.` }
        ],
        max_tokens: 250, // 2. اسم المعلمة تغير: من max_new_tokens إلى max_tokens
      });

      // 3. طريقة استخلاص الإجابة تغيرت بالكامل لتناسب الهيكل الجديد
      const generatedText = response.choices[0].message.content;

      // التأكد من أن النص ليس فارغاً أو null
      if (!generatedText) {
        return [];
      }
      
      return this.processRecommendations(generatedText);

    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      throw error;
    }
  }

  private processRecommendations(text: string): string[] {
    return text
      .split('\n')
      .map(rec => rec.trim().replace(/^\*|\d+\.\s*/, '').trim())
      .filter(rec => rec.length > 5);
  }
}