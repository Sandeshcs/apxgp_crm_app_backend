//connection to db.
const {connectTODb} = require("./db/db.connect");
connectTODb();

//import models.
const LeadModel = require("./models/LeadModels");
const SalesAgent = require("./models/SalesAgentModel");
const Comment = require("./models/CommentModel");
const Tag = require("./models/TagModel");

//import and setup express.
const express = require("express");
const app = express();
const port = 3000;
app.use(express.json());
app.listen(3000, () => {
    console.log("server is running on, ", port);
});

//import and setup cors.
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const corsOrigin = {
    origin: "*",
    credential: true
}
app.use(cors(corsOrigin));

//sales agent model apis.
//api to create new sales agent.
const createNewSalesAgent = async (dataBody) => {
    try{
        const newSalesAgent = new SalesAgent(dataBody);
        const newSalesAgentSaved = await newSalesAgent.save();
        return newSalesAgentSaved;
    }
    catch (error) {
        console.log("error occured while creating new sales agent, ",error);
        throw error;
    }
}
app.post("/sales-agent", async (req, res) => {
    try{
        const newSalesAgent = await createNewSalesAgent(req.body);
        if(newSalesAgent){
            res.status(201).json({message: 'new sales agent created.', data: newSalesAgent});
        }else{
            res.status(404).json({message: "Data not found."});
        }
    }
    catch (error) {
        if(error.name === "ValidationError"){
            res.status(400).json({
                error: error.name,
                message: error.message,
                details: error.errors
            })
        }
        if(error.name === "ReferenceError"){
            res.status(500).json({
                error: error.name, 
                message: "Failed to create new sales agent - Internal server error",
                details: error.message
            });
        }
        if(error.name === "MongooseServerError"){
            res.status(400).json({
                error: error.name, 
                message: error.message,
                details: `${error.keyPattern} \n ${error.keyValue}`
            });
        }
    }
});

//api to get all sales agent.
const getAllSalesAgent = async () => {
    try{
        const allSalesAgentFound = await SalesAgent.find();
        //console.log(allSalesAgentFound);
        return allSalesAgentFound;
    }
    catch (error) {
        console.log("error occured while getting all sales agent, ",error);
        throw error;
    }
}
app.get("/sales-agent", async (req, res) => {
    try{
        const gotAllSalesAgent = await getAllSalesAgent();
        if(gotAllSalesAgent.length > 0){
            res.status(200).json({
                message: 'All sales agent found.', 
                data: gotAllSalesAgent
            });
        }else{
            res.status(404).json({message: "Data not found."});
        }
    }
    catch (error) {
        res.status(500).json({
            message: "failed to get all sales agent internal server error.", 
            details: error.name
        });
    }
});

//api to update a sales agent.
const updateASalesAgent = async (dataBody, leadId) => {
    try{
        const updatedLead = await SalesAgent.findByIdAndUpdate(leadId, dataBody, {new: true});
        const savedUpdate = await updatedLead.save();
        return savedUpdate;
    }
    catch (error) {
        console.log("error occured while updating a lead, ",error);
    }
}
app.post("/sales-agent/:salesAgentId", async (req, res) => {
    try{
        const updatedSalesAgent = await updateASalesAgent(req.body, req.params.salesAgentId);
        if(updatedSalesAgent){
           res.status(200).json({message: 'sales agent updated successfully.', data: updatedSalesAgent});
        }else{
            res.status(404).json({message: "Data not found."});
        }
    }
    catch (error) {
        res.status(500).json({message: "failed to update sales agent internal server error.", details: error});
    }
});

//api to delete a sales agent.
const deleteASalesAgent = async (salesAgentId) => {
    try{
        const salesAgentDeleted = await SalesAgent.findByIdAndDelete(salesAgentId);
        return salesAgentDeleted;
    }
    catch (error) {
        console.log("error occured while deleting a sales agent, ",error);
    }
}
app.delete("/sales-agent/:salesAgentId", async (req, res) => {
    try{
        const deletedSalesAgent = await deleteASalesAgent(req.params.salesAgentId);
        if(deletedSalesAgent){
            res.status(200).json({message: 'Sales agent deleted successfully.', data: deletedSalesAgent});
        }else{
            res.status(404).json({message: "Data not found."});
        }
    }
    catch (error) {
        res.status(500).json({message: "failed to delete a sales agent internal server error.", details: error});
    }
});

//lead model apis.
//api to create new lead.
const createNewLead = async (dataBody) => {
    try{
        const newLead = new LeadModel(dataBody);
        const newLeadSaved = await newLead.save();
        return newLeadSaved;
    }
    catch (error) {
        console.log("error occured while creating new lead, ",error);
        throw error;
    }
}

