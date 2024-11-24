// MuscleGroups.js
const muscleGroups = [
    { "id": 11, "label": "Abs", "imgSrc": "/Abs.png", "matches": ["abdominals"] },
    { "id": 5, "label": "Biceps", "imgSrc": "/biceps.png", "matches": ["biceps"] },
    { "id": 1, "label": "Chest", "imgSrc": "/chest.png", "matches": ["chest"] },
    { "id": 7, "label": "Glutes", "imgSrc": "/glutes.png", "matches": ["glutes"] },
    { "id": 8, "label": "Hamstring", "imgSrc": "/hamstring.png", "matches": ["hamstrings"] },
    { "id": 9, "label": "Quad", "imgSrc": "/quad.png", "matches": ["quadriceps"] },
    { "id": 11, "label": "Legs", "imgSrc": "/legs.png", "matches": ["calves", "abductors", "adductors"] },
    { "id": 6, "label": "Triceps", "imgSrc": "/triceps.png", "matches": ["triceps"] },
    { "id": 10, "label": "Shoulder", "imgSrc": "/shoulder.png", "matches": ["traps"] },
    { "id": 4, "label": "Back", "imgSrc": "/back.png", "matches": ["middle_back", "lats"] },
    { "id": 2, "label": "Upper Back", "imgSrc": "/upper_back.png", "matches": ["middle_back", "traps"] },
    { "id": 3, "label": "Lower Back", "imgSrc": "/lower_back.png", "matches": ["lower_back"] }
];
  
  const MuscleGroups = ({ onSelectMuscle }) => (
    <div className="flex flex-col items-center text-white">
      <h2 className="text-xl font-semibold mb-4">Select a muscle group to target</h2>
      <div className="grid grid-cols-3 gap-4">
        {muscleGroups.map((group) => (
          <div
            key={group.id}
            className="bg-gray-700 p-4 rounded hover:border-blue-500 border cursor-pointer"
            onClick={() => onSelectMuscle(group.label, group.matches)} // Pass selected muscle group to parent
          >
            <img src={group.imgSrc} alt={group.label} className="w-full h-auto" />
          </div>
        ))}
      </div>
    </div>
  );
  
  export default MuscleGroups;
  
  