const { GoogleGenAI } = require("@google/genai");
// const puppeteer = require("puppeteer");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = {
  type: "object",
  properties: {
    matchScore: {
      type: "number",
      description:
        "A score between 0 and 100 indicating how well the candidate matches the job",
    },
    title: {
      type: "string",
      description: "The job title only, e.g. Junior Software Developer",
    },
    technicalQuestions: {
      type: "array",
      description:
        "At least 8 real technical questions tailored to the candidate",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The technical interview question",
          },
          intention: {
            type: "string",
            description: "Why the interviewer is asking this",
          },
          answer: {
            type: "string",
            description: "How to answer this question with key points",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    behavioralQuestions: {
      type: "array",
      description:
        "At least 5 real behavioral questions tailored to the candidate",
      items: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The behavioral interview question",
          },
          intention: {
            type: "string",
            description: "Why the interviewer is asking this",
          },
          answer: {
            type: "string",
            description: "How to answer using the STAR method",
          },
        },
        required: ["question", "intention", "answer"],
      },
    },
    skillGaps: {
      type: "array",
      description:
        "Real skill gaps found by comparing resume to job requirements",
      items: {
        type: "object",
        properties: {
          skill: {
            type: "string",
            description: "The specific skill the candidate is lacking",
          },
          severity: {
            type: "string",
            enum: ["low", "medium", "high"],
            description: "How critical this gap is",
          },
        },
        required: ["skill", "severity"],
      },
    },
    preparationPlan: {
      type: "array",
      description:
        "Day-wise preparation plan scaled by matchScore: 80-100 = 3-5 days, 50-79 = 7-10 days, below 50 = 12-15 days",
      items: {
        type: "object",
        properties: {
          day: {
            type: "number",
            description:
              "Sequential day number starting from 1, must be unique",
          },
          focus: {
            type: "string",
            description: "The specific topic to focus on this day",
          },
          tasks: {
            type: "array",
            description: "2 to 4 specific actionable tasks for this day",
            items: { type: "string" },
          },
        },
        required: ["day", "focus", "tasks"],
      },
    },
  },
  required: [
    "matchScore",
    "title",
    "technicalQuestions",
    "behavioralQuestions",
    "skillGaps",
    "preparationPlan",
  ],
};

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert technical interviewer and career coach. Generate a detailed, personalized interview preparation report.

IMPORTANT: Return ONLY real, specific content based on the resume and job description below. No placeholder text.

============================
OUTPUT FORMAT WITH EXAMPLES
============================

technicalQuestions (minimum 8 items):
[
  {
    "question": "How does the virtual DOM work in React, and how did you use it in your Myntra Clone?",
    "intention": "To check if the candidate understands React internals and can connect theory to their project",
    "answer": "Explain that React creates a lightweight copy of the real DOM. When state changes, React diffs the virtual DOM and only updates changed nodes. Relate this to your Myntra Clone by describing how re-renders were triggered on filter or search changes."
  },
  {
    "question": "Explain how Redux Toolkit manages state. How did you use it in your projects?",
    "intention": "To verify hands-on Redux experience mentioned in the resume",
    "answer": "Explain createSlice, configureStore, and useSelector/useDispatch hooks. Describe how you used Redux Toolkit in the Myntra Clone for cart or filter state management."
  }
]

behavioralQuestions (minimum 5 items):
[
  {
    "question": "Tell me about a challenging bug you faced in one of your projects and how you resolved it.",
    "intention": "To assess debugging skills, persistence, and problem-solving approach",
    "answer": "Use STAR method. Situation: describe the project. Task: what was broken. Action: how you debugged step by step. Result: what you fixed and what you learned."
  }
]

skillGaps:
[
  { "skill": "Node.js and backend development", "severity": "high" },
  { "skill": "SQL or NoSQL database usage", "severity": "high" },
  { "skill": "Git and version control", "severity": "medium" }
]

preparationPlan (days must be sequential 1, 2, 3...):
[
  {
    "day": 1,
    "focus": "Node.js fundamentals and REST API design",
    "tasks": [
      "Complete Node.js crash course on freeCodeCamp",
      "Build a simple Express server with 3 REST endpoints",
      "Read about HTTP methods: GET, POST, PUT, DELETE"
    ]
  },
  {
    "day": 2,
    "focus": "Database basics with MongoDB",
    "tasks": [
      "Install MongoDB and practice CRUD operations",
      "Connect MongoDB to Express server using Mongoose",
      "Read about when to use NoSQL vs SQL"
    ]
  }
]

============================
RULES
============================
1. Every question, skill, and task must be specific to this candidate and this job
2. preparationPlan days must be sequential: 1, 2, 3... never repeat the same number
3. Scale preparationPlan by matchScore: 80-100 = 3-5 days, 50-79 = 7-10 days, below 50 = 12-15 days
4. title must be the job title only e.g. "Junior Software Developer"
5. matchScore must reflect actual alignment between resume and job description

============================
CANDIDATE DATA
============================

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: interviewReportSchema,
    },
  });

  const raw = JSON.parse(response.text);

  const normalizeArray = (arr) => {
    if (!Array.isArray(arr)) return [];
    return arr.filter((item) => typeof item === "object" && item !== null);
  };

  return {
    ...raw,
    technicalQuestions: normalizeArray(raw.technicalQuestions),
    behavioralQuestions: normalizeArray(raw.behavioralQuestions),
    skillGaps: normalizeArray(raw.skillGaps),
    preparationPlan: normalizeArray(raw.preparationPlan).map((item, index) => ({
      ...item,
      day: index + 1,
      tasks: Array.isArray(item.tasks)
        ? item.tasks
        : [String(item.tasks)].filter(Boolean),
    })),
  };
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath(),
  headless: chromium.headless,
});
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });
  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });
  await browser.close();
  return pdfBuffer;
}

async function genrateresumePdf({ resume, selfDescription, jobDescription }) {
  const resumepdfSchema = z.object({
    html: z
      .string()
      .describe(
        "The HTML content of the resume which can be converted to PDF using any liberary like puppeteer",
      ),
  });
  const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(resumepdfSchema),
    },
  });
  const jsonContent = JSON.parse(response.text);
  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
  return pdfBuffer;
}
module.exports = { generateInterviewReport, genrateresumePdf };
