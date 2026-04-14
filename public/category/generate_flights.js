const fs = require('fs');

const airports = [
  { city: "Delhi", code: "DEL" },
  { city: "Mumbai", code: "BOM" },
  { city: "Bengaluru", code: "BLR" },
  { city: "Chennai", code: "MAA" },
  { city: "Kolkata", code: "CCU" },
  { city: "Hyderabad", code: "HYD" },
  { city: "Goa", code: "GOI" },
  { city: "Jaipur", code: "JAI" },
  { city: "Ahmedabad", code: "AMD" },
  { city: "Pune", code: "PNQ" }
];

const timeslots = ["06:30", "08:00", "09:30", "11:45", "13:00", "14:30", "16:00", "19:30", "21:30"];
const companies = ["IndiGo", "Air India", "Vistara", "SpiceJet", "GoAir", "AirAsia"];

let csvContent = "company,flight_number,boarding,duration,landing,cost,offer,boarding_airport,landing_airport,stop,from_city,to_city\n";

function getRandomMinutes() {
    return Math.floor(Math.random() * 60).toString().padStart(2, '0');
}

function calculateLanding(boardingTime, durationHours, durationMinutes) {
    let [hours, minutes] = boardingTime.split(':').map(Number);
    minutes += durationMinutes;
    hours += durationHours + Math.floor(minutes / 60);
    minutes = minutes % 60;
    hours = hours % 24;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

let flightCounter = 1000;

for (let from of airports) {
  for (let to of airports) {
    if (from.code === to.code) continue;
    
    // Generate 3 flights for each valid combination across different timeslots
    let slots = [...timeslots].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    for (let slot of slots) {
      let company = companies[Math.floor(Math.random() * companies.length)];
      let f_num = `${company.substring(0, 2).toUpperCase()} ${flightCounter++}`;
      let durHr = Math.floor(Math.random() * 2) + 1;
      let durMin = Math.floor(Math.random() * 60);
      let durationStr = `${durHr}h ${durMin}m`;
      let landing = calculateLanding(slot, durHr, durMin);
      
      let cost = Math.floor(Math.random() * 10000) + 4000;
      let costStr = `₹${cost}`;
      let offer = `Extra ₹${Math.floor(Math.random() * 4 + 1)}10 off`;
      let stop = Math.random() > 0.7 ? "1 Stop" : "Non-Stop";

      csvContent += `${company},${f_num},${slot},${durationStr},${landing},${costStr},${offer},${from.code},${to.code},${stop},${from.city},${to.city}\n`;
    }
  }
}

fs.writeFileSync('f:/f3-24c/public/category/flights.csv', csvContent);
console.log("flights.csv updated with " + ((airports.length * (airports.length - 1)) * 3) + " flights.");
