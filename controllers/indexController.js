const Item = require('../models/listitem');
const Participant = require('../models/participant');
const moment = require('moment');
const mailer = require('../mailer/schedule');

module.exports.homeController = async function (req, res) {
  try {
    let toDoList = await Item.find({}).populate('participants');
    var offset = -5.5 * 3600000;
    var ans = [];
    toDoList.forEach(function (item) {
      var temp = {}
      var startTime = moment(item.startTime).utc().format();
      var endTime = moment(item.endTime).utc().format();
      delete temp.__v;
      temp.startTime = startTime
      temp.endTime = endTime
      temp._id = item._id
      temp.description = item.description
      ans.push(temp);
    })
    let participants = await Participant.find({});
    return res.render('home', {
      list: ans,
      participants: participants
    });
  } catch (err) {
    if (err) { console.log('error in printing list', err); return; }
  }
}

module.exports.getInfo = async (req, res) => {
  try {
    let info = await Item.findById(req.query.id).populate('participants');
    return res.status(200).json({
      data: info
    })
  } catch (err) {
    if (err) { console.log(err); return; }
  }
}

module.exports.createList = async function (req, res) {
  var startDate = req.body.date + "T" + req.body.start_time + "+05:30"
  startDate = new Date(startDate);
  var endDate = req.body.date + "T" + req.body.end_time + "+05:30"
  endDate = new Date(endDate);
  if (endDate.getTime() < startDate.getTime()) {
    req.flash('error', 'End time can not be before start time');
    res.redirect('back');
  }
  else if (typeof (req.body.pid) != 'object') {
    req.flash('error', 'Number of Participants less than 2')
    return res.redirect('back');
  } else {
    try {
      let item = await Item.findOne({
        $and: [{ participants: { $in: req.body.pid } }, {
          $or: [{
            $and: [{ startTime: { $lte: startDate } }, { $and: [{ endTime: { $gte: startDate } }, { endTime: { $lte: endDate } }] }]
          },
          {
            $and: [{ $and: [{ startTime: { $gte: startDate } }, { startTime: { $lte: endDate } }] }, { endTime: { $gte: endDate } }]
          },
          {
            $and: [{ startTime: { $gte: startDate } }, { endTime: { $lte: endDate } }]
          }]
        }]
      }
      );
      if (item) {
        req.flash('error', 'Time clash with one of the participants')
        return res.redirect('back');
      } else {
        Item.create({
          description: req.body.description,
          category: req.body.category,
          startTime: startDate,
          endTime: endDate,
          participants: req.body.pid
        }, async function (err, newItem) {
          if (err) {
            console.log('error in creating', err);
            return;
          }
          let interview = await Item.findById(newItem._id).populate('participants');
          for (let i = 0; i < interview.participants.length; i++) {
            let temp = {
              name: interview.participants[i].name,
              email: interview.participants[i].email,
              start: interview.startTime,
              end: interview.endTime
            }
            mailer.newInterview(temp)
          }
          req.flash('success', 'Interview Scheduled Successfully')
          return res.redirect('back');
        }
        )
      }
    } catch (err) {
      if (err) {
        console.log('error in creating', err);
        return res.redirect('back');
      }
    }
  }
}

module.exports.DeleteList = async function (req, res) {
  await Item.findByIdAndDelete(req.query.id)
  req.flash('success', 'Task Delete Successfuly')
  return res.redirect('/');
}

module.exports.addParticipant = async (req, res) => {
  try {
    await Participant.create({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email
    })
    return res.status(200).json({
      message: 'Participant Created'
    })
  } catch (err) {
    if (err) {
      console.log('error in creating', err);
      return res.status(500).json({
        message: 'Internal server error'
      });
    }
  }
}

module.exports.edit = async (req, res) => {
  var startDate = req.body.date + "T" + req.body.start_time + "+05:30"
  startDate = new Date(startDate);
  var endDate = req.body.date + "T" + req.body.end_time + "+05:30"
  endDate = new Date(endDate);
  if (endDate.getTime() < startDate.getTime()) {
    req.flash('error', 'End time can not be before start time');
    res.redirect('back');
  }
  else if (typeof (req.body.pid) != 'object') {
    req.flash('error', 'Number of Participants less than 2')
    return res.redirect('back');
  } else {
    try {
      let item = await Item.findOne({
        $and: [{ participants: { $in: req.body.pid } }, { _id: { $ne: req.query.id } }, {
          $or: [{
            $and: [{ startTime: { $lte: startDate } }, { $and: [{ endTime: { $gte: startDate } }, { endTime: { $lte: endDate } }] }]
          },
          {
            $and: [{ $and: [{ startTime: { $gte: startDate } }, { startTime: { $lte: endDate } }] }, { endTime: { $gte: endDate } }]
          },
          {
            $and: [{ startTime: { $gte: startDate } }, { endTime: { $lte: endDate } }]
          }]
        }]
      }
      );
      if (item) {
        req.flash('error', 'Time clash with one of the participants')
        return res.redirect('back');
      } else {
        await Item.findByIdAndUpdate(req.query.id, {
          description: req.body.description,
          category: req.body.category,
          startTime: startDate,
          endTime: endDate,
          participants: req.body.pid
        });
        req.flash('success', 'Record Updated')
        return res.redirect('back')
      }
    } catch (err) {
      if (err) {
        console.log('error in creating', err);
        return res.redirect('back');
      }
    }
  }
}