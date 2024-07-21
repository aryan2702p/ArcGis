const { User } = require('../models/User');
const crypto = require('crypto');


exports.createUser = async (req, res) => {
 
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    
    if (user) {
      res.status(401).json({ message: 'email already registered' });
    } 
    else {
   
      const salt = crypto.randomBytes(16);
      crypto.pbkdf2(
        req.body.password,
        salt,
        310000,
        32,
        'sha256',
        async function (err, hashedPassword) {
          if (err) {
            console.error('Error hashing password:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
          }
          else{
            const user = new User({ ...req.body, password: hashedPassword, salt });
            const doc = await user.save();
            console.log("session Id : ",req.session.id);
            req.session.userId = doc._id;

            return res.status(201).json({ message: 'Created successful' });
          }

         
        }
      );
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(400).json({ message: 'Bad request' });
  }
};



exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    
    if (!user) {
      res.status(401).json({ message: 'No such user email' });
    } else {
      crypto.pbkdf2(
        req.body.password,
        user.salt,
        310000,
        32,
        'sha256',
        async function (err, hashedPassword) {
          if (err) {
            console.error('Error hashing password:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
          }

          if (crypto.timingSafeEqual(user.password, hashedPassword)) {
            console.log("session Id : ",req.session.id);
            req.session.userId = user._id;
            return res.status(200).json({ message: 'Login successful' });
            
          } else {
            res.status(401).json({ message: 'Invalid credentials' });
          }
        }
      );
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(400).json({ message: 'Bad request' });
  }
};

exports.checkUser = async (req, res) => {
 const {userId}= req.params;
 try {
  const user = await User.findOne({ _id: userId }).exec();
  if(!user){
    res.status(404).json({ message: 'No user found' });
  }else{
    res.status(200).json({ message: 'OK' });
  }
  
 } catch (error) {
  res.status(error.status).json({ message: error.message });
  
 }

};
exports.logoutUser = async (req, res) => {
  console.log("logout user");
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Failed to log out.');
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.redirect('/login');
  });
};