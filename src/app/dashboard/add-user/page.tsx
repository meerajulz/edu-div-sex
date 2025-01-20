// app/dashboard/add-user/page.tsx
import React from 'react';
import Layout from '../layout';

const AddUser = () => {
  return (

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Add New User</h1>
        <form className="max-w-md">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-2 border rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Create User
            </button>
          </div>
        </form>
      </div>

  );
};

export default AddUser; 