const NutrientSection = ({ title, nutrients, handleInputChange, disabled, visible, placeholder="" }) => {
    if (!visible) return null; // If visible is false, don't render the component
    
    return (
        <div>
            <h5 className="text-md font-semibold text-white mb-2">{title}</h5>
            {nutrients.map(({ label, name, value }) => (
                <div key={name} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <label className="text-gray-400">{label}</label>
                    <input
                        type="text"
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        disabled={disabled}
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-lightText placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary focus:border-transparent"
                        placeholder={placeholder}
                    />
                </div>
            ))}
        </div>
    );
};

export default NutrientSection;
