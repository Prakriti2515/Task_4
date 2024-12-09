const User = require('../../authentication/src/models/Schema');

const choice = async(req, res)=>{
    const userId = req.params;
    const user_choice = req.body;
    res.json({message: `Entering as a ${user_choice}`});
    await User.updateOne({_id : userId}, {role: user_choice});
}

module.exports = choice;