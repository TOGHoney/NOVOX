import React, { useState } from 'react';
import { login } from '../api/authService';

const Login = ({ setView }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(formData);
            setView('dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-4xl font-bold text-indigo-600">usshorts</h1>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={onSubmit}>
                        {error && <p className="text-red-600 text-sm">{error}</p>}
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input name="email" type="email" required onChange={onChange} className="mt-1 block w-full border border-gray-300 rounded-lg p-2" />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input name="password" type="password" required onChange={onChange} className="mt-1 block w-full border border-gray-300 rounded-lg p-2" />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <p className="mt-4 text-center text-sm">
                        Don't have an account? <button onClick={() => setView('signup')} className="text-indigo-600 font-bold">Sign up</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;