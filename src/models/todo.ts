import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: Boolean,
    duedate: String,
  });
//connent to "todos" collection
const Todo = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);
export default Todo;  