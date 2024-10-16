const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");
const adminData = require("./adminAuth");
const exp = require("constants");
const SeatBooking = require("./booking");
const dialog = require('dialog');
const mailreq = require("./sendMail");

const tableLen=1;

const app = express();
//convert data into json format
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
//static file
app.use(express.static("public"));
app.use(express.static("assets"));

// app.get('/',(req,res)=>{
//     res.render("login")
// });

const cron = require("node-cron");
const { table } = require("console");

// Schedule a task to run every minute
cron.schedule("* * * * *", async () => {
  const expiredSeats = await SeatBooking.find({
    status: "booked",
    expirationTime: { $lt: new Date() }, // Find seats whose expiration time is less than the current time
  });

  if (expiredSeats.length > 0) {
    for (const seat of expiredSeats) {
      seat.status = "available";
      seat.expirationTime = null;
      await seat.save();
    }
  }
});
app.get("/", (req, res) => {
  res.render("home-page");
});

app.get("/adminSignup",(req,res)=>{
  res.render("adminSignup");
})

app.get("/adminLogin",(req,res)=>{
  res.render("adminLogin");
})

app.get("/tableEntry",(req,res)=>{
  res.render("allTable");
})

app.get("/signup", (req, res) => {
  res.render("signup");
});
//...
app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/tableEntry",async(req,res)=>{
  try{

    var tableLen=req.body.entry;
    dialog.info("NO. of tables: "+tableLen, 'Alert', () => {
      console.log('Alert dialog closed');
    });
    
    res.render("home-page.ejs");
  }
  catch(err){
    res.status(500).json(err);
  }
})

app.post("/adminSignup",async(req,res)=>{

  const data = {
    name: req.body.username,
    password: req.body.password,
    key:req.body.key
  };
  if(data.key!="hiithere"){
    res.send("<h1>Wrong KEY! Contact to the developer</h1>");
  }
  // if user already exist in database
  const existinguser = await adminData.findOne({ name: data.name });
  if (existinguser) {
    console.log(existinguser);
    res.send("User already exist. Please choose different username");
  } else {
    //hash the password
    const saltRounds = 10; // no. of salt Round for bcrypt
    const hashPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashPassword; // replace the hash pass. with original pass.

    const userdata = await adminData.insertMany(data);
    console.log(userdata);

    res.render("login");
  }
})

app.post("/adminLogin", async (req, res) => {
  try {
    const check = await adminData.findOne({ name: req.body.username });
    if (!check) {
      res.send("user cannot found");
    }
    //compare hash password from the database with the plain text
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      res.render("allTable");
    } else {
      res.send("wrong password");
    }
  } catch {
    res.send("wrong details");
  }
});
//...
// register user
app.post("/signup", async (req, res) => {
  const data = {
    email:req.body.email,
    name: req.body.username,
    password: req.body.password,
  };
  // if user already exist in database
  const existinguser = await collection.findOne({ email: data.email });
  if (existinguser) {
    res.send("User already exist. Please choose different username");
  } else {
    //hash the password
    const saltRounds = 10; // no. of salt Round for bcrypt
    const hashPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashPassword; // replace the hash pass. with original pass.

    const userdata = await collection.insertMany(data);
    console.log(userdata);

    res.render("login");
  }
});

//user login
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ email: req.body.email });
    if (!check) {
      res.send("user cannot found");
    }
    //compare hash password from the database with the plain text
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (isPasswordMatch) {
      res.render("booking");
    } else {
      res.send("wrong password");
    }
  } catch {
    res.send("wrong details");
  }
});
//...
// app.post("/book", async (req, res) => {
//   const { details, seatNumber } = req.body;
//   try {
//     const existingBooking = await SeatBooking.findOne({ seatNumber });
//     if (existingBooking && existingBooking.status === "booked") {
//       return res.status(400).json({ message: "Seat already booked" });
//     }

//     const bookingTime = new Date();
//     const expirationTime = new Date(bookingTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

//     const newBooking = new SeatBooking({
//       details,
//       seatNumber,
//       status: "booked",
//       bookingTime,
//       expirationTime,
//     });

//     await newBooking.save();
//     res.status(201).json({ message: "Seat booked successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Booking failed", error: error.message });
//   }
// });
//.,.

app.post("/book", async (req, res) => {
  const data=req.body;
  console.log(data);

  const name=data.username;
  const seatNumber=data.tableNo;
  const bookingTime=data.date;
  const phone=data.phoneNo;
  const members=data.members;

  try {
    const existingBooking = await SeatBooking.findOne({ seatNumber });
    if (existingBooking && existingBooking.status === "booked") {
      return res.status(400).json({ message: "Seat already booked" });
    }
    const expirationTime = new Date(bookingTime); 
if (isNaN(expirationTime)) {
  return res.status(400).json({ message: "Invalid booking time" });
}
expirationTime.setHours(expirationTime.getHours() + 2); // Set expiration 2 hours later
const newBooking = new SeatBooking({
  name,
  phone,
  members,
  seatNumber,
  status: "booked",
  bookingTime,
  expirationTime,
});

    await newBooking.save();
    // dialog.info('Hello, world!', 'Alert', () => {
    //   console.log('Alert dialog closed');
    // });
    // res.status(201).json({ message: "Seat booked successfully" });
    mailreq;
    res.status(201).render("booked_succ.ejs");
    // res.render("/src/sendMail.js");
    
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
});
//...

app.get('/available', async (req, res) => {
  const availableSeatNumbers = new Set(Array.from({length: 50}, (_, i) => i + 1)); // Initialize Set with seat numbers from 1 to 50
  try {
    // Find all booked seat numbers from the database
    const bookedSeats = await SeatBooking.find({ status: 'booked' }).select('seatNumber');

    // Remove booked seat numbers from the Set
    bookedSeats.forEach(seat => availableSeatNumbers.delete(seat.seatNumber));

    // Convert the Set to an array if needed
    const availableSeatsArray = [...availableSeatNumbers];

    res.status(200).json({ availableSeatsCount: availableSeatsArray.length, availableSeats: availableSeatsArray });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available seats', error: error.message });
  }
});

app.get("/seat-status/:seatNumber", async (req, res) => {
  const { seatNumber } = req.params;
  try {
    const seat = await SeatBooking.findOne({ seatNumber });
    if (!seat) {
      return res.status(404).json({ message: "Seat not found" });
    }

    res.status(200).json({ seatNumber: seat.seatNumber, status: seat.status });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching seat status", error: error.message });
  }
});

const port = 5000;
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
