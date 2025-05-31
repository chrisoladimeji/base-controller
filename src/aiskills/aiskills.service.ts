// src/aiskills/aiskills.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { SisService } from '../sis/sis.service';
import { CourseService } from '../courses/course.service'; 
import { TranscriptDto } from '../dtos/transcript.dto';

@Injectable()
export class AiSkillsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly sisService: SisService,
    private readonly courseService: CourseService 
  ) {}

  private formatTranscript(transcript: any): string {
    let terms = transcript.terms;

    if (typeof terms === "string") {
      try {
        terms = JSON.parse(terms);
      } catch (error) {
        console.error("Failed to parse transcript terms:", error);
        return "\nInvalid terms format.";
      }
    }

    if (!Array.isArray(terms)) {
      return "\nNo terms or courses found.";
    }

    const courseBlocks = terms
      .map((term: any) => {
        if (!Array.isArray(term.courses)) {
          return `\nNo courses found for term ${term.termYear}.`;
        }

        return term.courses
          .map((course: any) => {
            const courseInfo = this.courseService.getCourseInfo(
              course.courseTitle,
              course.courseCode
            );

            if (courseInfo.error) {
              return ` 
                Course Title: ${course.courseTitle}
                Course Code: ${course.courseCode}
                Error: ${courseInfo.error}
              `;
            }

            // Updated property names here:
            const techSkills = Array.isArray(courseInfo.techAndTools)
              ? courseInfo.techAndTools.join(", ")
              : "None";

            const skills = Array.isArray(courseInfo.skills)
              ? courseInfo.skills.join(", ")
              : "None";

            const abilities = Array.isArray(courseInfo.abilities)
              ? courseInfo.abilities.join(", ")
              : "None";

            const knowledge = Array.isArray(courseInfo.knowledge)
              ? courseInfo.knowledge.join(", ")
              : "None";

            return `
              Course Title: ${course.courseTitle}
              Course Code: ${course.courseCode}
              Description: ${courseInfo.description}
              University: ${courseInfo.university}

              ||Predicted Technical Skills||: ${techSkills}
              ||Predicted Skills||: ${skills}
              ||Predicted Abilities||: ${abilities}
              ||Predicted Knowledge||: ${knowledge}
            `;
        })
        .join("\n");
    })
    .join("\n");

  return courseBlocks;
  }


  async getTranscriptAndSendToAI(studentNumber: string): Promise<string> {
    console.log(`Fetching transcript for student number: ${studentNumber}`);

    const transcript: TranscriptDto = await this.sisService.getStudentTranscript(studentNumber);
    if (!transcript) {
      throw new Error('Transcript not found');
    }

    // Format the transcript using the formatTranscript method
    const transcriptFormatted = this.formatTranscript(transcript);
    const prompt = `${transcriptFormatted}`;

    
    console.log("\n=== GENERATED PROMPT ===");
    console.log(prompt);
    console.log("=== END OF PROMPT ===\n");
    

    // analytical responce
    const response = await this.sendPromptToOpenAI(prompt);

    console.log("\n=== GENERATED ANALYTICAL RESPONCE ===");
    console.log(response);
    console.log("=== END OF ANALYTICAL RESPONCE ===\n");

    // JSON formating responce
    const jsonSchema = {
      type: "object",
      properties: {
        "Abilities": {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              afiliated_courses: {type: "array", items: { type: "string" }},
              level: { type: "integer" }
            },
            required: ["name", "afiliated_courses", "level"]
          }
        },
        "Tech and Tools": {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              afiliated_courses: {type: "array", items: { type: "string" }},
              level: { type: "integer" }
            },
            required: ["name", "afiliated_courses", "level"]
          }
        },
        "Skills": {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              afiliated_courses: {type: "array", items: { type: "string" }},
              level: { type: "integer" }
            },
            required: ["name", "afiliated_courses", "level"]
          }
        },
        "Knowledge": {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              afiliated_courses: {type: "array", items: { type: "string" }},
              level: { type: "integer" }
            },
            required: ["name", "afiliated_courses", "level"]
          }
        }
      },
      required: ["Abilities", "Tech and Tools", "Skills", "Knowledge"]
    };


    const json_prompt = `
      Hello there, I have an analytical responce from another ChatGPT, what I need you to do is to retrieve the '5. Final List' and put the listed Abilities, Tech and tools, Skills, and Knowledge into the coresponding JSON structure which will also be provided to you.
      That list also has some additional information, such as the affiliated_courses in [], and the Level, which must also be added to the given JSON scheme. 

      This is the ChatGPTS responce I would like you to retrieve the '5. Final List' from:
      ${response}
    `;

    const json_responce = await this.sendJsonSchemaRequest(json_prompt, jsonSchema);

    console.log("\n=== GENERATED ANALYTICAL RESPONCE ===");
    console.log(json_responce);
    console.log("=== END OF ANALYTICAL RESPONCE ===\n");
    

    return json_responce;
  }

  //
  // Sending the prompt to openai for analytical analysis
  //
  private async sendPromptToOpenAI(prompt: string): Promise<string> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const openaiUrl = 'https://api.openai.com/v1/chat/completions';

    let depth: number = 2; // Select the depth of analysis which will be outputed (1, 2, 3)
    let depthPrompt: string = "";

    if (depth === 1) {
      depthPrompt = "(Abilities: 5, Tech and Tools: 3, Skills: 3, and Knowledge: 3)";
    } else if (depth === 2) {
      depthPrompt = "(Abilities: 10, Tech and Tools: 6, Skills: 5, and Knowledge: 5)";
    } else if (depth === 3) {
      depthPrompt = "(Abilities: 25, Tech and Tools: 9, Skills: 6, and Knowledge: 6)";
    } else {
      depthPrompt = "(Abilities: 5, Tech and Tools: 3, Skills: 3, and Knowledge: 3)"; // default
    }

    const response = await lastValueFrom(
      this.httpService.post(
        openaiUrl,
        {
          model: "gpt-4.1-mini",
          messages: [{ role: 'system', content: `
          
            You work in a high school education environment, specifically  you specialize in understand which skills, technology, and knowledge students gain from completing specific high school courses. Your main objective today is taking in student transcripts and listing the abilities, tech and tools, skills, and knowledge, of the student, assuming they have completed all courses and retained knowledge from them. 
            It must be clarified that we only have the description of the course, and nothing else. This means that many decisions you will be making are *educational approximations*, therefore, assumptions are acceptable, but must be justified with solid evidence from a courses description. 
            To make the job easier we have already pre-selected a list of "matches" eg.(Abilities, Tech and Tools, Skills, and Knowledge) student gain for *individual* courses. Those matches are also assumptions, we have tried our best to select the most fitting ones.
            Here is you task. Given a students full transcript (usually 12-24 courses) which includes the courses' titles, descriptions, and matches, you must create a *sophisticated* and *justifiable* list of (Abilities, Tech and Tools, Skills, and Knowledge) which the student is *most likely* to have. Key point! Your job here is to have the grand view of the student, and their interests, you must recognize that these courses are interconnected and will require deep analysis.  
            Another key point!! You must recognize that your job is the grand view, therefore reflection is a key step here, please follow this protocol.

            ### 1, objective
            At the beginning, state your objective and what you are trying to achieve. Recognize that your goal is the grand view of all courses the student has completed.
            ### 2, first look
            At the first look write a sentence about what you think the student is passionate about, try to understand who they are. If there is no clear pattern, say so, some students are still lost and haven't decided a career direction. 
            ### 3, analysis
            For each courses, list the (Abilities, Tech and Tools, Skills, and Knowledge) and describe how they connect to the students vision and the course. After wards, estimate the level of familiarity and/or experience the student would have with a given (Abilities, Tech and Tools, Skills, and Knowledge) on a scale of 1/10, justify it.
            ### 4, interconnection
            Recognize that education is a complex system, when a student is taught multiple courses their knowledge may interconnect and mix. Analyze each course and try to understand whether any course fit with other, if so, what other (Abilities, Tech and Tools, Skills, and Knowledge) might the student gain from the two when combined
            ### 5, final decision
            Remember, that you have a specific *max* limit of (Abilities, Tech and Tools, Skills, and Knowledge) you may list, it goes as follows ${depthPrompt}, therefore, choose wisely. In a case where there is less skills than the given value do not make up skills, leave it.

            Print out your final selections in a neat list with headings (Abilities, Tech and Tools, Skills, and Knowledge). We require your output to be in a specific format and have specific additional information, apart from simply the name of the skills. Please follow this template.

            This is your template, change anything in {}, but anything outside, do not change.
            {Category}
            x. {Skill Name}
            [{list the courses which attribute to the skills}] [Level: {the 1/10 scale of familiarity you provided in the analysis}]

            Finally, the user will provide you with the transcript, it will be in a JSON format.
            
          `}, { role: 'user', content: prompt }]
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      )
    );

    const result = response.data.choices[0].message.content;
    console.log("OpenAI response:", result);
    return result;
  }

  //
  // Sending the prompt to openai to convert into
  //
  private async sendJsonSchemaRequest(prompt: string, jsonSchema: object): Promise<any> {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    const openaiUrl = 'https://api.openai.com/v1/chat/completions';

    const response = await lastValueFrom(
      this.httpService.post(
        openaiUrl,
        {
          model: "gpt-4.1-mini",
          messages: [
            { role: 'system', content: "You are a helpful assistant which helps transfar the user inputs into JSON structure responces, based on the users request." },
            { role: 'user', content: prompt }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              strict: true,
              name: "CourseInfo",
              schema: jsonSchema
            }
          }
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      )
    );

    const result = response.data.choices[0].message.content;
    return JSON.parse(result);
  }
}