import React from 'react'
import { Link, useNavigate } from 'react-router'
import { useState } from 'react'
import { useAuth } from '../Hook/useAuth.js'




const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const navigate = useNavigate()
  const { loading, handleLogin } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleLogin({ email, password })
    navigate("/")
  }

  if (loading) {
    return <main><h1>Loading....</h1></main>
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">

    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Login
      </h1>
      <p className="text-sm text-gray-500 text-center mt-1">
        Login to your account
      </p>
    </div>

    <form onSubmit = {handleSubmit} className="space-y-5">

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email
        </label>

        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          onChange={(e)=>{setEmail(e.target.value)}}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>

        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          onChange={(e)=>{setPassword(e.target.value)}}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-md outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2.5 rounded-md font-medium hover:bg-blue-700 transition"
      >
        Login
      </button>

    </form>
    <p>Don&apos;t have an account <Link to={"/register"}>Register</Link></p>
  </div>
</main>
  )
}

export default Login
