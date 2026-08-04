"use client";

import { MOODS, MoodId } from "@/lib/moods";

interface MoodPickerProps {
  selected: MoodId | null;
  onSelect: (moodId: MoodId) => void;
}

export default function MoodPicker({ selected, onSelect }: MoodPickerProps) {
  return (
    <div className="grid w-full max-w-md grid-cols-2 gap-3">
      {MOODS.map((mood) => {
        const isSelected = selected === mood.id;
        return (
          <button
            key={mood.id}
            type="button"
            onClick={() => onSelect(mood.id)}
            className={`flex flex-col items-start gap-1 rounded-2xl border-2 p-4 text-left transition-all ${
              isSelected
                ? "border-blossom-500 bg-blossom-100 shadow-md"
                : "border-transparent bg-white/70 hover:border-blossom-200 hover:bg-blossom-50"
            }`}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="font-medium text-[#6b4a52]">{mood.label}</span>
            <span className="text-xs text-[#9a7d84]">{mood.description}</span>
          </button>
        );
      })}
    </div>
  );
}