app.post("/leads", async (req, res) => {
    try{
        const gotNewLeads = await createNewLead(req.body);
        if(gotNewLeads){
            res.status(201).json({message: 'new lead created', data: gotNewLeads});
        }else{
            res.status(404).json({message: "Data not found."});
        }
    }
    catch (error) {
        if(error.name === "ValidationError"){
            res.status(400).json({
                error: error.name,
                message: error.message,
                details: error.errors
            })
        }
        if(error.name === "ReferenceError"){
            res.status(500).json({
                error: error.name, 
                message: "Failed to create new sales agent - Internal server error",
                details: error.message
            });
        }
    }
});

//api to get all leads.
const getAllLeads = async (filter = {}, sortByOptions = {}) => {
    // try{
    //     //console.log(filter, sortByOptions);
    //     let filteredData = LeadModel.find(filter);

    //     if(sortByOptions.field){
    //         filteredData = filteredData.sort({[sortByOptions.field]: sortByOptions.order});
    //     }

    //     filteredData = filteredData.populate("salesAgent");

    //     const allLeadsFound = await filteredData.exec();

    //     //const allLeadsFound = await LeadModel.find().populate("salesAgent");
    //     //console.log(allLeadsFound);
    //     return allLeadsFound;
    // }

    // aggregation pipeline when u have strings and u want to sort using this u can give number to string based on that it will sort.
    try {
        let aggregationPipeline = [];

        // Add initial filter if any
        if (Object.keys(filter).length > 0) {
            aggregationPipeline.push({ $match: filter });
        }

        if (sortByOptions.field === "priority") {
            // Add a temporary field for numerical priority
            aggregationPipeline.push({
                $addFields: {
                    priorityValue: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$priority", "High"] }, then: 3 },
                                { case: { $eq: ["$priority", "Medium"] }, then: 2 },
                                { case: { $eq: ["$priority", "Low"] }, then: 1 }
                            ],
                            default: 0 // Default for any other priority value
                        }
                    }
                }
            });
            // Sort by the numerical priority
            aggregationPipeline.push({
                $sort: { "priorityValue": sortByOptions.order }
            });
        } else if (sortByOptions.field) {
            // For other fields, direct sort
            aggregationPipeline.push({
                $sort: { [sortByOptions.field]: sortByOptions.order }
            });
        }

        // Project to remove the temporary priorityValue field if desired, and reshape the output
        // You might need to adjust this projection based on the exact fields you want in your final output.
        // For now, let's keep everything and just remove the temporary field.
        aggregationPipeline.push({
            $project: {
                priorityValue: 0 // Exclude the temporary field from the final output
                // Add back any other fields you explicitly want if you start picking specific fields
            }
        });

        aggregationPipeline.push({
            $lookup: {
                from: 'salesagents', // replace with your actual sales agent collection name
                localField: 'salesAgent',
                foreignField: '_id',
                as: 'salesAgent'
            }
        });
        aggregationPipeline.push({
            $unwind: {
                path: '$salesAgent',
                preserveNullAndEmptyArrays: true // Keep leads even if no sales agent is found
            }
        });

        const allLeadsFound = await LeadModel.aggregate(aggregationPipeline).exec();
        //console.log(allLeadsFound)
        return allLeadsFound;
    }

    catch (error) {
        console.log("error occured while getting all leads, ",error);
        throw error;
    }
};

app.get("/leads", async (req, res) => {
    try{
        const {status, salesAgent, priority, sortby, order} = req.query;

        let filter = {};
        let sortByOptions = {};

        //filter for status.
        if(status){
            filter.status = status;
        }
        
        //filter for sales agent.
        if(salesAgent){
            filter.salesAgent = new mongoose.Types.ObjectId(salesAgent);
        }

        //filter for priority.
        if(priority){
            filter.priority = priority;
        }
        
        //sort and order by priority.
        if(sortby === "priority"){
            sortByOptions.field = sortby;
            sortByOptions.order = order === "asc"? 1 : -1
        }

        //sort and order by time to closec.
        if(sortby === "timeToClose"){
            sortByOptions.field = sortby;
            sortByOptions.order = order === "asc"? 1 : -1
        }
        const gotAllLeads = await getAllLeads(filter, sortByOptions);
        const totalLeads = await LeadModel.countDocuments(filter);


        if(gotAllLeads.length > 0){
            res.status(200).json({
                message: 'All leads found.',
                total: totalLeads, 
                data: gotAllLeads
            });
        }else{
            res.status(404).json({message: "Data not found."});
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: "failed to get all leads internal server error.", details: error.name});
    }
});

