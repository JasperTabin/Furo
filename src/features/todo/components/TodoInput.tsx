import { useState } from "react";
import { Plus } from "lucide-react";

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export const TodoInput = ({ onAdd }: TodoInputProps) => {
  const [input, setInput] = useState("");

  function handleSubmit() {
    if (input.trim()) {
      onAdd(input);
      setInput("");
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSubmit();
    }
  }

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-3 bg-(--color-bg) border border-(--color-border) rounded-xl focus:outline-none focus:border-(--color-border)/70 transition-colors"
      />
      <button
        onClick={handleSubmit}
        className="px-6 py-3 bg-(--color-border) hover:bg-(--color-border)/80 rounded-xl transition-colors flex items-center gap-2"
      >
        <Plus size={20} />
        <span className="hidden sm:inline">Add</span>
      </button>
    </div>
  );
};
