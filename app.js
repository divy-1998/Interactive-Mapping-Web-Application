// Imports
const express = require('express');
const mysql = require('mysql2');
const multer = require('multer'); // For handling file uploads
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express()
const port = 5000


app.use(session({
    secret: '9428e5a5c28b8306174254001fc80d2ada5dadf64e6cd24c3be1f905716615a9', // Replace with your own secret key
    resave: false,
    saveUninitialized: true,
  }));

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


app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/home', (req, res) => {
    
    res.render('index', { title: 'Express', session : req.session });
})
app.get('/about', (req, res) => {
    
    res.render('about', { title: 'Express', session : req.session });
})
app.get('/Allreports', (req, res) => {
    
    res.render('Allreports', { title: 'Express', session : req.session });
})
app.get('/airpollution', (req, res) => {
    
    res.render('airpollution', { title: 'Express', session : req.session });
})
app.get('/morecomments', (req, res) => {
    
    res.render('morecomments', { text: 'Hey' });
})

app.get('/moreproblems', (req, res) => {
    
    db.query('SELECT * FROM form ',  (error, results) => {
        if (error) {
            console.error('Error fetching data from the database:', error);
            return res.status(500).json({ error: 'An error occurred while fetching data.' });
        }
        
        console.log(results);
        res.json(results);
    });
   
})

app.get('/morecomment', (req, res) => {
    const searchCityName = req.query.cityName; // Get the search query from the request URL
    // Query the database to retrieve problems based on the searchCityName
    db.query('SELECT * FROM form WHERE city = ?', [searchCityName], (error, results) => {
        if (error) {
            console.error('Error fetching data from the database:', error);
            return res.status(500).json({ error: 'An error occurred while fetching data.' });
        }
        
        // Send the filtered problems as JSON response
        res.json(results);
    });
   
})

app.get('/searchProblems', (req, res) => {
    const searchCityName = req.query.cityName; // Get the search query from the request URL
    // Query the database to retrieve problems based on the searchCityName
    db.query('SELECT * FROM form WHERE city = ?', [searchCityName], (error, results) => {
        if (error) {
            console.error('Error fetching data from the database:', error);
            return res.status(500).json({ error: 'An error occurred while fetching data.' });
        }
        
        // Send the filtered problems as JSON response
        res.json(results);
    });
});

app.get('/getProblemId', (req, res) => {
    // Query to fetch the latest problem_id from the form table
    const query = 'SELECT ID FROM form ORDER BY ID DESC';

    db.query(query, (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: 'Unable to retrieve problem_id from the database' });
        }

        const problemId = results.length > 0 ? results[0].ID : null;

        if (problemId !== null) {
            res.status(200).json({ ID: problemId });
        } else {
            res.status(404).json({ error: 'No problem_id found in the database' });
        }
    });
});

db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed:', err);
      return;
    }
    console.log('Database connected successfully!');
    // Release the connection when done
    connection.release();
  });

  app.post('/home', upload.array('issueMedia', 5),(req, res) => {
   //console.log("req files", req.files);
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

               
            }
        );
    } catch (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'An error occurred while processing the database query.' });
    }
});


app.get('/moreinfo', (req, res) => {
    res.render('moreinfo', { text: 'Hey' })
});
app.get('/about', (req, res) => {
   res.sendFile(__dirname + '/views/about.html')
});
app.post('/submitComment', (req, res) => {
    console.log(req.body);
    const {problem_id, text}  = req.body;
    //console.log(commentText)
    // Insert the comment into the database
    db.query(
        'INSERT INTO comments (problem_id, text) VALUES (?,?)',
        [problem_id, text],
        (error, results) => {
            if (error) {
                console.error('Error inserting comment:', error);
                return res.status(500).json({ error: 'An error occurred while inserting the comment.' });
            }

            console.log('Comment inserted successfully:', results);

            // Return a success response or any relevant data
            return res.status(200).json({ success: true, message: 'Comment inserted successfully.' });
        }
    );
     
 });
// Handle comment submission
app.post('/submitReply', (req, res) => {
    console.log("hello")
    console.log(req.body);
    const {comment_id, text}  = req.body;
    console.log(text);
    db.query(
        'INSERT INTO replies (comment_id, text) VALUES (?,?)',
        [comment_id, text],
        (error, results) => {
            if (error) {
                console.error('Error inserting comment:', error);
                return res.status(500).json({ error: 'An error occurred while inserting the comment.' });
            }

            console.log('Comment inserted successfully:', results);

            // Return a success response or any relevant data
            return res.status(200).json({ success: true, message: 'Comment inserted successfully.' });
        }
    );
   
     
 });

// Handle comment retrieval for a specific problem
app.get('/getComments/:problemId', (req, res) => {
    const problemId = req.params.problemId;
    console.log('problem',problemId);
    // Query the database to fetch comments for the specified problem
    db.query(
        'SELECT * FROM comments WHERE problem_id = ?',
        [problemId],
        (error, results) => {
            if (error) {
                console.error('Error fetching comments:', error);
                return res.status(500).json({ error: 'An error occurred while fetching comments.' });
            }

            // Return the comments as JSON response
            return res.status(200).json(results);
        }
    );
});

app.get('/getReply/:commentId', (req, res) => {
   // console.log("Hello")
    const commentId = req.params.commentId;
 //console.log(commentId);
    // Query the database to fetch comments for the specified problem
    db.query(
        'SELECT * FROM replies WHERE comment_id = ?',
        [commentId],
        (error, results) => {
            if (error) {
                console.error('Error fetching comments:', error);
                return res.status(500).json({ error: 'An error occurred while fetching comments.' });
            }
            console.log(results);
            // Return the comments as JSON response
            return res.status(200).json(results);
        }
    );
});
app.post('/create-account', (req, res) => {
    const { newName, newEmail, newPassword } = req.body;
    console.log(req.body);
    db.query(
        'INSERT INTO createaccount (name, email, password) VALUES (?, ?, ?)',
        [newName, newEmail, newPassword],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
          return res.redirect('/home');
        }
      );
    });

    app.post('/login', (req, res, next) => {
        console.log("hello");
        const { email, password } = req.body;
        if (email && password) {
            query = `SELECT * FROM createaccount WHERE email = "${email}"`;
            db.query(query, function (error, data) {
                if (data.length > 0) {
                    let passwordMatch = false;
                    for (let count = 0; count < data.length; count++) {
                        if (data[count].password === password) {
                            req.session.userID = data[count].ID; // Update to userID
                            req.session.userName = data[count].name;
                            passwordMatch = true;
                            console.log('Login successful');
                            break;
                        }
                        
                    }
                    if (passwordMatch) {
                        res.redirect("/home");
                    } else {
                        res.send('Incorrect Password');
                    }
                } else {
                    res.send('Incorrect Email Address');
                }
            });
        } else {
            res.send('Invalid email or password'); // Handle invalid inputs
        }
    });
    
    app.get('/logout', function(request, response, next){

        request.session.destroy();
    
        response.redirect("/home");
    
    });

    app.get("/checkLogin", (req, res) => {
        if (req.session.userID) {
            res.json({ loggedIn: true, user: { userID: req.session.userID, userName: req.session.userName } });
        } else {
            res.json({ loggedIn: false });
        }
    });
    

app.listen(port, () => console.info(`App listening on port ${port}`))
