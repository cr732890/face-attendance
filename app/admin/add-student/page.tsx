'use client';

import { useActionState } from 'react';
import { addStudentProfile } from '@/app/admin/actions';
import Link from 'next/link';

export default function AddStudentPage() {
  const [state, formAction, pending] = useActionState(async (prevState: any, formData: FormData) => {
     return await addStudentProfile(formData);
  }, null);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <Link href="/admin" className="text-indigo-600 hover:text-indigo-800 text-sm font-semibold mb-6 inline-block">
          &larr; Back to Admin Portal
        </Link>
        <div className="bg-white py-8 px-10 shadow-xl rounded-2xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Register New Student</h2>
            <p className="mt-2 text-sm text-gray-600">
              Create a kiosk profile for a student. Their biometric setup will immediately follow.
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100">
                {state.error}
              </div>
            )}
            
            <div>
              <label htmlFor="full_name" className="block text-sm font-semibold leading-6 text-gray-900">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-50/50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-semibold leading-6 text-gray-900">
                Department
              </label>
              <div className="mt-2">
                <input
                  id="department"
                  name="department"
                  type="text"
                  placeholder="e.g. Computer Science"
                  className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-50/50"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold leading-6 text-gray-900">
                Email Address <span className="font-normal text-gray-400">(Optional - Auto-generated if blank)</span>
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="e.g. john@university.edu"
                  className="block w-full rounded-xl border-0 py-2.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-gray-50/50"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={pending}
                className="flex w-full justify-center rounded-xl bg-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {pending ? 'Registering...' : 'Register & Proceed to Camera'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
