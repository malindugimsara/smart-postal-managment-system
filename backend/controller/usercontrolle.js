import User from "../modules/user.js";
import bcrypt from "bcrypt"; 
import jwd from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// This function saves a new user to the database
export function saveUser(req, res) {
    if (req.body.role == "admin") {
        if (req.user == null) {
            return res.status(403).json({
                message: "Please login as an admin to create a new admin user"
            });
            return;
        }
        if (req.user.role != "admin") {
            return res.status(403).json({
                message: "You are not authorized to create a new admin user"
            });
            return;
        }
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const user =new User({
        email: req.body.email,
        name: req.body.name,
        address: req.body.address,
        password: hashedPassword,
        role: req.body.role || "user", // Default role is 'user'
        phoneNumber: req.body.phoneNumber || "Not given", // Default phoneNumber to "Not given"
        isDisable: req.body.isDisable || false, // Default isDisable to false
        isEmailVerified: req.body.isEmailVerified || false // Default isEmailVerified to false
    })


    user.save().then(()=> {
        res.json({
            message: "User created successfully"
        })
    }).catch((err) => {
        console.error("Error creating user:", err);
        res.status(500).json({
            message: "Error creating user",
            error: err.message
        });
    })
}

// This function logs in a user by checking their email and password
export function loginUser(req, res){
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({
        email : email
    }).then((user) => {
        if (user == null) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        else {
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (isPasswordValid) {
                // Generate a JWT token
                const userData ={
                    email: user.email,
                    name: user.name,
                    address: user.address,
                    role: user.role,
                    phoneNumber: user.phoneNumber,
                    isDisable: user.isDisable,
                    isEmailVerified: user.isEmailVerified
                }
                const token = jwd.sign(userData,process.env.JWT_KEY)
                res.json({
                    message: "Login successfully",
                    token: token,
                    user: userData
                })

            } else {
                res.status(401).json({
                    message: "Invalid password"
                });
            }
        }
    })
}

// This function gets the user details by email
export function getUserByEmail(req, res) {
    const email = req.params.email;

    User.findOne({
        email: email
    }).then((user) => {
        if (user == null) {
            return res.status(404).json({
                message: "User not found"
            });
        } else {
            res.json(user);
        }
    }).catch((err) => {
        console.error("Error fetching user:", err);
        res.status(500).json({
            message: "Error fetching user",
            error: err.message
        });
    })
};