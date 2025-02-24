import { Suspense, lazy, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import api from '../utils/axios';

const Banner = lazy(() => 
  new Promise(resolve => {
    const img = new Image();
    img.src = 'https://placedog.net/400x100'
    img.onload = () => resolve({ default: () => (
      <div className="relative">
        <img src={img.src} alt="dog banner" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Fetch</h1>
        </div>
      </div>
    ) })
  })
)

const Fallback = () => <div className="h-[100px] w-[400px] bg-gray-200 animate-pulse mx-auto" />

export default function Signin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await api.post('/auth/login', {
        name,
        email
      }, {
        withCredentials: true
      });
      if (response.status === 200) {
        navigate('/view');
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Suspense fallback={<Fallback />}>
            <Banner />
          </Suspense>
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                  Name
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="current-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
