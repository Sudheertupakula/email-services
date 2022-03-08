const mongoose = require("mongoose");
const nodemailer = require('nodemailer');
const nodeschedule = require('node-schedule');
const email_services = require("../models/email_services");

const { ReE, ReS } = require('../util.services');

const scheduler = {}

async function save_email(request, res) {
    try{
        let object = new email_services(request);
        await object.save()
        return object
    }
    catch(err){
        throw err
    }
}

let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

async function generate_email(id) {
    mailInfo = await email_services.findById(id)
    let mailDetails = {
        from: mailInfo.from_email,
        to: mailInfo.to_email,
        subject: mailInfo.subject,
        text: mailInfo.content
    };
    return mailDetails
}

async function send_email(id) {
    let mailDetails = await generate_email(id)
    mailTransporter.sendMail(mailDetails, function (err) {
        if (err) {
            throw err
        } else {
            delete scheduler[request["_id"]] // deletes the schedule job from scheduler after executing
        }
    });
    return true

}

async function schedule(request, res) {
    try {
        scheduler[request["_id"]] = nodeschedule.scheduleJob(new Date(request.scheduled_time), () => send_email(request["_id"]));
        return scheduler[request["_id"]]
    }
    catch (err) {
        throw err
    }
}

module.exports.scheduleEmail = async (req, res) => {
    try {
        let email = await save_email(req.body, res)
        let schedule_email = await schedule(email, res)
        if (schedule_email) return ReS(res, { data: email, message: "successfully scheduled" })
        return ReE(res, "cannot schedule time in past")
    }
    catch (err) {
        return ReE(res, err.message)
    }

};

module.exports.readEmail = async (req, res) => {
    try {
        let email = await email_services.findById(req.params.id)
        if (email) {
            return ReS(res, { data: email, message: "success" })
        }
        else {
            return ReS(res, { data: email, message: "No data found" })
        }
    }
    catch (err) {
        return ReE(res, err.message);
    }
};

module.exports.emailList = async (req, res) => {
    try {
        let emails = await email_services.find({})
        return ReS(res, { data: emails, message: "success" })
    }
    catch (err) {
        return ReE(res, err.message)
    }
};

module.exports.deleteEmail = async (req, res) => {
    try {
        await email_services.deleteOne({ "_id": mongoose.Types.ObjectId(req.params.id) })
        scheduler[req.params.id] ? scheduler[req.params.id].cancel() : null
        delete scheduler[req.params.id]
        return ReS(res, { data: "Data Deleted successfully", message: "success" })
    }
    catch (err) {
        return ReE(res, err.message);
    }
};

async function reschedule(request, id) {
    if (scheduler[id]) {
        let reschedule = scheduler[id].reschedule(new Date(request.scheduled_time))
        if (reschedule) {
            return true
        }
        else {
            throw Error("cannot schedule in past")
        }
    }
}

module.exports.updateEmail = async (req, res) => {
    try {

        let { body, params } = req
        if (!body) {
            throw new Error('Validation error : body is required!');
        }
        body.lastUpdated = new Date();

        await email_services.updateOne(
            {
                _id: mongoose.Types.ObjectId(params.id),
            },
            {
                $set: body,
            },
        ).exec(); // updates in database

        await reschedule(body, params.id) // reschedules the email

        const email = await email_services.findById(params.id);
        return ReS(res, { data: email, message: "sucessfully updated" })
    } catch (err) {
        return ReE(res, err.message);
    }
};
