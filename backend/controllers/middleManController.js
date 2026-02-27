const MiddleMenLog = require("../models/middleMenLog");

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

module.exports = {logsMiddleMan}