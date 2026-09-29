const { TEAMS, KIDS } = require("./_config");
const redis = require("./_redis");

module.exports = async (req, res) => {
  try {
    // VOTER_IDS: danh sách mã hợp lệ, cách nhau bằng dấu phẩy. Để trống = ai cũng nhập được mã bất kỳ.
    const allowed = (process.env.VOTER_IDS || "").split(",").map(s => s.trim()).filter(Boolean);
    const ok = id => typeof id === "string" && /^[\w.-]{2,40}$/.test(id) && (!allowed.length || allowed.includes(id));

    if (req.method === "GET") {
      const uid = req.query.uid;
      if (!ok(uid)) return res.status(403).json({ error: "User ID không hợp lệ" });
      const [v] = await redis([["EXISTS", "voted:" + uid]]);
      if (v.result) return res.status(409).json({ error: "User ID này đã bình chọn rồi" });
      return res.json({ ok: true });
    }
    if (req.method !== "POST") return res.status(405).end();

    const { uid, teams, kid } = req.body || {};
    if (!ok(uid)) return res.status(403).json({ error: "User ID không hợp lệ" });
    const tIds = TEAMS.map(t => t.id);
    if (!Array.isArray(teams) || teams.length < 1 || teams.length > 3 ||
        new Set(teams).size !== teams.length || !teams.every(t => tIds.includes(t)) ||
        !KIDS.some(k => k.id === kid))
      return res.status(400).json({ error: "Lựa chọn không hợp lệ" });

    const [lock] = await redis([["SET", "voted:" + uid, String(Date.now()), "NX"]]);
    if (!lock.result) return res.status(409).json({ error: "User ID này đã bình chọn rồi" });

    await redis([
      ...teams.map(t => ["HINCRBY", "teams", t, 1]),
      ["HINCRBY", "kids", kid, 1],
      ["INCR", "total"]
    ]);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: "Lỗi máy chủ, vui lòng thử lại" });
  }
};
