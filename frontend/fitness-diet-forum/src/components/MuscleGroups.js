// MuscleGroups.js
const muscleGroups = [
    { id: 1, label: "Chest", imgSrc: "/chest.png" },
    { id: 2, label: "Back", imgSrc: "/upper_back.png" },
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
  