// Imports
const express = require('express');
const mysql = require('mysql2');
const multer = require('multer'); // For handling file uploads
const path = require('path');

const app = express()
const port = 5000

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Dig+ramp846@',
    database: 'form_data',
})

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'uploads/'); // Save uploaded files to the "uploads" directory
    },
    filename: (req, file, callback) => {
        const filename = `${Date.now()}-${file.originalname}`;
        callback(null, filename);
    },
});

const upload = multer({ storage });

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('uploads')); // Serve files from the "uploads" directory

// Static Files
app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('', (req, res) => {
    db.query('SELECT * FROM form', (error, results) => {
        if (error) {
          console.error('Error fetching data from the database:', error);
          return res.status(500).json({ error: 'An error occurred while fetching data.' });
        }
    
        // Render a template (e.g., an EJS template) with the fetched data
        res.render('index', { data: results, path:path });
      });
   // res.render('index', { text: 'Hey' })
})

db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed:', err);
      return;
    }
    console.log('Database connected successfully!');
    // Release the connection when done
    connection.release();
  });

  app.post('', upload.array('issueMedia', 5),(req, res) => {
   console.log("req files", req.files);
    const {
        issueCategory,
        summariseproblem,
        issueDescription,
        name,
        email,
        city,
    } = req.body;
    const mediaPaths = req.files.map((file) => `${file.filename}`);
    try {
        db.query(
            'INSERT INTO form (issueCategory, summariseproblem, mediaField, issueDescription, name, email,city) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [issueCategory, summariseproblem,mediaPaths.join(','), issueDescription, name, email, city],
            (error, results) => {
                if (error) {
                    console.error('Error inserting data:', error);
                    return res.status(500).json({ error: 'An error occurred while inserting data.' });
                }

                console.log('Data inserted successfully:', results);

                //return res.status(200).json({ success: true, message: 'Data inserted successfully.' });
                // If you want to return the inserted data, you can send it as JSON in the response.
              // return res.status(200).json({ alert: 'Data inserted successfully.', insertedData: results });
            }
        );
    } catch (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'An error occurred while processing the database query.' });
    }
});

app.get('/moreinfo', (req, res) => {
    res.render('moreinfo', { text: 'Hey' })
})


app.get('/about', (req, res) => {
   res.sendFile(__dirname + '/views/about.html')
});

app.listen(port, () => console.info(`App listening on port ${port}`))