//api to get one lead only.
const getOneLead = async (leadId) => {
    try{
        const leadFound = await LeadModel.findById(leadId).populate("salesAgent");
        return leadFound;
    }
    catch (error) {
        console.log("error occured while getting a lead, ",error);
    }
}
app.get("/leads/:leadId", async (req, res) => {
    try{
        const gotOneLead = await getOneLead(req.params.leadId);
        if(gotOneLead){
            res.status(200).json({message: 'All leads found.', data: gotOneLead});
        }else{
            res.status(404).json({message: "Data not found."});
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({message: "failed to get a lead internal server error.", details: error});
    }
});

//api to update a lead.
const updateALead = async (dataBody, leadId) => {
    try{
        const updatedLead = await LeadModel.findByIdAndUpdate(leadId, dataBody, {new: true}).populate("salesAgent");
        //console.log(updatedLead);
        return updatedLead;
    }
    catch (error) {
        console.log("error occured while updating a lead, ",error);
    }
}
app.post("/leads/:leadId", async (req, res) => {
    try{
        const gotUpdatedLead = await updateALead(req.body, req.params.leadId);
        if(gotUpdatedLead){
            res.status(200).json({message: 'lead updated successfully.', data: gotUpdatedLead});
        }else{
            res.status(404).json({message: "Data not found."});
        }
    }
    catch (error) {
        res.status(500).json({message: "failed to update lead internal server error.", details: error.errors});
    }
});

//api to delete a lead.
const deleteALead = async (leadId) => {
    try{
        const leadDeleted = await LeadModel.findByIdAndDelete(leadId).populate("salesAgent");
        return leadDeleted;
    }
    catch (error) {
        console.log("error occured while deleting a lead, ",error);
    }
}
app.delete("/leads/:leadId", async (req, res) => {
    try{
        const deletedLead = await deleteALead(req.params.leadId);
        if(deletedLead){
            res.status(200).json({message: 'Lead deleted successfully.', data: deletedLead});
        }else{
            res.status(404).json({message: "Data not found."});
        }
    }
    catch (error) {
        res.status(500).json({
            message: "failed to delete a lead internal server error.",
            details: error
        });
    }
});

//Comment model apis.
//api to create new comment.
const createNewComment = async (dataBody) => {
    try{
        const newComment = new Comment(dataBody);
        //console.log(newComment)
        const newCommentSaved = await newComment.save();
        return newCommentSaved;
    }
    catch (error) {
        console.log("error occured while creating new comment, ",error);
    }
}
app.post("/comments", async (req, res) => {
    try{
        const newComment = await createNewComment(req.body);
        if(newComment){
            res.status(201).json({message: 'new comment created.', data: newComment});
        }else{
            res.status(404).json({message: "Data not found."});
        }
    }
    catch (error) {
        res.status(500).json({message: "failed to create new comment internal server error.", details: error});
    }
});

//api to get all comments.
const getAllComments = async () => {
    try{
        const allCommentsFound = await Comment.find().populate("lead author");
        //console.log(allCommentsFound);
        return allCommentsFound;
    }
    catch (error) {
        console.log("error occured while getting all comments, ",error);
    }
}
app.get("/comments", async (req, res) => {
    try{
        const gotAllComments = await getAllComments();
        if(gotAllComments.length > 0){
            res.status(200).json({message: 'All comments found.', data: gotAllComments});
        }else{
            res.status(404).json({message: "Data not found."});
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({message: "failed to get all comments internal server error.", details: error});
    }
});

//api to update a comment.
const updateAComment = async (dataBody, commentId) => {
    try{
        const updatedComment = await Comment.findByIdAndUpdate(commentId, dataBody, {new: true}).populate("author lead");
        //console.log(updatedComment);
        return updatedComment;
    }
    catch (error) {
        console.log("error occured while updating a comment, ",error);
    }
}
app.post("/comments/:commentId", async (req, res) => {
    try{
        const gotUpdatedComment = await updateAComment(req.body, req.params.commentId);
        if(gotUpdatedComment){
            res.status(200).json({message: 'comment updated successfully.', data: gotUpdatedComment});
        }else{
            res.status(404).json({message: "Data not found."});
        }
    }
    catch (error) {
        res.status(500).json({message: "failed to update comment internal server error.", details: error.errors});
    }
});

//api to delete a comment.
const deleteAComment = async (commentId) => {
    try{
        const CommentDeleted = await Comment.findByIdAndDelete(commentId).populate("author lead");
        return CommentDeleted;
    }
    catch (error) {
        console.log("error occured while deleting a comment, ",error);
    }
}
app.delete("/comments/:commentId", async (req, res) => {
    try{
        const deletedComment = await deleteAComment(req.params.commentId);
        if(deletedComment){
            res.status(200).json({message: 'Comment deleted successfully.', data: deletedComment});
        }else{
            res.status(404).json({message: "Data not found."});
        }
    }
    catch (error) {
        res.status(500).json({
            message: "failed to delete a Comment internal server error.",
            details: error
        });
    }
});