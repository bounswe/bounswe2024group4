// MuscleGroups.js
const muscleGroups = [
    { id: 1, label: "Chest", imgSrc: "/chest.png" },
    { id: 2, label: "u_Back", imgSrc: "/upper_back.png" },
    { id: 3, label: "l_Back", imgSrc: "/lower_back.png" },
    { id: 4, label: "Back", imgSrc: "/back.png" },
    { id: 5, label: "Biceps", imgSrc: "/biceps.png" },
    { id: 6, label: "Triceps", imgSrc: "/triceps.png" },
    { id: 7, label: "Glutes", imgSrc: "/glutes.png" },
    { id: 8, label: "Hamstring", imgSrc: "/hamstring.png" },
    { id: 9, label: "Quad", imgSrc: "/quad.png" },
    { id: 10, label: "Shoulder", imgSrc: "/shoulder.png" },
    { id: 11, label: "Legs", imgSrc: "/legs.png" },
    { id: 11, label: "Abs", imgSrc: "/Abs.png" },
    // Add more muscle groups as needed
  ];
  
  const MuscleGroups = () => (
    <div className="flex flex-col items-center text-white">
      <h2 className="text-xl font-semibold mb-4">Select a muscle group to target</h2>
      <div className="grid grid-cols-3 gap-4">
        {muscleGroups.map((group) => (
          <div key={group.id} className="bg-gray-700 p-4 rounded hover:border-blue-500 border">
            <img src={group.imgSrc} alt={group.label} className="w-full h-auto" />
          </div>
        ))}
      </div>
    </div>
  );
  
  export default MuscleGroups;
  