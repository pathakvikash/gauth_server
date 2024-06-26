const User = require('../Models/User');
const UserImages = require('../Models/UserImages');
const bcrypt = require('bcrypt');
const salt = 10;
const registerUser = async (
  { body: { name, email, password, pattern } },
  res
) => {
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists',
      });
    }
    const hashedPassword = await bcrypt.hash(password, salt);
    const userImages = await UserImages.find({ user: email });
    const imageBase64Array = userImages.map((image) => image);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      pattern: JSON.parse(pattern),
      images: imageBase64Array,
    });

    res.status(201).json({
      message: 'Registration successful',
      newUser,
      auth_token: '1234',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, pattern } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'User not found',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    // if the provided password does not matches the stored password
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email or password incorrect',
      });
    }

    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: '1h',
    // });
    if (
      user.pattern.length > 0 &&
      user.pattern.toString() !== pattern.toString()
    ) {
      return res.status(401).json({
        message: 'Pattern does not match',
      });
    }

    return res.status(200).json({
      message: 'Login successful',
      user,
      token: '1234',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

const uploadedImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No image data provided',
      });
    }
    let userEmail = req.params.email;

    const user = await User.findOne({ email: userEmail });

    const storedImages = await Promise.all(
      req.files.map(async (file) => {
        const imageBuffer = file.buffer;
        const imageBase64 = imageBuffer.toString('base64');
        const newImage = {
          user: userEmail,
          data: imageBase64,
        };
        return newImage;
      })
    );

    if (user) {
      await User.updateOne(
        { email: userEmail },
        { $push: { images: { $each: storedImages } } }
      );
    }

    return res.status(200).json({
      message: 'Images uploaded successfully',
      // images: storedImages,
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

const getUserImagesByEmail = async (req, res) => {
  try {
    const userEmail = req.params.email;

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.images);
  } catch (error) {
    console.error('Error fetching user images:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const getRemovedImages = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email,
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.images.pop();
    // await User.updateOne({ email: req.params.email }, { $set: { images: [] } });
    await user.save();

    await UserImages.deleteMany({ user: req.params.email });

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};

const removeAllImages = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.params.email,
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.images = [];
    await user.save();
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error.message,
    });
  }
};
module.exports = {
  registerUser,
  loginUser,
  uploadedImages,
  getUserImagesByEmail,
  getRemovedImages,
  removeAllImages,
};
