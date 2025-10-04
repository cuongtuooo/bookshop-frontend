import { useState } from "react";

const AboutPage = () => {
    const [todo, SetTodo] = useState<string[]>([]);
    const [text, setText] = useState("");
    const [edit, setEdit] = useState(false); // vẫn giữ nguyên như bạn có

    // thêm: trạng thái cho phần sửa
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingText, setEditingText] = useState("");

    const handelAddTodo = () => {
        const value = text.trim();
        if (!value) return;
        SetTodo([...todo, value]);
        setText("");
    };

    const handleDelete = (index: number) => {
        const newTodo = todo.filter((_, i) => i !== index);
        SetTodo(newTodo);
        if (editingIndex === index) {
            setEditingIndex(null);
            setEditingText("");
            setEdit(false);
        }
    };

    // --- Edit flow (chỉ thêm) ---
    const startEdit = (index: number) => {
        setEditingIndex(index);
        setEditingText(todo[index]);
        setEdit(true);
    };

    const cancelEdit = () => {
        setEditingIndex(null);
        setEditingText("");
        setEdit(false);
    };

    const saveEdit = () => {
        if (editingIndex === null) return;
        const value = editingText.trim();
        if (!value) return;
        const newTodo = todo.map((t, i) => (i === editingIndex ? value : t));
        SetTodo(newTodo);
        setEditingIndex(null);
        setEditingText("");
        setEdit(false);
    };

    return (
        <div>
            <input
                type="text"
                value={text}
                placeholder="Nhập công việc..."
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handelAddTodo()}
            />
            <button onClick={handelAddTodo} disabled={!text.trim()}>
                Thêm
            </button>

            <ul>
                {todo.map((item, index) => (
                    <li key={index}>
                        {editingIndex === index ? (
                            <>
                                <input
                                    autoFocus
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") saveEdit();
                                        if (e.key === "Escape") cancelEdit();
                                    }}
                                />
                                <button onClick={saveEdit} disabled={!editingText.trim()}>
                                    Lưu
                                </button>
                                <button onClick={cancelEdit}>Hủy</button>
                            </>
                        ) : (
                            <>
                                <span>{item}</span>
                                <button onClick={() => startEdit(index)} style={{ marginLeft: 8 }}>
                                    Sửa
                                </button>
                                <button onClick={() => handleDelete(index)} style={{ marginLeft: 6 }}>
                                    Xóa
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AboutPage;
