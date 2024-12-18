import React, { useState, useEffect } from 'react';
import { FaPen, FaTrashAlt, FaSignOutAlt, FaUserSlash } from 'react-icons/fa';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store/userSlice';
import userIcon from '../assets/user.png';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user); // Get user data from Redux store
  const isClicked = useSelector((state) => state.click_redux_slice.isClicked);
  
  const [editing, setEditing] = useState(false);
  const [newUser, setNewUser] = useState(user);
  const [recentlyWatched, setRecentlyWatched] = useState([]); // Store recently watched movies
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // Show confirmation dialog for deleting watch history
  const [showConfirmLogout, setShowConfirmLogout] = useState(false); // Confirmation for logout
  const [showConfirmDeleteAccount, setShowConfirmDeleteAccount] = useState(false); // Confirmation for delete account

  useEffect(() => {
    const watchedMovies = JSON.parse(localStorage.getItem('recentlyWatched')) || [];
    setRecentlyWatched(watchedMovies);
    
    // Sync user data from localStorage if available
    const savedUser = JSON.parse(localStorage.getItem('user')) || null;
    if (savedUser) {
      dispatch(setUser(savedUser));
    }
  }, [dispatch]);

  const handleSaveChanges = () => {
    // Update user in Redux store
    dispatch(setUser(newUser));

    // Save updated user to localStorage
    localStorage.setItem('user', JSON.stringify(newUser));
    
    setEditing(false);
  };

  const handleDeleteMovie = (movieToRemove) => {
    const updatedMovies = recentlyWatched.filter(movie => movie.title !== movieToRemove.title);
    localStorage.setItem('recentlyWatched', JSON.stringify(updatedMovies));
    setRecentlyWatched(updatedMovies);
  };

  const handleDeleteWatchHistory = () => {
    localStorage.removeItem('recentlyWatched');
    setRecentlyWatched([]);
    setShowConfirmDelete(false);
  };

  const handleLogout = () => {
    alert('Logged out successfully!');
  };

  const handleDeleteAccount = () => {
    alert('Account deleted successfully!');
  };

  return (
    <div className={`py-16 ${isClicked ? 'bg-neutral-900 text-white' : 'bg-slate-100 text-black'}`}>
      <div className="container mx-auto px-4">
        <h2 className={`${isClicked ? 'text-white' : 'text-black'} text-3xl font-semibold mb-6 text-center`}>Your Profile</h2>
        <div className={`${isClicked ? 'bg-black' : 'bg-white'} p-6 rounded-lg shadow-lg flex flex-col md:flex-row gap-8`}>
          <div className="relative">
            <img
              src={userIcon}
              alt="Profile"
              className="w-36 h-32 rounded-full mb-4 mx-auto"
            />
            <button className={'absolute top-0 right-0 text-black bg-white p-2 rounded-full shadow-md'}>
              <FaPen size={12} />
            </button>
          </div>

          <div className="w-full">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <button
                onClick={() => setEditing(true)}
                className="text-blue-500"
              >
                <FaPen /> Edit
              </button>
            </div>
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-semibold">First Name</label>
                <input
                  type="text"
                  value={newUser.name.split(' ')[0]}
                  onChange={(e) => setNewUser({ ...newUser, name: `${e.target.value} ${newUser.name.split(' ')[1]}` })}
                  className="p-2 border rounded-lg w-full bg-transparent"
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Last Name</label>
                <input
                  type="text"
                  value={newUser.name.split(' ')[1]}
                  onChange={(e) => setNewUser({ ...newUser, name: `${newUser.name.split(' ')[0]} ${e.target.value}` })}
                  className="p-2 border rounded-lg w-full bg-transparent"
                  disabled={!editing}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Email</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="p-2 border rounded-lg w-full bg-transparent"
                  disabled={!editing}
                />
              </div>
              {editing && (
                <button
                  onClick={handleSaveChanges}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mt-4"
                >
                  Save Changes
                </button>
              )}
            </div>

            <div className="flex justify-between gap-4 mt-6">
              <button
                onClick={() => setShowConfirmLogout(true)}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
              >
                <FaSignOutAlt /> Logout
              </button>

              <button
                onClick={() => setShowConfirmDeleteAccount(true)}
                className="text-red-500 mt-4"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Watch History Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold">Recently Watched</h3>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete Watch History
            </button>
          </div>

          {recentlyWatched.length === 0 ? (
            <p className="text-center text-lg">No recently watched movies</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentlyWatched.map((movie, index) => (
                <div key={index} className="relative border p-4 rounded-lg">
                  <FaTrashAlt
                    onClick={() => handleDeleteMovie(movie)}
                    className="absolute top-2 right-2 text-red-500 cursor-pointer"
                    size={20}
                  />
                  <h4 className="font-semibold">{movie.title}</h4>
                  <p className="text-sm text-neutral-400">
                    Watched on: {moment(movie.watchedOn).format('MMMM Do YYYY')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmation Modals */}
        {showConfirmDelete && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-80">
            <h3 className={isClicked? 'text-xl text-black font-semibold mb-4':'text-xl font-semibold mb-4'}>Are you sure?</h3>
              <p className="text-sm text-gray-600 mb-4">This will delete your entire watch history. This action cannot be undone.</p>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteWatchHistory}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {showConfirmLogout && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-80">
              <h3 className={isClicked? 'text-xl text-black font-semibold mb-4':'text-xl font-semibold mb-4'}>Are you sure you want to log out?</h3>
              <div className="flex gap-4">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Yes, Log Out
                </button>
                <button
                  onClick={() => setShowConfirmLogout(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Account Confirmation */}
        {showConfirmDeleteAccount && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-80">
            <h3 className={isClicked? 'text-xl text-black font-semibold mb-4':'text-xl font-semibold mb-4'}>Are you sure you want to delete your account?</h3>
              <div className="flex gap-4">
                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={() => setShowConfirmDeleteAccount(false)}
                  className="px-4 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
