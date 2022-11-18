const usersDB = {
    users: require("../model/users.json"),
    setUsers: function (data) { this.users = data }
}

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ "message": "Username and Password are Required!!"});
    }
    // Need to check for duplicate usernames in the DB:
    const duplicate = usersDB.users.find(person => person.username === user);
    if (duplicate) {
        return res.sendStatus(409); // Status 409 is a conflict
    }
    try {
        // Encrypt the password and add salt
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // Store the new user:
        const newUser = { // Note changes in authController.js
            "username": user,
            "roles": { "user": 2001 }, // All new users get the lowest credentials
            "password": hashedPwd
        };
        usersDB.setUsers([...usersDB.users, newUser]);
        await fsPromises.writeFile(
            path.join(__dirname, "..", "model", "users.json"),
            JSON.stringify(usersDB.users)
        )
        console.log(usersDB.users);
        res.status(201).json({ "success": `New User ${user} Has Been Created!!`});
    } catch {
        res.status(500).json({ "message": err.message });
    }
}

module.exports = { handleNewUser };