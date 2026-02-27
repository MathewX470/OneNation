const MiddleMenLog = require("../models/middleMenLog");
const Reports = require("../models/reportModel");
const logsMiddleMan = async (req, res) => {
    try{
        const logs = await MiddleMenLog.find();
        return res.status(200).json(logs);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Internal Server Error"})
    }
}



const forwardReport = async (req, res) => {
  try {
    const { reportId } = req.body;

    if (!reportId) {
      return res.status(400).json({ message: "Missing reportId" });
    }

    // Fetch original report
    const report = await UserReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Update status only
    report.status = "In Progress";
    await report.save();

    return res.status(200).json({ message: "Report forwarded successfully", report });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




module.exports = {logsMiddleMan, forWardReport}