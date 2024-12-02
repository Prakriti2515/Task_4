//criteria for a password
const ValidatePass = (password) => {
    const minlength = 8;
    const maxlength = 20;
    const lowercase = /[a-z]/; //regex for checking presence of lowercase characters
    const uppercase = /[A-Z]/; //regex for checking presence of uppercase characters
    const numbers = /\d/; //regex for checking presence of numbers
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/; //regex for checking presence of special characters
    
    if(password.length < 8)
        return 'Too short password';
    else if(password.length > 20)
        return 'Too long password';
    else if(!lowercase.test(password))
        return 'No uppercase characters';
    else if(!uppercase.test(password))
        return 'No lowercase characters';
    else if(!specialChar.test(password))
        return 'No special characters used';
    else if(!numbers.test(password))
        return 'No digits present in the password';
    else
    return null;
};
module.exports = ValidatePass;