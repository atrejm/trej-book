const mongoose = require('mongoose');
const User = require('./src/models/User.ts');
const Profile = require('./src/models/Profile.ts');
const { ObjectId } = require('mongodb');
require('dotenv').config();

async function createUser() {
    const user = new User({
        firstname: "Atrej",
        lastname: "Mak",
        username: "atrejmak",
        password: "1234",
        email: "atrejmak93@gmail.com",
        chats: []
    });

    const profile = new Profile({
        user: user,
        friends: [],
        bio: "Hey it's me",
        profilePicURL: "",
        posts: []
    });

    user.profile = profile;
    profile.user = user;

    await profile.save();
    await user.save();
}

async function findUser(id) {
    const profile = await User.findById(id);
    console.log(profile);
    const url = await profile.thumbnailURL;
    console.log(url);
}

main().catch((err) => console.log(err));
async function main() {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGO_DB);

    //await createUser();
    await findUser("65a185d7897f238dc8849083")

    await mongoose.disconnect();
}