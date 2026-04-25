const pdfParse = require("pdf-parse");
const {
  generateInterviewReport,
  genrateresumePdf,
} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

exports.generateInterViewReportController = async (req, res) => {
  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();
  const { selfDescription, jobDescription } = req.body;

  const interViewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    title: jobDescription?.split("\n")[0] || "Job Title",
    ...interViewReportByAi,
  });
  res.status(201).json({
    message: "Interview report generated successfully",
    interviewReport,
  });
};

exports.getInterviewReportByIdController = async (req, res) => {
  const { interviewId } = req.params;
  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id,
  });
  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }
  return res.status(200).json({
    message: "Interview report fetched successfully",
    interviewReport,
  });
};

exports.getAllInterviewReportsController = async (req, res) => {
  const interviewReports = await interviewReportModel
    .find({
      user: req.user.id,
    })
    .sort({ createdAt: -1 })
    .select(
      "-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan",
    );
  res.status(200).json({
    message: "Interview reports fetched successfully",
    interviewReports,
  });
};

exports.generateResumePdfController = async (req, res) => {
  const { interviewReportId } = req.params;
  const interviewReport =
    await interviewReportModel.findById(interviewReportId);
  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found",
    });
  }
  const { resume, jobDescription, selfDescription } = interviewReport;
  const pdfBuffer = await genrateresumePdf({
    resume,
    jobDescription,
    selfDescription,
  });

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachments:filename=resume_${interviewReportId}.pdf`,
  });
  res.send(pdfBuffer);
};
