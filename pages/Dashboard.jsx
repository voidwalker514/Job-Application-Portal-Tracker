import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('Applied');
  const [filter, setFilter] = useState('All');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/jobs', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs', error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/jobs', { company, position, status }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setCompany('');
      setPosition('');
      setStatus('Applied');
      fetchJobs();
    } catch (error) {
      console.error('Error adding job', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      try {
        await axios.delete(`http://localhost:5000/api/jobs/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job', error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/jobs/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      fetchJobs();
    } catch (error) {
      console.error('Error updating job status', error);
    }
  };

  const filteredJobs = filter === 'All' ? jobs : jobs.filter(job => job.status === filter);

  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Job Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        {/* Add Job Form */}
        <div className="bg-white p-6 rounded shadow border border-gray-200 col-span-1 h-fit">
          <h2 className="text-xl font-semibold mb-4">Add New Application</h2>
          <form onSubmit={handleAddJob}>
            <input type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} required className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-300" />
            <input type="text" placeholder="Position / Role" value={position} onChange={(e) => setPosition(e.target.value)} required className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-300" />
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-300">
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">Save Application</button>
          </form>
        </div>

        {/* Job List */}
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Applications ({filteredJobs.length})</h2>
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 border rounded text-sm bg-white shadow-sm">
              <option value="All">All Statuses</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <p className="text-gray-500">No applications found.</p>
            ) : (
              filteredJobs.map(job => (
                <div key={job._id} className="bg-white p-4 rounded shadow border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{job.position}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <span className="text-xs text-gray-400">Applied on: {new Date(job.dateApplied).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <select 
                      value={job.status} 
                      onChange={(e) => handleStatusChange(job._id, e.target.value)}
                      className={`text-sm px-2 py-1 rounded font-semibold focus:outline-none cursor-pointer
                        ${job.status === 'Applied' ? 'bg-blue-100 text-blue-800' : 
                          job.status === 'Interview' ? 'bg-yellow-100 text-yellow-800' : 
                          job.status === 'Offer' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interview">Interview</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <button onClick={() => handleDelete(job._id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
