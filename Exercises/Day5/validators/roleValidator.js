function roleValidator(role) {
    const validRoles = ["Admin", "User"];
    if (!validRoles.includes(role)) {
        return false;
    }
    return true;
}

module.exports = roleValidator