const fs = require('fs');
const pdf = require('pdf-parse');

// Path to your PDF file
const pdfPath = 'pender-sample.pdf'; // replace with your actual file name

// Read the file into a buffer
const dataBuffer = fs.readFileSync(pdfPath);

// Parse the PDF
pdf(dataBuffer).then(function(data) {
    console.log(data.text); // Print all the text content
}).catch(function(err) {
    console.error('Error parsing PDF:', err);
});