const { TEAMS, KIDS } = require("./_config");
const redis = require("./_redis");

module.exports = async (req, res) => {
  try {
    if (!process.env.ADMIN_KEY || req.query.key !== process.env.ADMIN_KEY)
      return res.status(401).json({ error: "Sai khóa quản trị" });
    const [t, k, n] = await redis([["HGETALL", "teams"], ["HGETALL", "kids"], ["GET", "total"]]);
    const obj = a => { const o = {}; for (let i = 0; i < a.length; i += 2) o[a[i]] = +a[i + 1]; return o; };
    const tv = obj(t.result || []), kv = obj(k.result || []);
    const rank = (list, v) => list.map(x => ({ name: x.name, votes: v[x.id] || 0 })).sort((a, b) => b.votes - a.votes);
    res.json({ total: +n.result || 0, teams: rank(TEAMS, tv), kids: rank(KIDS, kv) });
  } catch (e) {
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
