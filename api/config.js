const { TEAMS, KIDS } = require("./_config");
module.exports = (req, res) => res.json({ teams: TEAMS, kids: KIDS });
