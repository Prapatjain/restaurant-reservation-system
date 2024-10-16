const mongoose = require('mongoose');

const seatBookingSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true
  },
  phone:{
    type:Number,
    required:true
  },
  members:{
    type:String,
    required:true
  }
  ,
  seatNumber: {
    type: Number,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['booked', 'available'],
    default: 'available',
  },
  bookingTime: {
    type: Date,
  },
  expirationTime: {
    type: Date,
  },
});

const SeatBooking = mongoose.model('SeatBooking', seatBookingSchema);

module.exports = SeatBooking;