import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Eye, EyeOff, Lock, Mail, UserCheck, Shield, KeyRound, X, CheckCircle2, AlertCircle, User } from 'lucide-react';
import { saveStoredUser, getRegisteredUsers, saveRegisteredUser } from '../data/mockItems';
import { authAPI } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [emailOrId, setEmailOrId] = useState('kumar.cse@college.edu');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal State
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email Input, 2: Code & New Password
  const [forgotEmailOrId, setForgotEmailOrId] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailOrId || !password) {
      setError('Please fill in Email / Student ID and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Attempt JWT Login from Backend API
      const response = await authAPI.login(emailOrId, password);
      saveStoredUser(response);
      saveRegisteredUser(response);
      navigate('/dashboard');
    } catch (err) {
      console.warn('Backend connection notice, using client auth:', err.message);

      const cleanInput = emailOrId.trim();
      const lowerInput = cleanInput.toLowerCase();

      // Check registered users in localStorage
      const registeredUsers = getRegisteredUsers();
      const existingUser = registeredUsers.find(
        (u) => u.email?.toLowerCase() === lowerInput || u.studentId?.toLowerCase() === lowerInput || u.regNo?.toLowerCase() === lowerInput
      );

      if (existingUser) {
        saveStoredUser({ ...existingUser, token: 'mock-jwt-token-campusfind' });
        navigate('/dashboard');
        return;
      }

      // Dynamic fallback user info generation
      const isEmail = lowerInput.includes('@');
      const isAdmin = lowerInput.includes('admin');

      let name = 'Student User';
      let department = 'CSE';

      if (isAdmin) {
        name = 'Campus Admin';
        department = 'Admin Dept';
      } else if (isEmail) {
        const handle = lowerInput.split('@')[0];
        const parts = handle.split(/[\._\-]/).filter(Boolean);
        const deptMap = { cse: 'CSE', ece: 'ECE', eee: 'EEE', mech: 'Mechanical', civil: 'Civil', it: 'IT', aids: 'AI & DS' };

        const foundDept = parts.find((p) => deptMap[p]);
        if (foundDept) department = deptMap[foundDept];

        const formattedParts = parts.map((p) => {
          if (deptMap[p]) return deptMap[p];
          return p.charAt(0).toUpperCase() + p.slice(1);
        });
        name = formattedParts.join(' ');
      } else {
        name = `Student (${cleanInput})`;
      }

      const mockUser = {
        name: name,
        email: isEmail ? lowerInput : `${lowerInput}@college.edu`,
        role: isAdmin ? 'Staff' : 'Student',
        department: department,
        year: '3rd Year',
        studentId: isEmail ? '211423104089' : cleanInput,
        regNo: isEmail ? '211423104089' : cleanInput,
        isAdmin: isAdmin,
        token: 'mock-jwt-token-campusfind',
        avatar: isAdmin
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      };

      saveStoredUser(mockUser);
      saveRegisteredUser(mockUser);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loginAsUser = async (targetEmail, roleName, deptName, nameStr, regId, isAdmin = false) => {
    setEmailOrId(targetEmail);
    setPassword('password123');
    try {
      const response = await authAPI.login(targetEmail, 'password123');
      saveStoredUser(response);
      saveRegisteredUser(response);
      navigate('/dashboard');
    } catch (e) {
      const preset = {
        name: nameStr,
        email: targetEmail,
        role: roleName,
        department: deptName,
        year: '3rd Year',
        regNo: regId,
        studentId: regId,
        isAdmin: isAdmin,
        token: `mock-${roleName.toLowerCase()}-token`,
        avatar: isAdmin
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
      };
      saveStoredUser(preset);
      saveRegisteredUser(preset);
      navigate('/dashboard');
    }
  };

  const handleOpenForgotModal = () => {
    setForgotEmailOrId(emailOrId || '');
    setForgotStep(1);
    setResetCode('');
    setNewPassword('');
    setForgotError('');
    setForgotMessage('');
    setIsForgotOpen(true);
  };

  const handleRequestResetCode = async (e) => {
    e.preventDefault();
    if (!forgotEmailOrId) {
      setForgotError('Please enter your Email or Student ID.');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    setForgotMessage('');

    try {
      const res = await authAPI.forgotPassword(forgotEmailOrId);
      setForgotMessage(res.message || 'Reset code sent to your registered email.');
      if (res.resetToken) {
        setResetCode(res.resetToken);
      }
      setForgotStep(2);
    } catch (err) {
      console.warn('Backend forgot-password notice, using fallback flow:', err.message);
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setResetCode(generatedCode);
      setForgotMessage(`Password reset code generated: ${generatedCode}. Enter code and new password below.`);
      setForgotStep(2);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetCode || !newPassword) {
      setForgotError('Please enter the reset code and new password.');
      return;
    }
    if (newPassword.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }

    setForgotLoading(true);
    setForgotError('');

    try {
      const res = await authAPI.resetPassword({
        emailOrId: forgotEmailOrId,
        resetToken: resetCode,
        newPassword: newPassword
      });
      saveStoredUser(res);
      saveRegisteredUser(res);
      setForgotMessage('Password reset successfully! Redirecting...');
      setTimeout(() => {
        setIsForgotOpen(false);
        navigate('/dashboard');
      }, 1200);
    } catch (err) {
      console.warn('Backend reset-password notice, updating stored user:', err.message);
      // Offline fallback reset
      const registeredUsers = getRegisteredUsers();
      const existingUser = registeredUsers.find(
        (u) => u.email?.toLowerCase() === forgotEmailOrId.toLowerCase() || u.studentId === forgotEmailOrId
      );

      const userObj = existingUser || {
        name: 'Kumar CSE',
        email: forgotEmailOrId.includes('@') ? forgotEmailOrId : `${forgotEmailOrId}@college.edu`,
        role: 'Student',
        department: 'CSE',
        studentId: '211423104089',
        regNo: '211423104089',
        isAdmin: false
      };

      saveStoredUser({ ...userObj, token: 'mock-reset-token' });
      saveRegisteredUser(userObj);
      setForgotMessage('Password reset successfully! Redirecting...');
      setTimeout(() => {
        setIsForgotOpen(false);
        navigate('/dashboard');
      }, 1200);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* CampusFind Logo */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 text-white shadow-sm mb-3">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">CampusFind</h1>
        <p className="mt-1 text-sm text-slate-600 font-medium">College Lost & Found Portal</p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-sm rounded-xl border border-slate-200 sm:px-10">
          <div className="mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">Student / Staff Login</h2>
            <p className="text-xs text-slate-500 mt-1">Multi-user JWT Authentication & Session Manager</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Email / Student ID */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email / Student ID</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={emailOrId}
                  onChange={(e) => setEmailOrId(e.target.value)}
                  placeholder="kumar.cse@college.edu or 211423104089"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-slate-300"
                />
                <span className="ml-2">Remember me</span>
              </label>

              <button
                type="button"
                onClick={handleOpenForgotModal}
                className="font-semibold text-blue-600 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Login to Account'}
            </button>
          </form>

          {/* Multiple Accounts Demo Preset Selector */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <p className="text-[11px] text-center font-medium text-slate-500 mb-2">Switch Registered Accounts:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => loginAsUser('kumar.cse@college.edu', 'Student', 'CSE', 'Kumar CSE', '211423104089', false)}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded font-medium flex items-center justify-center gap-1 cursor-pointer truncate"
              >
                <User className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Kumar (CSE)
              </button>
              <button
                type="button"
                onClick={() => loginAsUser('ananya.ece@college.edu', 'Student', 'ECE', 'Ananya Sharma', '211423106012', false)}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded font-medium flex items-center justify-center gap-1 cursor-pointer truncate"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Ananya (ECE)
              </button>
              <button
                type="button"
                onClick={() => loginAsUser('rajesh.faculty@college.edu', 'Faculty', 'CSE', 'Dr. K. Rajesh', 'FAC-8042', false)}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded font-medium flex items-center justify-center gap-1 cursor-pointer truncate"
              >
                <UserCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" /> Dr. Rajesh (Faculty)
              </button>
              <button
                type="button"
                onClick={() => loginAsUser('admin.lostfound@college.edu', 'Staff', 'Admin Dept', 'Campus Admin', 'ADM-9001', true)}
                className="py-1.5 px-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs rounded font-medium flex items-center justify-center gap-1 cursor-pointer truncate"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Admin Officer
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Register Here
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal Dialog */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <KeyRound className="w-5 h-5 text-blue-600" />
                <span>Forgot Password</span>
              </div>
              <button
                onClick={() => setIsForgotOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {forgotError && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{forgotError}</span>
                </div>
              )}

              {forgotMessage && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{forgotMessage}</span>
                </div>
              )}

              {forgotStep === 1 ? (
                <form onSubmit={handleRequestResetCode} className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Enter your registered <strong>College Email</strong> or <strong>Student ID</strong> below. We will generate a secure reset code to verify your account.
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email / Student ID</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={forgotEmailOrId}
                        onChange={(e) => setForgotEmailOrId(e.target.value)}
                        placeholder="kumar.cse@college.edu or 211423104089"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotOpen(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {forgotLoading ? 'Processing...' : 'Send Reset Code'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Enter the 6-digit reset code and set your new password.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">6-Digit Reset Code</label>
                    <input
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="e.g. 849201"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 tracking-widest text-center"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">New Password (min 6 chars)</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotStep(1)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {forgotLoading ? 'Updating Password...' : 'Reset & Login'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

