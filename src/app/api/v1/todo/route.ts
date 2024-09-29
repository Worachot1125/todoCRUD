import { connectToDatabase } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";

//CRUD  =>
//READ data
//url => api/v1/todo
// CREATE สร้างงานใหม่
export async function POST(request: Request) {
  try {
    const { name, description, duedate } = await request.json();
    await connectToDatabase();
    const newTodo = new Todo({
      name,
      description,
      status: false, // เริ่มต้นสถานะเป็นยังไม่เสร็จ
      duedate,
    });
    await newTodo.save();
    return NextResponse.json({ success: true, data: newTodo });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
}

// READ แสดงรายการงานทั้งหมด
export async function GET() {
  try {
    await connectToDatabase();
    const todos = await Todo.find({});
    return NextResponse.json({ success: true, data: todos });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
}

// UPDATE เปลี่ยนสถานะหรือแก้ไขงาน
export async function PUT(request: Request) {
  try {
    const { id, name, status } = await request.json();
    await connectToDatabase();
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { name, status },
      { new: true }
    );
    return NextResponse.json({ success: true, data: updatedTodo });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
}

// DELETE ลบงาน
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await connectToDatabase();
    await Todo.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, error: err });
  }
}