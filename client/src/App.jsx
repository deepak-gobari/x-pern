import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline, MdOutlineDone } from "react-icons/md";

const API_URL = "http://localhost:5000/api";

function App() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const [allTodos, setAllTodos] = useState([]);
	const [editingTodo, setEditingTodo] = useState(null);
	const [newTodo, setNewTodo] = useState("");

	const addTodo = async (e) => {
		e.preventDefault();
		if (!newTodo.trim()) return;

		try {
			const res = await axios.post(`${API_URL}/todos`, {
				description: newTodo.trim(),
				completed: false,
			});
			setAllTodos([...allTodos, res.data]);
			setNewTodo("");
		} catch (error) {
			console.error("Error adding todo:", error);
			setError("Failed to add todo");
		}
	};

	const deleteTodo = async (id) => {
		try {
			setError(null);
			await axios.delete(`${API_URL}/todos/${id}`);
			setAllTodos(allTodos.filter((todo) => todo.todo_id !== id));
		} catch (error) {
			console.error(error.message);
			setError("Failed to delete todo. Please try again.");
		}
	};

	const updateTodo = async (id) => {
		try {
			setError(null);

			const currentTodo = allTodos.find((todo) => todo.todo_id === id);
			const trimmedText = editingTodo.description.trim();

			if (!trimmedText) return;

			if (currentTodo.description === trimmedText) {
				setEditingTodo(null);
				return;
			}

			await axios.put(`${API_URL}/todos/${id}`, {
				description: trimmedText,
			});

			setEditingTodo(null);
			setAllTodos(
				allTodos.map((todo) =>
					todo.todo_id === id
						? { ...todo, description: trimmedText, completed: false }
						: todo,
				),
			);
		} catch (error) {
			console.error(error.message);
			setError("Failed to update todo.");
		}
	};

	const toggleCompleted = async (id) => {
		try {
			setError(null);
			const todo = allTodos.find((todo) => todo.todo_id === id);

			await axios.put(`${API_URL}/todos/${id}`, {
				description: todo.description,
				completed: !todo.completed,
			});

			setAllTodos(
				allTodos.map((todo) =>
					todo.todo_id === id ? { ...todo, completed: !todo.completed } : todo,
				),
			);
		} catch (error) {
			console.error(error.message);
			setError("Failed to update todo. Please try again.");
		}
	};

	useEffect(() => {
		(async () => {
			setLoading(true);

			try {
				setError(null);
				const res = await axios.get(`${API_URL}/todos`);
				setAllTodos(res.data);
			} catch (error) {
				console.error("Error fetching todos:", error);
				setError("Failed to fetch todos.");
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-200">
			<div className="mx-auto p-4 max-w-2xl">
				<h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
					Todo Manager PERN Stack
				</h1>

				{error && (
					<div className="bg-red-100 text-red-700 p-3 rounded mb-4">
						{error}
					</div>
				)}

				<div className="w-full bg-white rounded-2xl shadow-xl p-8">
					<form
						className="w-full flex flex-col items-center gap-2 rounded-lg sm:flex-row"
						onSubmit={addTodo}
					>
						<input
							className="rounded-lg w-full outline-none px-3 py-2 shadow-sm border border-gray-200 text-gray-700 placeholder-gray-400"
							type="text"
							placeholder="What needs to be done?"
							required
							value={newTodo}
							onChange={(e) => setNewTodo(e.target.value)}
						/>
						<button
							className="w-full sm:w-40 text-nowrap bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium cursor-pointer"
							type="submit"
						>
							Add Task
						</button>
					</form>

					<div className="mt-4">
						{loading ? (
							<div>
								<p className="text-gray-600">Loading tasks...</p>
							</div>
						) : allTodos.length === 0 ? (
							<p className="text-gray-600">
								No tasks available. Add a new task!
							</p>
						) : (
							<div className="flex flex-col gap-y-4">
								{allTodos.map((todo) => (
									<div key={todo.todo_id}>
										{editingTodo?.todo_id === todo.todo_id ? (
											<div className="w-full flex flex-col sm:flex-row items-center gap-2">
												<input
													className="w-full px-4 py-2 border rounded-lg border-gray-200 outline-none focus:ring-2 focus:ring-blue-300 text-gray-700 shadow-inner"
													type="text"
													value={editingTodo.description}
													onChange={(e) =>
														setEditingTodo({
															...editingTodo,
															description: e.target.value,
														})
													}
												/>
												<div className="flex w-full sm:w-40">
													<button
														className="h-10 w-full flex justify-center items-center bg-green-500 text-white rounded-l-lg hover:bg-green-600 cursor-pointer"
														type="button"
														onClick={() => updateTodo(todo.todo_id)}
													>
														<MdOutlineDone />
													</button>
													<button
														className="h-10 w-full flex justify-center items-center bg-gray-200 text-gray-700 rounded-r-lg hover:bg-gray-300 cursor-pointer"
														type="button"
														onClick={() => setEditingTodo(null)}
													>
														<IoClose />
													</button>
												</div>
											</div>
										) : (
											<div className="flex justify-between items-center">
												<div className="flex items-center gap-x-4 overflow-hidden">
													<button
														className={`shrink-0 h-6 w-6 border-2 rounded-full flex items-center justify-center transition-colors duration-300 ${
															todo.completed
																? "bg-green-500 border-green-500 text-white"
																: "border-gray-300 hover:border-blue-400"
														}`}
														type="button"
														onClick={() => toggleCompleted(todo.todo_id)}
													>
														{todo.completed && <MdOutlineDone size={16} />}
													</button>
													<span className="text-gray-800 truncate font-medium">
														{todo.description}
													</span>
												</div>
												<div className="flex gap-x-2">
													<button
														className="p-2 text-blue-500 hover:text-blue-700 rounded-lg hover:bg-blue-50 duration-200 cursor-pointer"
														type="button"
														onClick={() => setEditingTodo({ ...todo })}
													>
														<MdModeEditOutline />
													</button>
													<button
														className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 duration-200 cursor-pointer"
														type="button"
														onClick={() => deleteTodo(todo.todo_id)}
													>
														<FaTrash />
													</button>
												</div>
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
