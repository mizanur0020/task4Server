import express from "express";
import { connectToDatabase } from "../lib/db.js";

const router = express.Router();

// Fetch all users
router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const [users] = await db.query(
      "SELECT id, name, email, status, DATE_FORMAT(last_login, '%Y-%m-%d %H:%i:%s') AS lastLogin, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created FROM users ORDER BY last_login DESC"
    );
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Block users
router.post("/block", async (req, res) => {
  const { userIds } = req.body;
  try {
    const db = await connectToDatabase();
    await db.query("UPDATE users SET status = 'Blocked' WHERE id IN (?)", [
      userIds,
    ]);
    res.status(200).json({ message: "Users blocked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Unblock users
router.post("/unblock", async (req, res) => {
  const { userIds } = req.body;
  try {
    const db = await connectToDatabase();
    await db.query("UPDATE users SET status = 'Active' WHERE id IN (?)", [
      userIds,
    ]);
    res.status(200).json({ message: "Users unblocked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete users
router.post("/delete", async (req, res) => {
  const { userIds } = req.body;
  try {
    const db = await connectToDatabase();
    await db.query("DELETE FROM users WHERE id IN (?)", [userIds]);
    res.status(200).json({ message: "Users deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
