import React from "react";

const UserListInfoModal = ({
  isOpen,
  onClose,
  usernames,
  title
}) => {

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 overflow-auto max-h-[60vh]">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <ul>
            {usernames.map((username, index) => (
              <li key={index} className="mb-2 border p-2 rounded-lg">{username}</li>
            ))}
          </ul>
          <div className="flex justify-end text-center">
            <button onClick={onClose} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-end">
                Close
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default UserListInfoModal;