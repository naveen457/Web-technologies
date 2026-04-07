//node eventApps.js
// Import events module
const EventEmitter = require('events');

// Create an event emitter object
const eventEmitter = new EventEmitter();

// 1️⃣ Register first listener
eventEmitter.on('greet', (name) => {
    console.log(`Hello, ${name}! Welcome to Node.js events.`);
});

// 2️⃣ Register second listener (same event)
eventEmitter.on('greet', (name) => {
    console.log(`How are you, ${name}?`);
});

// 3️⃣ Register another custom event
eventEmitter.on('status', (code, message) => {
    console.log(`Status Code: ${code}, Message: ${message}`);
});

// 4️⃣ Trigger events using emit()
console.log("Triggering greet event...\n");
eventEmitter.emit('greet', 'Naveen');

console.log("\nTriggering status event...\n");
eventEmitter.emit('status', 200, 'Success');

// 5️⃣ Demonstrate asynchronous behavior
setTimeout(() => {
    console.log("\nTriggering greet event asynchronously...\n");
    eventEmitter.emit('greet', 'Async User');
}, 2000);