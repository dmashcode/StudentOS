import { useState } from 'react'
import { getErrorMessage } from '../api/errors'
import SelectField from '../components/SelectField'
import TextField from '../components/TextField'
import { EDUCATION_LEVELS } from '../constants/education'
import { useAuth } from '../context/AuthContext'

export default function ProfilePage() {
  const { profile, saveProfile } = useAuth()
  const [fullName, setFullName] = useState(profile.full_name)
  const [educationLevel, setEducationLevel] = useState(profile.education_level ?? '')
  const [institution, setInstitution] = useState(profile.institution ?? '')
  const [course, setCourse] = useState(profile.course ?? '')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  function edit(setter) {
    return (event) => {
      setter(event.target.value)
      setSaved(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaved(false)
    setSaving(true)
    try {
      await saveProfile({
        full_name: fullName,
        education_level: educationLevel || null,
        institution,
        course,
      })
      setSaved(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-medium">Your profile</h1>
      <form onSubmit={handleSubmit} className="glass max-w-xl space-y-4 p-8">
        <TextField
          id="fullName"
          label="Full name"
          value={fullName}
          onChange={edit(setFullName)}
          required
          maxLength={100}
          autoComplete="name"
        />
        <TextField
          id="email"
          label="Email (cannot be changed)"
          value={profile.email}
          readOnly
        />
        <SelectField
          id="educationLevel"
          label="Education level"
          value={educationLevel}
          onChange={edit(setEducationLevel)}
        >
          <option value="">Select...</option>
          {EDUCATION_LEVELS.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </SelectField>
        <TextField
          id="institution"
          label="Institution"
          value={institution}
          onChange={edit(setInstitution)}
          maxLength={150}
          placeholder="School, college or coaching"
        />
        <TextField
          id="course"
          label="Course"
          value={course}
          onChange={edit(setCourse)}
          maxLength={100}
          placeholder="e.g. B.Tech CSE, NEET, UPSC"
        />
        {error && (
          <p role="alert" className="rounded-xl bg-rose-100 px-4 py-2 text-sm text-rose-800">
            {error}
          </p>
        )}
        {saved && (
          <p role="status" className="rounded-xl bg-emerald-100 px-4 py-2 text-sm text-emerald-800">
            Saved
          </p>
        )}
        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-sky-700 px-7 py-3 font-medium text-white shadow-lg hover:bg-sky-800 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}