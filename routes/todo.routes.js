import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Create new todo
router.post("/", async (req, res) => {
	try {
		const { description, completed } = req.body;
		const newTodo = await pool.query(
			"INSERT INTO todo (description, completed) VALUES ($1, $2) RETURNING *",
			[description, completed ?? false],
		);
		res.status(201).json(newTodo.rows[0]);
	} catch (error) {
		console.error("Error adding todo:", error);
		res.status(500).json({ message: error });
	}
});

// Get all todos
router.get("/", async (_, res) => {
	try {
		const allTodos = await pool.query("SELECT * FROM todo");
		res.json(allTodos.rows);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Update a todo
router.put("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const { description, completed } = req.body;

		if (!description) {
			return res.status(400).json({ error: "Description is required" });
		}

		const updatedTodo = await pool.query(
			"UPDATE todo SET description = $1, completed = $2 WHERE todo_id = $3 RETURNING *",
			[description, completed || false, id],
		);

		if (updatedTodo.rows.length === 0) {
			return res.status(404).json({ error: "Todo not found" });
		}

		res.json({
			message: "Todo was updated!",
			todo: updatedTodo.rows[0],
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Delete a todo
router.delete("/:id", async (req, res) => {
	try {
		const { id } = req.params;
		const deletedTodo = await pool.query(
			"DELETE FROM todo WHERE todo_id = $1 RETURNING *",
			[id],
		);

		if (deletedTodo.rows.length === 0) {
			return res.status(404).json({ error: "Todo not found" });
		}

		res.json("Todo deleted!");
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

export default router;
